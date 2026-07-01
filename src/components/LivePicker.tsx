import { useAdmin } from '../store/admin'
import { won, salePrice, gradient } from '../lib/format'

/** "상품 담기" picker drawer for the live editor. Always mounted; shows when picker=true. */
export default function LivePicker() {
  const picker = useAdmin((s) => s.picker)
  const products = useAdmin((s) => s.products)
  const pickerSel = useAdmin((s) => s.pickerSel)
  const closePicker = useAdmin((s) => s.closePicker)
  const togglePick = useAdmin((s) => s.togglePick)
  const confirmPicker = useAdmin((s) => s.confirmPicker)

  if (!picker) return null
  const count = Object.keys(pickerSel).filter((k) => pickerSel[k]).length

  return (
    <>
      <div
        onClick={closePicker}
        className="absolute inset-0 z-[60] animate-adFadeFast"
        style={{ background: 'rgba(30,25,20,.4)' }}
      />
      <div className="ad-scroll absolute bottom-0 right-0 top-0 z-[70] flex w-[460px] animate-adSlideR flex-col bg-card shadow-[-20px_0_50px_-20px_rgba(0,0,0,.3)]">
        <div className="flex flex-none items-center justify-between border-b border-line px-6 py-[22px]">
          <div>
            <div className="text-[17px] font-extrabold">상품 담기</div>
            <div className="mt-[2px] text-xs text-muted">
              카탈로그에서 이 라이브에 판매할 상품을 선택
            </div>
          </div>
          <div
            onClick={closePicker}
            className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[10px] bg-soft text-base text-muted"
          >
            ✕
          </div>
        </div>

        <div className="ad-scroll flex-1 overflow-y-auto px-[18px] py-[14px]">
          {products.map((p) => {
            const on = !!pickerSel[p.id]
            const thumbA = p.images[0].url || p.images[0].a
            const thumbB = p.images[0].url || p.images[0].b
            return (
              <div
                key={p.id}
                onClick={() => togglePick(p.id)}
                className={`mb-2 flex cursor-pointer items-center gap-3 rounded-[12px] border-[1.5px] p-[11px] ${
                  on ? 'border-accent bg-accentSoft' : 'border-line bg-card'
                }`}
              >
                <span
                  className={`flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[7px] border-[1.5px] text-white ${
                    on ? 'border-accent bg-accent' : 'border-[#CFC9BE] bg-transparent'
                  }`}
                >
                  {on && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M4 12l5 5L20 6" />
                    </svg>
                  )}
                </span>
                <div
                  className="h-[46px] w-[38px] flex-none rounded-[8px]"
                  style={{
                    background: p.images[0].url
                      ? `center / cover no-repeat url(${p.images[0].url})`
                      : gradient(thumbA, thumbB),
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] font-bold">
                    {p.name}
                  </div>
                  <div className="mt-[2px] text-[11.5px] text-muted">
                    {p.code} · {won(salePrice(p))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-none items-center gap-[10px] border-t border-line px-6 py-[14px]">
          <div className="flex-1 text-[13px] text-muted">{count}개 선택됨</div>
          <div
            onClick={confirmPicker}
            className="flex h-[50px] cursor-pointer items-center justify-center rounded-[13px] bg-accent px-6 text-[15px] font-extrabold text-white"
          >
            담기
          </div>
        </div>
      </div>
    </>
  )
}
