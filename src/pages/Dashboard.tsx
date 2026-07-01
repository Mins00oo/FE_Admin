import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useAdmin,
  waitCount,
  excCount,
  bestSellers,
  liveSummary,
} from '../store/admin'
import { won, statusMeta, gradient } from '../lib/format'
import StatCard from '../components/StatCard'

/**
 * 대시보드 — backoffice.dc.html isDash 섹션(라인 62~140) 충실 재현.
 * 스탯카드4 · 라이브 배너 · 입금 확인 필요 · 판매 TOP5 · 최근 주문 · 라이브 편성.
 */
export default function Dashboard() {
  const nav = useNavigate()
  const orders = useAdmin((s) => s.orders)
  const products = useAdmin((s) => s.products)
  const lives = useAdmin((s) => s.lives)
  const confirmDeposit = useAdmin((s) => s.confirmDeposit)

  const wait = useAdmin(waitCount)
  const exc = useAdmin(excCount)
  // 파생 컬렉션(새 배열/객체)을 zustand 셀렉터로 반환하면 무한 재렌더가 나므로
  // 구독한 원시 상태(products/lives/orders)에서 useMemo로 계산한다.
  const top5 = useMemo(() => bestSellers({ products }), [products])
  const summary = useMemo(() => liveSummary({ lives, orders }), [lives, orders])

  // 스탯카드 4 (backoffice.dc.html statCardsBase)
  const cards = [
    {
      label: '입금 대기',
      value: wait + '건',
      hint: '무통장 입금 확인 필요',
      icon: '⏳',
      iconBgClass: 'bg-amberSoft',
      iconFgClass: 'text-amber',
      valueColor: wait > 0 ? '#B26A00' : '#28231D',
      go: () => nav('/orders'),
    },
    {
      label: '만료·늦은입금',
      value: exc + '건',
      hint: '복구/환불 처리 대기',
      icon: '⚠',
      iconBgClass: 'bg-delSoft',
      iconFgClass: 'text-del',
      valueColor: exc > 0 ? '#D6402E' : '#28231D',
      go: () => nav('/exceptions'),
    },
    {
      label: '오늘 주문',
      value: orders.length + '건',
      hint: '매출 ' + won(summary.revenue),
      icon: '🧾',
      iconBgClass: 'bg-skySoft',
      iconFgClass: 'text-sky',
      valueColor: '#28231D',
      go: () => nav('/orders'),
    },
    {
      label: '라이브 편성 상품',
      value: summary.itemCount + '개',
      hint: '현재 방송 노출 상품',
      icon: '◉',
      iconBgClass: 'bg-okSoft',
      iconFgClass: 'text-ok',
      valueColor: '#28231D',
      go: () => nav('/lives'),
    },
  ]

  // 입금 확인 필요 (wait, 최대 4)
  const waitList = orders.filter((o) => o.status === 'wait').slice(0, 4)

  // 최근 주문 (최대 5)
  const recent = orders.slice(0, 5)

  // 라이브 편성 (day 오름차순, 최대 4)
  const dashLives = [...lives].sort((a, b) => a.day - b.day).slice(0, 4)

  const rankBg = (rank: number) =>
    rank === 1 ? '#E4572E' : rank === 2 ? '#C98A2E' : rank === 3 ? '#B0977A' : '#C9C0B4'

  const prodName = (id: string) => products.find((p) => p.id === id)?.name || ''

  return (
    <div className="animate-adFade">
      {/* 스탯카드 4 */}
      <div className="grid grid-cols-4 gap-4">
        {cards.map((c) => (
          <StatCard
            key={c.label}
            label={c.label}
            value={c.value}
            hint={c.hint}
            icon={c.icon}
            iconBgClass={c.iconBgClass}
            iconFgClass={c.iconFgClass}
            valueColor={c.valueColor}
            onClick={c.go}
          />
        ))}
      </div>

      {/* 라이브 배너 */}
      <div
        className="mt-4 flex flex-wrap items-center gap-7 rounded-[20px] px-6 py-[22px] text-white"
        style={{ background: 'linear-gradient(135deg,#2A231D,#3E342B)' }}
      >
        <div className="min-w-[200px] flex-none">
          {summary.isLive && (
            <span className="inline-flex items-center gap-[6px] rounded-full bg-accent px-[11px] py-[5px] text-xs font-extrabold">
              <span className="h-[6px] w-[6px] animate-adPulse rounded-full bg-white" />
              LIVE 방송 중
            </span>
          )}
          <div className="mt-3 max-w-[240px] text-lg font-extrabold leading-[1.35]">
            {summary.title}
          </div>
          <div className="mt-[7px] text-[12.5px]" style={{ color: '#C9C0B4' }}>
            👀 실시간 시청자 {summary.viewers.toLocaleString('ko-KR')}명 · 편성 상품{' '}
            {summary.itemCount}개
          </div>
        </div>
        <div className="grid min-w-[280px] flex-1 grid-cols-3 gap-3">
          <div className="rounded-[14px] px-4 py-[15px]" style={{ background: 'rgba(255,255,255,.07)' }}>
            <div className="text-xs" style={{ color: '#C9C0B4' }}>방송 주문</div>
            <div className="mt-[6px] text-[23px] font-extrabold">{summary.orders}건</div>
          </div>
          <div className="rounded-[14px] px-4 py-[15px]" style={{ background: 'rgba(255,255,255,.07)' }}>
            <div className="text-xs" style={{ color: '#C9C0B4' }}>방송 매출</div>
            <div className="mt-[6px] text-[23px] font-extrabold">{won(summary.revenue)}</div>
          </div>
          <div className="rounded-[14px] px-4 py-[15px]" style={{ background: 'rgba(255,255,255,.07)' }}>
            <div className="text-xs" style={{ color: '#C9C0B4' }}>객단가</div>
            <div className="mt-[6px] text-[23px] font-extrabold">{won(summary.aov)}</div>
          </div>
        </div>
      </div>

      {/* 입금 확인 필요 + 판매 TOP5 */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* 입금 확인 필요 */}
        <div className="rounded-[18px] border border-line bg-card px-[22px] py-5">
          <div className="mb-[6px] flex items-center justify-between">
            <span className="text-[15px] font-extrabold">입금 확인 필요</span>
            <span
              onClick={() => nav('/orders')}
              className="cursor-pointer text-[12.5px] font-bold text-accent"
            >
              주문 관리 →
            </span>
          </div>
          <div className="mb-[10px] text-[12.5px] text-muted">
            무통장 입금 대기 주문이에요. 입금 확인 후 배송 준비하세요.
          </div>
          {waitList.length > 0 ? (
            waitList.map((o) => (
              <div
                key={o.id}
                onClick={() => nav('/orders/' + o.id)}
                className="flex cursor-pointer items-center gap-3 border-b border-line py-[11px]"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-bold">
                    {o.depositor || o.buyer.name}{' '}
                    <span className="text-xs font-medium text-muted">· {o.no}</span>
                  </div>
                  <div className="mt-[2px] text-[11.5px] text-muted">입금기한 {o.deadline}</div>
                </div>
                <span className="flex-none text-[13.5px] font-extrabold">{won(o.total)}</span>
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    confirmDeposit(o.id)
                  }}
                  className="flex-none cursor-pointer rounded-[9px] bg-ok px-3 py-[7px] text-xs font-bold text-white"
                >
                  입금확인
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-[13px] text-muted">
              입금 대기 중인 주문이 없어요.
            </div>
          )}
        </div>

        {/* 판매 TOP 5 */}
        <div className="rounded-[18px] border border-line bg-card px-[22px] py-5">
          <div className="mb-[14px] text-[15px] font-extrabold">판매 TOP 5</div>
          {top5.map((b) => (
            <div key={b.id} className="flex items-center gap-[13px] border-b border-line py-[10px]">
              <span
                className="flex h-6 w-6 flex-none items-center justify-center rounded-[8px] text-xs font-extrabold text-white"
                style={{ background: rankBg(b.rank) }}
              >
                {b.rank}
              </span>
              <div
                className="h-[46px] w-[38px] flex-none rounded-[8px]"
                style={{ background: gradient(b.thumbA, b.thumbB) }}
              />
              <div className="min-w-0 flex-1">
                <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] font-bold">
                  {b.name}
                </div>
                <div className="mt-[2px] text-[11.5px] text-muted">
                  {b.sold.toLocaleString('ko-KR')}개 판매
                </div>
              </div>
              <div className="flex-none text-[13.5px] font-extrabold">{won(b.revenue)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 최근 주문 + 라이브 편성 */}
      <div className="mt-4 grid grid-cols-[1.35fr_1fr] gap-4">
        {/* 최근 주문 */}
        <div className="rounded-[18px] border border-line bg-card px-[22px] py-5">
          <div className="mb-[14px] flex items-center justify-between">
            <span className="text-[15px] font-extrabold">최근 주문</span>
            <span
              onClick={() => nav('/orders')}
              className="cursor-pointer text-[12.5px] font-bold text-accent"
            >
              주문 관리 →
            </span>
          </div>
          {recent.map((o) => {
            const m = statusMeta(o.status)
            const items = o.items.map((it) => prodName(it.productId)).join(', ')
            return (
              <div
                key={o.id}
                onClick={() => nav('/orders/' + o.id)}
                className="flex cursor-pointer items-center gap-3 border-b border-line py-[11px]"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold">
                    {o.buyer.name}{' '}
                    <span className="text-xs font-medium text-muted">· {o.date}</span>
                  </div>
                  <div className="mt-[2px] overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] text-muted">
                    {items}
                  </div>
                </div>
                <span
                  className={`flex-none rounded-full px-[10px] py-1 text-[11.5px] font-extrabold ${m.textClass} ${m.bgClass}`}
                >
                  {m.label}
                </span>
                <div className="flex-none text-[13.5px] font-extrabold">{won(o.total)}</div>
              </div>
            )
          })}
        </div>

        {/* 라이브 편성 */}
        <div className="rounded-[18px] border border-line bg-card px-[22px] py-5">
          <div className="mb-[14px] flex items-center justify-between">
            <span className="text-[15px] font-extrabold">라이브 편성</span>
            <span
              onClick={() => nav('/lives')}
              className="cursor-pointer text-[12.5px] font-bold text-accent"
            >
              라이브 →
            </span>
          </div>
          {dashLives.map((l) => {
            const isLive = l.status === 'live'
            return (
              <div key={l.id} className="flex items-center gap-3 border-b border-line py-[11px]">
                <div
                  className="h-[9px] w-[9px] flex-none rounded-full"
                  style={{ background: isLive ? '#E4572E' : '#D5CEC3' }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-bold">{l.title}</div>
                  <div className="mt-[2px] text-[11.5px] text-muted">
                    {l.date} {l.start} · 상품 {l.items.length}개
                  </div>
                </div>
                {isLive && (
                  <span className="rounded-full bg-accent px-[9px] py-1 text-[11px] font-extrabold text-white">
                    LIVE
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
