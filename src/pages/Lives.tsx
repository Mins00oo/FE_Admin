// 라이브 — 좌측 월 캘린더 + 우측 선택 라이브 편집(방송 정보 + 편성 상품·수량).
// backoffice.dc.html 의 isLives 섹션(라인 175–244) 및 selLiveView(라인 663–673) 그대로.
// 공용: Calendar 컴포넌트 사용, LivePicker 는 Layout 에 상시 마운트되어 openPicker 로 표시.
import type { ChangeEvent } from 'react'
import Calendar from '../components/Calendar'
import { useAdmin, selLive } from '../store/admin'
import type { Product } from '../types/domain'
import { won, salePrice, gradient } from '../lib/format'

const DOW = ['일', '월', '화', '수', '목', '금', '토']

export default function Lives() {
  const lives = useAdmin((s) => s.lives)
  const products = useAdmin((s) => s.products)
  const selDay = useAdmin((s) => s.selDay)
  const calMonth = useAdmin((s) => s.calMonth)
  const calYear = useAdmin((s) => s.calYear)

  const selectLive = useAdmin((s) => s.selectLive)
  const prevMonth = useAdmin((s) => s.prevMonth)
  const nextMonth = useAdmin((s) => s.nextMonth)

  const setLiveField = useAdmin((s) => s.setLiveField)
  const setSelLiveLive = useAdmin((s) => s.setSelLiveLive)
  const addSelLive = useAdmin((s) => s.addSelLive)
  const removeSelLive = useAdmin((s) => s.removeSelLive)
  const setLiveItemQty = useAdmin((s) => s.setLiveItemQty)
  const moveLiveItem = useAdmin((s) => s.moveLiveItem)
  const removeLiveItem = useAdmin((s) => s.removeLiveItem)
  const openPicker = useAdmin((s) => s.openPicker)

  // The live selected by the calendar day (or null when none on that day).
  const lv = useAdmin((s) => selLive(s))

  const isJuly = calMonth === 6 && calYear === 2026
  const calLabel = `${calYear}년 ${calMonth + 1}월`
  const selDow = isJuly ? DOW[new Date(calYear, calMonth, selDay).getDay()] : ''
  const selDayLabel = isJuly ? `${calMonth + 1}월 ${selDay}일 (${selDow}) 라이브` : calLabel

  const prodById = (id: string): Product | undefined => products.find((p) => p.id === id)

  return (
    <div className="grid animate-adFade items-start gap-[18px] grid-cols-[1.15fr_1.1fr]">
      {/* 좌: 월 캘린더 (공용 컴포넌트) */}
      <Calendar
        year={calYear}
        month={calMonth}
        selDay={selDay}
        lives={lives}
        onSelectDay={selectLive}
        onPrev={prevMonth}
        onNext={nextMonth}
      />

      {/* 우: 선택 라이브 편집 */}
      <div className="rounded-[18px] border border-line bg-card px-[22px] py-5">
        <div className="mb-1 text-base font-extrabold">{selDayLabel}</div>

        {lv ? (
          <>
            <div className="mb-[14px] text-[12.5px] text-muted">
              방송 정보와 판매 상품·수량을 등록하세요.
            </div>

            {/* 방송 제목 */}
            <input
              value={lv.title}
              onChange={(e) => setLiveField(lv.id, 'title', e.target.value)}
              placeholder="방송 제목"
              className="h-[46px] w-full rounded-[11px] border-[1.5px] border-line bg-soft px-[13px] text-sm font-semibold text-ink outline-none"
            />

            {/* 시작 / 종료 */}
            <div className="mt-[10px] flex gap-[10px]">
              <div className="flex-1">
                <div className="mb-[5px] text-[11.5px] text-muted">시작</div>
                <input
                  value={lv.start}
                  onChange={(e) => setLiveField(lv.id, 'start', e.target.value)}
                  placeholder="21:00"
                  className="h-[42px] w-full rounded-[10px] border-[1.5px] border-line bg-soft px-3 text-[13px] text-ink outline-none"
                />
              </div>
              <div className="flex-1">
                <div className="mb-[5px] text-[11.5px] text-muted">종료</div>
                <input
                  value={lv.end}
                  onChange={(e) => setLiveField(lv.id, 'end', e.target.value)}
                  placeholder="23:00"
                  className="h-[42px] w-full rounded-[10px] border-[1.5px] border-line bg-soft px-3 text-[13px] text-ink outline-none"
                />
              </div>
            </div>

            {/* 라이브 링크 */}
            <div className="mt-[10px]">
              <div className="mb-[5px] text-[11.5px] text-muted">유튜브 / 틱톡 라이브 링크</div>
              <input
                value={lv.videoUrl}
                onChange={(e) => setLiveField(lv.id, 'videoUrl', e.target.value)}
                placeholder="https://youtube.com/live/... 또는 틱톡 링크"
                className="h-[44px] w-full rounded-[10px] border-[1.5px] border-line bg-soft px-[13px] text-[13px] text-ink outline-none"
              />
            </div>

            {/* LIVE 지정 라디오 + 방송 삭제 */}
            <div
              className="mt-[14px] flex items-center justify-between rounded-[11px] px-[14px] py-3"
              style={{ background: lv.status === 'live' ? 'rgba(228,87,46,.1)' : '#F3EFE8' }}
            >
              <div
                onClick={setSelLiveLive}
                className="flex cursor-pointer items-center gap-2"
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full border-2"
                  style={{ borderColor: lv.status === 'live' ? '#E4572E' : '#CFC9BE' }}
                >
                  {lv.status === 'live' && (
                    <span className="h-[10px] w-[10px] rounded-full bg-accent" />
                  )}
                </span>
                <span
                  className="text-[13px] font-extrabold"
                  style={{ color: lv.status === 'live' ? '#E4572E' : '#948C81' }}
                >
                  {lv.status === 'live' ? '라이브 중 (사용자에게 노출)' : '라이브로 지정'}
                </span>
              </div>
              <div
                onClick={removeSelLive}
                className="cursor-pointer text-[12.5px] font-bold text-del"
              >
                방송 삭제
              </div>
            </div>

            {/* 판매 상품 · 수량 헤더 + 상품 담기 */}
            <div className="mb-3 mt-[22px] flex items-center justify-between">
              <span className="text-sm font-extrabold">
                판매 상품 · 수량{' '}
                <span className="font-semibold text-muted">({lv.items.length})</span>
              </span>
              <div
                onClick={openPicker}
                className="flex cursor-pointer items-center gap-[6px] rounded-[10px] bg-ink px-[14px] py-[9px] text-[12.5px] font-bold text-white"
              >
                <span className="text-[15px] leading-none">＋</span>상품 담기
              </div>
            </div>

            {lv.items.length > 0 ? (
              <>
                {lv.items
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((it) => {
                    const p = prodById(it.productId)
                    const imgUrl = p && p.images[0].url ? p.images[0].url : ''
                    const thumbA = p ? p.images[0].a : '#ccc'
                    const thumbB = p ? p.images[0].b : '#bbb'
                    return (
                      <div
                        key={it.productId}
                        className="mb-[9px] flex items-center gap-3 rounded-[13px] border border-line p-[11px]"
                      >
                        {/* 정렬 화살표 */}
                        <div className="flex flex-none flex-col gap-[2px]">
                          <div
                            onClick={() => moveLiveItem(it.productId, -1)}
                            className="flex h-5 w-[22px] cursor-pointer items-center justify-center rounded-[6px] bg-soft text-[11px] text-muted"
                          >
                            ▲
                          </div>
                          <div
                            onClick={() => moveLiveItem(it.productId, 1)}
                            className="flex h-5 w-[22px] cursor-pointer items-center justify-center rounded-[6px] bg-soft text-[11px] text-muted"
                          >
                            ▼
                          </div>
                        </div>

                        {/* 썸네일 */}
                        <div
                          className="h-[46px] w-[38px] flex-none rounded-[8px]"
                          style={{
                            background: imgUrl
                              ? `center / cover no-repeat url(${imgUrl})`
                              : gradient(thumbA, thumbB),
                          }}
                        />

                        {/* 이름 · 코드 · 판매가 */}
                        <div className="min-w-0 flex-1">
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] font-bold">
                            {p ? p.name : '(삭제된 상품)'}
                          </div>
                          <div className="mt-[2px] text-[11.5px] text-muted">
                            {p ? p.code : ''} · {p ? won(salePrice(p)) : ''}
                          </div>
                        </div>

                        {/* 판매수량 스텝퍼 */}
                        <div className="flex-none text-center">
                          <div className="mb-[3px] text-[10.5px] text-muted">판매수량</div>
                          <div className="flex items-center overflow-hidden rounded-[9px] border-[1.5px] border-line">
                            <div
                              onClick={() => setLiveItemQty(it.productId, it.qty - 1)}
                              className="flex h-[34px] w-[30px] cursor-pointer items-center justify-center text-base"
                            >
                              −
                            </div>
                            <input
                              value={it.qty}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setLiveItemQty(it.productId, Number(e.target.value))
                              }
                              className="h-[34px] w-[46px] border-none bg-card text-center text-[13px] font-extrabold text-ink outline-none"
                            />
                            <div
                              onClick={() => setLiveItemQty(it.productId, it.qty + 1)}
                              className="flex h-[34px] w-[30px] cursor-pointer items-center justify-center text-base"
                            >
                              ＋
                            </div>
                          </div>
                        </div>

                        {/* 제거 */}
                        <div
                          onClick={() => removeLiveItem(it.productId)}
                          className="flex-none cursor-pointer px-[2px] text-[15px] text-muted"
                        >
                          ✕
                        </div>
                      </div>
                    )
                  })}

                {/* 판매수량 합계 안내 */}
                <div className="mt-[6px] rounded-[11px] bg-soft px-[14px] py-3 text-[12.5px] leading-[1.5] text-body">
                  이 라이브 판매수량 합계{' '}
                  <b>{lv.items.reduce((a, it) => a + it.qty, 0)}개</b> · 판매수량이 0이 되면 사용자
                  화면에서 <b>품절</b>로 표시돼요.
                </div>
              </>
            ) : (
              <div className="py-[26px] text-center text-[13px] leading-[1.6] text-muted">
                담긴 상품이 없어요.
                <br />
                <b>[상품 담기]</b>로 카탈로그에서 선택하세요.
              </div>
            )}
          </>
        ) : (
          <>
            <div className="py-[30px] text-center text-[13px] leading-[1.7] text-muted">
              이 날짜에 등록된 방송이 없어요.
            </div>
            <div
              onClick={addSelLive}
              className="flex cursor-pointer items-center justify-center gap-[7px] rounded-[12px] border-[1.5px] border-dashed border-line p-[13px] text-[13.5px] font-bold text-accent"
            >
              <span className="text-base leading-none">＋</span>이 날짜에 라이브 추가
            </div>
          </>
        )}
      </div>
    </div>
  )
}
