import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../store/admin'
import { won } from '../lib/format'
import { PAY_LABEL } from '../data/shop'
import StatusBadge from '../components/StatusBadge'
import type { Order } from '../types/domain'

// ---- order list filters (mirror backoffice.dc.html orderFilterDefs) ----
interface OrderFilterDef {
  id: string
  label: string
  match: (o: Order) => boolean
}

const ORDER_FILTERS: OrderFilterDef[] = [
  // 전체 excludes 예외 상태(만료·늦은입금) — those live in /exceptions
  { id: 'all', label: '전체', match: (o) => o.status !== 'expired' && o.status !== 'late' },
  { id: 'wait', label: '입금대기', match: (o) => o.status === 'wait' },
  { id: 'prep', label: '배송준비', match: (o) => o.status === 'paid' || o.status === 'ready' },
  { id: 'shipping', label: '배송중', match: (o) => o.status === 'shipping' },
  { id: 'done', label: '완료', match: (o) => o.status === 'done' },
]

const GRID_COLS = '1.1fr 1fr 1.9fr 1.2fr 1fr 1.2fr'

export default function Orders() {
  const navigate = useNavigate()
  const orders = useAdmin((s) => s.orders)
  const products = useAdmin((s) => s.products)
  const orderFilter = useAdmin((s) => s.orderFilter)
  const setOrderFilter = useAdmin((s) => s.setOrderFilter)
  const confirmDeposit = useAdmin((s) => s.confirmDeposit)

  // product-name lookup for the 상품 column
  const nameOf = useMemo(() => {
    const map: Record<string, string> = {}
    products.forEach((p) => {
      map[p.id] = p.name
    })
    return map
  }, [products])

  const curFilter =
    ORDER_FILTERS.find((f) => f.id === orderFilter) || ORDER_FILTERS[0]
  const rows = orders.filter(curFilter.match)

  const itemsStr = (o: Order) =>
    o.items.map((it) => `${nameOf[it.productId] || ''} x${it.qty}`).join(', ')

  return (
    <div className="animate-adFade">
      {/* ---- status filters ---- */}
      <div className="mb-[18px] flex flex-wrap gap-2">
        {ORDER_FILTERS.map((f) => {
          const active = orderFilter === f.id
          const count = orders.filter(f.match).length
          return (
            <div
              key={f.id}
              onClick={() => setOrderFilter(f.id)}
              className={`cursor-pointer rounded-full border-[1.5px] px-[15px] py-2 text-[13px] font-bold ${
                active
                  ? 'border-accent bg-accent text-white'
                  : 'border-line bg-card text-ink'
              }`}
            >
              {f.label} <span className="opacity-60">{count}</span>
            </div>
          )
        })}
      </div>

      {/* ---- orders table ---- */}
      <div className="overflow-hidden rounded-[18px] border border-line bg-card">
        {/* header row */}
        <div
          className="grid gap-3 border-b border-line bg-soft px-5 py-[14px] text-xs font-bold text-muted"
          style={{ gridTemplateColumns: GRID_COLS }}
        >
          <span>주문번호</span>
          <span>주문자</span>
          <span>상품</span>
          <span>입금·결제</span>
          <span>금액</span>
          <span>상태</span>
        </div>

        {rows.map((o) => {
          const canConfirm = o.status === 'wait'
          const showDeposit = o.status === 'wait'
          const open = () => navigate(`/orders/${o.id}`)
          return (
            <div
              key={o.id}
              className="grid items-center gap-3 border-b border-line px-5 py-[14px] text-[13px]"
              style={{ gridTemplateColumns: GRID_COLS }}
            >
              {/* 주문번호 + 날짜 */}
              <div onClick={open} className="cursor-pointer">
                <div className="text-[12.5px] font-bold">{o.no}</div>
                <div className="mt-0.5 text-[11px] text-muted">{o.date}</div>
              </div>

              {/* 주문자 + 연락처 */}
              <div onClick={open} className="cursor-pointer">
                <div className="font-semibold">{o.buyer.name}</div>
                <div className="mt-0.5 text-[11px] text-muted">{o.buyer.phone}</div>
              </div>

              {/* 상품 */}
              <div
                onClick={open}
                className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] text-[#5f5a51]"
              >
                {itemsStr(o)}
              </div>

              {/* 입금·결제 */}
              <div onClick={open} className="cursor-pointer text-xs">
                <div className="font-semibold">{PAY_LABEL[o.method] || o.method}</div>
                {showDeposit && (
                  <div className="mt-0.5 text-amber">
                    입금자 {o.depositor} · ~{o.deadline}
                  </div>
                )}
              </div>

              {/* 금액 */}
              <span onClick={open} className="cursor-pointer font-extrabold">
                {won(o.total)}
              </span>

              {/* 상태 + 입금확인 */}
              <div className="flex items-center gap-2">
                <StatusBadge status={o.status} />
                {canConfirm && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      confirmDeposit(o.id)
                    }}
                    className="cursor-pointer whitespace-nowrap rounded-lg bg-ok px-[10px] py-1.5 text-[11.5px] font-bold text-white"
                  >
                    입금확인
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {rows.length === 0 && (
          <div className="p-10 text-center text-[13px] text-muted">
            해당 상태의 주문이 없어요.
          </div>
        )}
      </div>
    </div>
  )
}
