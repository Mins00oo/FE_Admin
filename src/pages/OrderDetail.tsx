// 주문 상세 (/orders/:id) — backoffice.dc.html lines 273-329 + renderVals() lines 683-703.
// Left: 배송 정보 + 주문 상품. Right: 결제 정보 + 주문 상태 관리(송장 입력 + 상태 전이 액션).
// 모든 상호작용은 스토어 액션(setTracking / handleAction)으로 실제 반영.
import { useParams, useNavigate } from 'react-router-dom'
import type { Order, OrderActionType } from '../types/domain'
import { useAdmin } from '../store/admin'
import { won, statusMeta, gradient, STATUS_HINTS } from '../lib/format'
import { PAY_LABEL } from '../data/shop'
import { tokenColor } from '../lib/theme'

/** One 상태 전이 액션 버튼 spec (colors are theme-token names or raw values). */
interface ActionSpec {
  label: string
  type: OrderActionType
  bg: string
  fg: string
  border: string
}

/** Actions available per status — mirrors renderVals() lines 687-692 exactly. */
function actionsFor(status: Order['status']): ActionSpec[] {
  switch (status) {
    case 'wait':
      return [
        { label: '입금 확인 → 결제완료', type: 'confirm', bg: 'ok', fg: '#fff', border: 'ok' },
        { label: '주문 만료 처리', type: 'expire', bg: 'transparent', fg: 'muted', border: 'line' },
      ]
    case 'paid':
      return [{ label: '배송 준비로 변경', type: 'ready', bg: 'sky', fg: '#fff', border: 'sky' }]
    case 'ready':
      return [{ label: '배송 시작 (송장 등록)', type: 'ship', bg: 'accent', fg: '#fff', border: 'accent' }]
    case 'shipping':
      return [{ label: '배송 완료', type: 'done', bg: 'ok', fg: '#fff', border: 'ok' }]
    case 'late':
      return [
        { label: '입금 확인 (주문 복구)', type: 'restore', bg: 'ok', fg: '#fff', border: 'ok' },
        { label: '환불 처리', type: 'refund', bg: 'delSoft', fg: 'del', border: 'delSoft' },
      ]
    case 'expired':
      return [{ label: '주문 복구', type: 'restore', bg: 'ok', fg: '#fff', border: 'ok' }]
    default:
      return []
  }
}

