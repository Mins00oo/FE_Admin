import { useAdmin } from '../store/admin'
import { won, salePrice, gradient } from '../lib/format'
import type { ProductTag } from '../types/domain'

const TAG_OPTIONS: ProductTag[] = ['', 'BEST', 'NEW']

/**
 * Product register/edit drawer. Always mounted in Layout; shows when editing != null.
 * NOTE: no stock input — stock is managed via live 편성.
 */
export default function ProductDrawer() {
  const editing = useAdmin((s) => s.editing)
  const draft = useAdmin((s) => s.draft)
  const sizeInput = useAdmin((s) => s.sizeInput)
  const colorName = useAdmin((s) => s.colorName)
  const colorHex = useAdmin((s) => s.colorHex)

  const closeDrawer = useAdmin((s) => s.closeDrawer)
  const setDraft = useAdmin((s) => s.setDraft)
  const setDraftImage = useAdmin((s) => s.setDraftImage)
  const addOption = useAdmin((s) => s.addOption)
  const removeOption = useAdmin((s) => s.removeOption)
  const setSizeInput = useAdmin((s) => s.setSizeInput)
  const setColorName = useAdmin((s) => s.setColorName)
  const setColorHex = useAdmin((s) => s.setColorHex)
  const saveDraft = useAdmin((s) => s.saveDraft)
  const deleteDraft = useAdmin((s) => s.deleteDraft)

  if (!editing || !draft) return null

  const isNew = editing === 'new'
  const saleStr = won(salePrice({ price: Number(draft.price) || 0, discountRate: Number(draft.discountRate) || 0 }))
  const inputCls =
    'w-full h-[46px] rounded-[11px] border-[1.5px] border-line bg-card px-[13px] text-sm text-ink outline-none'

  return (
    <>
      <div
        onClick={closeDrawer}
        className="absolute inset-0 z-40 animate-adFadeFast"
        style={{ background: 'rgba(30,25,20,.4)' }}
      />
      <div className="ad-scroll absolute bottom-0 right-0 top-0 z-50 flex w-[480px] animate-adSlideR flex-col bg-card shadow-[-20px_0_50px_-20px_rgba(0,0,0,.3)]">
        {/* header */}
        <div className="flex flex-none items-center justify-between border-b border-line px-6 py-[22px]">
          <div className="text-[17px] font-extrabold">{isNew ? '새 상품 등록' : '상품 편집'}</div>
          <div
            onClick={closeDrawer}
            className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[10px] bg-soft text-base text-muted"
          >
            ✕
          </div>
        </div>

        {/* body */}
        <div className="ad-scroll flex-1 overflow-y-auto px-6 pb-[30px] pt-[22px]">
          {/* images */}
          <div className="mb-[9px] text-[12.5px] font-bold">
            상품 이미지 <span className="font-medium text-muted">(클릭해서 업로드)</span>
          </div>
          <div className="mb-5 flex gap-[10px]">
            {draft.images.map((im, i) => (
              <label
                key={i}
                className="relative flex aspect-[3/4] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border-[1.5px] border-dashed"
                style={{
                  borderColor: im.url ? 'transparent' : '#EAE4DA',
                  background: im.url ? `center / cover no-repeat url(${im.url})` : gradient(im.a, im.b),
                }}
              >
                {!im.url && <span className="text-xs font-semibold text-muted">＋ 이미지</span>}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files && e.target.files[0]
                    if (!f) return
                    const r = new FileReader()
                    r.onload = () => setDraftImage(i, String(r.result))
                    r.readAsDataURL(f)
                  }}
                />
              </label>
            ))}
          </div>

          {/* name / code / category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="mb-[7px] block text-[12.5px] font-bold">상품명</label>
              <input
                className={inputCls}
                placeholder="상품명"
                value={draft.name}
                onChange={(e) => setDraft('name', e.target.value)}
              />
            </div>
            <div>
              <label className="mb-[7px] block text-[12.5px] font-bold">상품번호</label>
              <input
                className={inputCls}
                placeholder="HS-1000"
                value={draft.code}
                onChange={(e) => setDraft('code', e.target.value)}
              />
            </div>
            <div>
              <label className="mb-[7px] block text-[12.5px] font-bold">카테고리</label>
              <input
                className={inputCls}
                placeholder="상의"
                value={draft.category}
                onChange={(e) => setDraft('category', e.target.value)}
              />
            </div>
          </div>

          {/* tag */}
          <div className="mt-3">
            <label className="mb-[7px] block text-[12.5px] font-bold">라벨(태그)</label>
            <div className="flex gap-2">
              {TAG_OPTIONS.map((t) => {
                const active = (draft.tag || '') === t
                return (
                  <div
                    key={t || 'none'}
                    onClick={() => setDraft('tag', t)}
                    className={`cursor-pointer rounded-[10px] border-[1.5px] px-[15px] py-[9px] text-[13px] font-bold ${
                      active ? 'border-ink bg-ink text-white' : 'border-line bg-card text-ink'
                    }`}
                  >
                    {t || '없음'}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="my-5 h-px bg-line" />

          {/* price / discount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-[7px] block text-[12.5px] font-bold">정가</label>
              <div className="flex items-center overflow-hidden rounded-[11px] border-[1.5px] border-line">
                <input
                  type="number"
                  className="h-[46px] flex-1 border-none bg-card px-[13px] text-sm text-ink outline-none"
                  value={draft.price}
                  onChange={(e) => setDraft('price', Number(e.target.value) || 0)}
                />
                <span className="px-3 text-xs text-muted">원</span>
              </div>
            </div>
            <div>
              <label className="mb-[7px] block text-[12.5px] font-bold">할인율</label>
              <div className="flex items-center overflow-hidden rounded-[11px] border-[1.5px] border-line">
                <input
                  type="number"
                  className="h-[46px] flex-1 border-none bg-card px-[13px] text-sm text-ink outline-none"
                  value={draft.discountRate}
                  onChange={(e) => setDraft('discountRate', Number(e.target.value) || 0)}
                />
                <span className="px-3 text-xs text-muted">%</span>
              </div>
            </div>
          </div>
          <div className="mt-[10px] flex items-center justify-between rounded-[11px] bg-soft px-[14px] py-3">
            <span className="text-[12.5px] text-muted">실제 판매가</span>
            <span className="text-base font-extrabold text-accent">{saleStr}</span>
          </div>

          <div className="my-5 h-px bg-line" />

          {/* sizes */}
          <label className="mb-[9px] block text-[12.5px] font-bold">사이즈 옵션</label>
          <div className="mb-[10px] flex flex-wrap gap-2">
            {draft.sizes.length === 0 && (
              <span className="py-2 text-[12.5px] text-muted">옵션 없음 (프리사이즈/무옵션)</span>
            )}
            {draft.sizes.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-[6px] rounded-[9px] bg-soft py-2 pl-[13px] pr-[10px] text-[13px] font-bold"
              >
                {s}
                <span
                  onClick={() => removeOption('size', i)}
                  className="cursor-pointer text-[13px] text-muted"
                >
                  ✕
                </span>
              </div>
            ))}
          </div>
          <div className="mb-5 flex gap-2">
            <input
              className="h-[44px] flex-1 rounded-[11px] border-[1.5px] border-line bg-card px-[13px] text-[13.5px] text-ink outline-none"
              placeholder="예: M, 260, FREE"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addOption('size')
                }
              }}
            />
            <div
              onClick={() => addOption('size')}
              className="flex h-[44px] cursor-pointer items-center rounded-[11px] bg-soft px-[18px] text-[13px] font-bold text-ink"
            >
              추가
            </div>
          </div>

          {/* colors */}
          <label className="mb-[9px] block text-[12.5px] font-bold">색상 옵션</label>
          <div className="mb-[10px] flex flex-wrap gap-2">
            {draft.colors.length === 0 && (
              <span className="py-2 text-[12.5px] text-muted">옵션 없음</span>
            )}
            {draft.colors.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-[7px] rounded-[9px] bg-soft py-[7px] pl-[9px] pr-[10px] text-[13px] font-semibold"
              >
                <span
                  className="h-4 w-4 rounded-full border"
                  style={{ background: c.hex, borderColor: 'rgba(0,0,0,.12)' }}
                />
                {c.name}
                <span
                  onClick={() => removeOption('color', i)}
                  className="cursor-pointer text-[13px] text-muted"
                >
                  ✕
                </span>
              </div>
            ))}
          </div>
          <div className="mb-5 flex items-center gap-2">
            <input
              type="color"
              className="h-[44px] w-[44px] cursor-pointer rounded-[11px] border-[1.5px] border-line bg-card p-[3px]"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
            />
            <input
              className="h-[44px] flex-1 rounded-[11px] border-[1.5px] border-line bg-card px-[13px] text-[13.5px] text-ink outline-none"
              placeholder="색상명 (예: 아이보리)"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addOption('color')
                }
              }}
            />
            <div
              onClick={() => addOption('color')}
              className="flex h-[44px] cursor-pointer items-center rounded-[11px] bg-soft px-[18px] text-[13px] font-bold text-ink"
            >
              추가
            </div>
          </div>

          {/* desc / details */}
          <label className="mb-[7px] block text-[12.5px] font-bold">한줄 설명</label>
          <input
            className={`${inputCls} mb-3`}
            placeholder="상품을 한 줄로 소개"
            value={draft.desc}
            onChange={(e) => setDraft('desc', e.target.value)}
          />
          <label className="mb-[7px] block text-[12.5px] font-bold">상세 정보 (줄바꿈으로 구분)</label>
          <textarea
            className="h-24 w-full resize-none rounded-[11px] border-[1.5px] border-line bg-card px-[13px] py-[11px] text-[13.5px] leading-[1.6] text-ink outline-none"
            placeholder={'코튼 100%\n남녀공용\n모델 착용 M'}
            value={draft.details.join('\n')}
            onChange={(e) =>
              setDraft(
                'details',
                e.target.value.split('\n').filter((x) => x.trim()),
              )
            }
          />
        </div>

        {/* footer */}
        <div className="flex flex-none gap-[10px] border-t border-line px-6 py-[14px]">
          {!isNew && (
            <div
              onClick={deleteDraft}
              className="flex h-[50px] flex-none cursor-pointer items-center rounded-[13px] border-[1.5px] border-del px-5 text-sm font-bold text-del"
            >
              삭제
            </div>
          )}
          <div
            onClick={saveDraft}
            className="flex h-[50px] flex-1 cursor-pointer items-center justify-center rounded-[13px] bg-accent text-[15px] font-extrabold text-white"
          >
            {isNew ? '상품 등록' : '변경사항 저장'}
          </div>
        </div>
      </div>
    </>
  )
}
