// 만료·늦은입금 — 자동만료된 주문 + 만료 후 늦게 입금된 건 리스트 + 복구/환불.
// backoffice.dc.html: isExceptions 블록(line 331-355) + renderVals exceptionRows(line 705-711)를
// 충실히 재현. 상호작용은 스토어 handleAction('restore'|'refund')로 실제 동작.
import { useNavigate } from 'react-router-dom'
import { useAdmin, stockAvailableFor } from '../store/admin'
import type { AdminState } from '../store/admin'
import type { Order, Product } from '../types/domain'
import { won } from '../lib/format'

/** exception 주문(자동만료·늦은입금) 목록 셀렉터. */
function excList(s: Pick<AdminState, 'orders'>): Order[] {
  return s.orders.filter((o) => o.status === 'expired' || o.status === 'late')
}

/** 주문 라인 → "상품명 x수량" 문자열. 상품명은 카탈로그에서 조회. */
function itemNames(products: Product[], order: Order): string {
  return order.items
    .map((it) => {
      const p = products.find((x) => x.id === it.productId)
      return (p ? p.name : '') + ' x' + it.qty
    })
    .join(', ')
}

export default function Exceptions() {
  const navigate = useNavigate()
  const products = useAdmin((s) => s.products)
  const orders = useAdmin((s) => s.orders)
  const lives = useAdmin((s) => s.lives)
  const handleAction = useAdmin((s) => s.handleAction)
  const showToast = useAdmin((s) => s.showToast)

  const rows = excList({ orders })
  const hasExceptions = rows.length > 0

  return (
    <div className="max-w-[960px] animate-adFade">
      {/* 안내문: 무통장은 은행 연동 없어 직접 확인·처리 */}
      <div className="mb-4 text-[12.5px] leading-relaxed text-muted">
        입금기한이 지나 <b className="text-ink">자동 만료</b>된 주문과, 만료 후{' '}
        <b className="text-ink">늦게 입금</b>된 건이에요. 무통장은 은행 연동이 없어 여기서 직접
        확인·처리합니다.
      </div>

      {hasExceptions ? (
        rows.map((o) => {
          const late = o.status === 'late'
          // 복구 가능 여부 = LIVE 판매수량이 모든 라인을 커버하는지
          const canRestore = stockAvailableFor({ lives }, o)
          const tagLabel = late ? '늦은입금' : '자동만료'
          const reason = late
            ? `입금기한(${o.deadline}) 이후 입금 · 입금자 ${o.depositor || '-'}`
            : `입금기한(${o.deadline}) 초과로 자동 만료`

          const onRestore = () => {
            if (!canRestore) {
              showToast('재고(라이브 판매수량)가 부족해 복구할 수 없어요')
              return
            }
            handleAction(o.id, 'restore')
          }

          return (
            <div
              key={o.id}
              className="mb-3 rounded-2xl border border-line bg-card px-5 py-[18px]"
            >
              <div className="flex items-center gap-3">
                <span
                  className={
                    'rounded-full px-[11px] py-[5px] text-xs font-extrabold ' +
                    (late ? 'bg-amberSoft text-amber' : 'bg-[#EEE9E1] text-[#8A8075]')
                  }
                >
                  {tagLabel}
                </span>
                <div className="text-[13.5px] font-bold">{o.no}</div>
                <div className="text-[12.5px] text-muted">
                  {o.buyer.name} · {o.buyer.phone}
                </div>
                <div className="flex-1" />
                <div className="text-[15px] font-extrabold">{won(o.total)}</div>
              </div>

              <div className="mt-3 flex items-center gap-[14px] border-t border-line pt-3">
                <div className="min-w-0 flex-1 text-[12.5px] leading-relaxed text-[#6b6355]">
                  {itemNames(products, o)}
                  <br />
                  <span className="text-muted">{reason}</span>
                </div>

                {/* 상세 → 주문 상세로 이동 */}
                <button
                  type="button"
                  onClick={() => navigate('/orders/' + o.id)}
                  className="flex-none cursor-pointer px-3 py-[9px] text-[12.5px] font-bold text-muted"
                >
                  상세
                </button>

                {/* 복구 (재고 부족 시 비활성 톤 + 토스트로 안내) */}
                <button
                  type="button"
                  onClick={onRestore}
                  aria-disabled={!canRestore}
                  className={
                    'flex-none rounded-[10px] border-[1.5px] px-[14px] py-[9px] text-[12.5px] font-bold ' +
                    (canRestore
                      ? 'cursor-pointer border-ok bg-ok text-white'
                      : 'cursor-not-allowed border-line bg-soft text-muted')
                  }
                >
                  {canRestore ? '주문 복구' : '재고 부족'}
                </button>

                {/* 환불 처리 */}
                <button
                  type="button"
                  onClick={() => handleAction(o.id, 'refund')}
                  className="flex-none cursor-pointer rounded-[10px] border-[1.5px] border-delSoft bg-delSoft px-[14px] py-[9px] text-[12.5px] font-bold text-del"
                >
                  환불 처리
                </button>
              </div>
            </div>
          )
        })
      ) : (
        // 빈 상태
        <div className="rounded-2xl border border-line bg-card p-11 text-center text-[13px] text-muted">
          🎉 만료·늦은입금 건이 없어요.
        </div>
      )}
    </div>
  )
}