/** 한 항목 카드 헤더 타이틀. */
function CardTitle({ children, mb = 14 }: { children: React.ReactNode; mb?: number }) {
  return (
    <div className="text-sm font-extrabold" style={{ marginBottom: mb }}>
      {children}
    </div>
  )
}

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const order = useAdmin((s) => s.orders.find((o) => o.id === id) || null)
  const products = useAdmin((s) => s.products)
  const setTracking = useAdmin((s) => s.setTracking)
  const handleAction = useAdmin((s) => s.handleAction)

  const goBack = () => navigate('/orders')

  // Not found (bad :id or deleted) — graceful fallback with back link.
  if (!order) {
    return (
      <div className="max-w-[1000px] animate-adFade">
        <BackLink onClick={goBack} />
        <div className="rounded-[18px] border border-line bg-card px-[22px] py-8 text-center text-sm text-muted">
          주문을 찾을 수 없어요.
        </div>
      </div>
    )
  }

  const meta = statusMeta(order.status)
  const prodOf = (pid: string) => products.find((p) => p.id === pid)

  const shipRows: { label: string; value: string }[] = [
    { label: '받는 분', value: order.buyer.name },
    { label: '연락처', value: order.buyer.phone },
    { label: '주소', value: order.address },
    { label: '상세주소', value: order.addrDetail || '-' },
    { label: '요청사항', value: order.memo || '-' },
  ]

  const subtotal = order.items.reduce((a, it) => a + it.unitPrice * it.qty, 0)

  // showDeposit: 무통장 + (입금대기/만료/늦은입금) — renderVals() line 698.
  const showDeposit =
    order.method === 'bank' &&
    (order.status === 'wait' || order.status === 'expired' || order.status === 'late')
  // showTracking: 배송준비/배송중 — renderVals() line 700.
  const showTracking = order.status === 'ready' || order.status === 'shipping'

  const actions = actionsFor(order.status)

  return (
    <div className="max-w-[1000px] animate-adFade">
      <BackLink onClick={goBack} />

      {/* 헤더: 주문번호 · 상태 · 일시 */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="text-[22px] font-extrabold tracking-[-0.01em]">{order.no}</div>
        <span
          className="rounded-full px-[13px] py-[6px] text-[12.5px] font-extrabold"
          style={{ color: tokenColor(meta.color), background: tokenColor(meta.bg) }}
        >
          {meta.label}
        </span>
        <span className="text-[12.5px] text-muted">{order.date}</span>
      </div>

      {/* 본문 2단 그리드 (1.3fr / 1fr) */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.3fr_1fr]">
        {/* ── 좌측: 배송 정보 + 주문 상품 ── */}
        <div className="flex flex-col gap-4">
          <section className="rounded-[18px] border border-line bg-card px-[22px] py-5">
            <CardTitle>배송 정보</CardTitle>
            {shipRows.map((r) => (
              <div key={r.label} className="flex gap-[14px] py-2 text-[13.5px]">
                <span className="w-[82px] flex-none text-muted">{r.label}</span>
                <span className="flex-1 font-semibold leading-[1.5]">{r.value}</span>
              </div>
            ))}
          </section>

          <section className="rounded-[18px] border border-line bg-card px-[22px] py-5">
            <CardTitle mb={6}>주문 상품</CardTitle>
            {order.items.map((it, i) => {
              const p = prodOf(it.productId)
              const optStr = [it.color, it.size].filter(Boolean).join(' / ') || '기본'
              const thumbA = p ? p.images[0].a : '#ccc'
              const thumbB = p ? p.images[0].b : '#bbb'
              return (
                <div
                  key={`${it.productId}-${i}`}
                  className="flex items-center gap-3 border-b border-line py-3"
                >
                  <div
                    className="h-[52px] w-[44px] flex-none rounded-[9px]"
                    style={{ background: gradient(thumbA, thumbB) }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-bold">{p ? p.name : '상품'}</div>
                    <div className="mt-0.5 text-xs text-muted">
                      {optStr} · {it.qty}개
                    </div>
                  </div>
                  <div className="text-[13.5px] font-extrabold">{won(it.unitPrice * it.qty)}</div>
                </div>
              )
            })}
          </section>
        </div>

        {/* ── 우측: 결제 정보 + 주문 상태 관리 ── */}
        <div className="flex flex-col gap-4">
          <section className="rounded-[18px] border border-line bg-card px-[22px] py-5">
            <CardTitle>결제 정보</CardTitle>
            <div className="flex justify-between py-1.5 text-[13px]">
              <span className="text-muted">결제수단</span>
              <span className="font-bold">{PAY_LABEL[order.method]}</span>
            </div>
            {showDeposit && (
              <>
                <div className="flex justify-between py-1.5 text-[13px]">
                  <span className="text-muted">입금자명</span>
                  <span className="font-bold">{order.depositor || '-'}</span>
                </div>
                <div className="flex justify-between py-1.5 text-[13px]">
                  <span className="text-muted">입금기한</span>
                  <span className="font-bold text-amber">{order.deadline || '-'}</span>
                </div>
              </>
            )}
            <div className="my-2.5 h-px bg-line" />
            <div className="flex justify-between py-[5px] text-[13px]">
              <span className="text-muted">상품 금액</span>
              <span className="font-bold">{won(subtotal)}</span>
            </div>
            <div className="flex justify-between py-[5px] text-[13px]">
              <span className="text-muted">배송비</span>
              <span className="font-bold">{order.shippingFee > 0 ? won(order.shippingFee) : '무료'}</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="font-extrabold">총 결제금액</span>
              <span className="text-lg font-extrabold text-accent">{won(order.total)}</span>
            </div>
          </section>

          <section className="rounded-[18px] border border-line bg-card px-[22px] py-5">
            <CardTitle mb={6}>주문 상태 관리</CardTitle>
            <div className="mb-[14px] text-xs text-muted">{STATUS_HINTS[order.status]}</div>

            {showTracking && (
              <div className="mb-3">
                <div className="mb-1.5 text-xs font-bold">송장번호</div>
                <input
                  value={order.tracking}
                  onChange={(e) => setTracking(order.id, e.target.value)}
                  placeholder="택배사·송장번호 입력"
                  className="h-11 w-full rounded-[11px] border-[1.5px] border-line bg-soft px-[13px] text-[13px] text-ink outline-none focus:border-accent"
                />
              </div>
            )}

            <div className="flex flex-col gap-[9px]">
              {actions.map((a) => (
                <button
                  key={a.type}
                  type="button"
                  onClick={() => handleAction(order.id, a.type)}
                  className="flex h-12 items-center justify-center rounded-xl border-[1.5px] text-sm font-extrabold transition-opacity hover:opacity-90"
                  style={{
                    background: tokenColor(a.bg),
                    color: tokenColor(a.fg),
                    borderColor: tokenColor(a.border),
                  }}
                >
                  {a.label}
                </button>
              ))}
              {actions.length === 0 && (
                <div className="py-1.5 text-center text-[12.5px] text-muted">
                  추가 처리할 상태가 없어요.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

/** "주문 목록" back link — chevron-left + muted label. */
function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-muted"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 5l-7 7 7 7" />
      </svg>
      주문 목록
    </button>
  )
}
