import type { LiveSession } from '../types/domain'

interface Props {
  year: number
  month: number // 0-based
  selDay: number
  lives: LiveSession[]
  onSelectDay: (day: number) => void
  onPrev: () => void
  onNext: () => void
}

const DOW = ['일', '월', '화', '수', '목', '금', '토']

/** Month calendar with LIVE/방송 pills. Live pills only render for July 2026 (seed month). */
export default function Calendar({ year, month, selDay, lives, onSelectDay, onPrev, onNext }: Props) {
  const isJuly = month === 6 && year === 2026
  const firstDow = new Date(year, month, 1).getDay()
  const daysIn = new Date(year, month + 1, 0).getDate()

  const byDay: Record<number, LiveSession[]> = {}
  lives.forEach((l) => {
    if (!byDay[l.day]) byDay[l.day] = []
    byDay[l.day].push(l)
  })

  const blanks = Array.from({ length: firstDow }, (_, i) => i)
  const days = Array.from({ length: daysIn }, (_, i) => i + 1)

  return (
    <div className="rounded-[18px] border border-line bg-card px-[22px] py-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-base font-extrabold">
          {year}년 {month + 1}월
        </div>
        <div className="flex gap-2">
          <div
            onClick={onPrev}
            className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[10px] border border-line text-base text-muted"
          >
            ‹
          </div>
          <div
            onClick={onNext}
            className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[10px] border border-line text-base text-muted"
          >
            ›
          </div>
        </div>
      </div>

      <div className="mb-[6px] grid grid-cols-7 gap-[6px]">
        {DOW.map((w, i) => (
          <div
            key={w}
            className="py-1 text-center text-xs font-bold"
            style={{ color: i === 0 ? '#D6402E' : i === 6 ? '#2A6FDB' : '#948C81' }}
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[6px]">
        {blanks.map((b) => (
          <div key={'bk' + b} className="aspect-square" />
        ))}
        {days.map((day) => {
          const bl = isJuly ? byDay[day] || [] : []
          const hasLive = bl.some((x) => x.status === 'live')
          const wd = new Date(year, month, day).getDay()
          const sel = selDay === day && isJuly
          const dayColor = sel
            ? '#E4572E'
            : wd === 0
              ? '#D6402E'
              : wd === 6
                ? '#2A6FDB'
                : '#28231D'
          return (
            <div
              key={'cd' + day}
              onClick={() => onSelectDay(day)}
              className="flex aspect-square cursor-pointer flex-col gap-1 overflow-hidden rounded-[11px] border-[1.5px] px-[7px] pb-[6px] pt-[7px]"
              style={{
                borderColor: sel ? '#E4572E' : '#EAE4DA',
                background: sel ? 'rgba(228,87,46,.1)' : '#FFFFFF',
              }}
            >
              <span className="text-[12.5px] font-bold" style={{ color: dayColor }}>
                {day}
              </span>
              {bl.length > 0 && (
                <span
                  className="max-w-full self-start overflow-hidden text-ellipsis whitespace-nowrap rounded-[6px] px-[6px] py-[2px] text-[9.5px] font-extrabold text-white"
                  style={{ background: hasLive ? '#E4572E' : '#B0977A' }}
                >
                  {hasLive ? 'LIVE' : '방송'}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-[14px] text-xs leading-[1.6] text-muted">
        날짜를 선택해 방송을 편집하세요. <b className="text-accent">LIVE</b> 방송에 담긴 상품이
        사용자에게 노출됩니다.
      </div>
    </div>
  )
}
