import { useAdmin, liveOne } from '../store/admin'

interface Props {
  title: string
  sub: string
}

/** Top header (70px) — page title/sub + LIVE indicator + date. */
export default function TopBar({ title, sub }: Props) {
  const live = useAdmin(liveOne)
  return (
    <div className="flex h-[70px] flex-none items-center justify-between border-b border-line bg-card px-7">
      <div>
        <div className="text-[19px] font-extrabold tracking-[-.01em]">{title}</div>
        <div className="mt-[2px] text-[12.5px] text-muted">{sub}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-[7px] rounded-full bg-soft px-[13px] py-2 text-[12.5px] font-bold">
          <span className="h-[7px] w-[7px] animate-adPulse rounded-full bg-accent" />
          {live ? '라이브 방송 중' : '방송 대기'}
        </div>
        <div className="text-[12.5px] text-muted">2026. 7. 1</div>
      </div>
    </div>
  )
}
