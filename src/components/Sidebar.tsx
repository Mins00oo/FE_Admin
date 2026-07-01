import { NavLink, useLocation } from 'react-router-dom'
import { useAdmin, waitCount, excCount } from '../store/admin'

interface NavDef {
  to: string
  label: string
  icon: string
  badge?: number
  badgeClass?: string
}

/** Left fixed sidebar (238px) — 6 nav items with amber/del badges. */
export default function Sidebar() {
  const wait = useAdmin(waitCount)
  const exc = useAdmin(excCount)
  const loc = useLocation()

  const navDefs: NavDef[] = [
    { to: '/', label: '대시보드', icon: '▤' },
    { to: '/catalog', label: '상품 카탈로그', icon: '▦' },
    { to: '/lives', label: '라이브', icon: '◉' },
    { to: '/orders', label: '주문 관리', icon: '🧾', badge: wait, badgeClass: 'bg-amber' },
    { to: '/exceptions', label: '만료·늦은입금', icon: '⚠', badge: exc, badgeClass: 'bg-del' },
    { to: '/settings', label: '배송·결제 설정', icon: '⚙' },
  ]

  const isActive = (to: string) =>
    to === '/'
      ? loc.pathname === '/'
      : loc.pathname === to || loc.pathname.startsWith(to + '/')

  return (
    <div className="flex w-[238px] flex-none flex-col border-r border-line bg-card px-4 py-[22px]">
      <div className="flex items-center gap-[10px] px-2 pb-1">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-accent text-base font-extrabold text-white">
          해
        </div>
        <div>
          <div className="text-[15px] font-extrabold tracking-[-.01em]">해피수주</div>
          <div className="text-[11px] text-muted">셀러 백오피스</div>
        </div>
      </div>

      <div className="mt-[22px] flex flex-col gap-[3px]">
        {navDefs.map((n) => {
          const active = isActive(n.to)
          return (
            <NavLink
              key={n.to}
              to={n.to}
              className={`flex items-center gap-[11px] rounded-[12px] px-3 py-[11px] text-sm ${
                active ? 'bg-accentSoft font-extrabold text-accent' : 'font-semibold text-ink'
              }`}
            >
              <span className="flex w-5 justify-center">{n.icon}</span>
              <span className="flex-1">{n.label}</span>
              {!!n.badge && n.badge > 0 && (
                <span
                  className={`flex h-5 min-w-[20px] items-center justify-center rounded-[10px] px-[6px] text-[11px] font-extrabold text-white ${n.badgeClass}`}
                >
                  {n.badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </div>

      <div className="mt-auto flex items-center gap-[10px] rounded-[14px] bg-soft p-3">
        <div
          className="h-8 w-8 flex-none rounded-full"
          style={{ background: 'linear-gradient(140deg,#FF9EC4,#B15CFF)' }}
        />
        <div className="min-w-0">
          <div className="text-[13px] font-bold">운영자</div>
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-muted">
            admin@happysuju.com
          </div>
        </div>
      </div>
    </div>
  )
}
