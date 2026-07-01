// 상품 카탈로그 — backoffice.dc.html (isCatalog 블록, line 142~172) 충실 재현.
// 카테고리 필터 칩(전체 + 카테고리별 count) → setCatFilter,
// 테이블(상품/상품번호/카테고리/판매가/할인/라이브 편성) — 재고 컬럼 없음,
// "상품 등록" → openNew(), 행 클릭 → openEdit(id).
import { useAdmin } from '../store/admin'
import type { LiveSession, Product } from '../types/domain'
import { gradient, salePrice, won } from '../lib/format'

// backoffice.dc.html: catFilterDefs — count 는 전체 상품 기준(필터 무관).
interface CatFilter {
  id: string
  label: string
  count: number
}

function buildCatFilters(products: Product[]): CatFilter[] {
  const cats: Record<string, number> = {}
  products.forEach((p) => {
    const c = p.category || '기타'
    cats[c] = (cats[c] || 0) + 1
  })
  return [{ id: 'all', label: '전체', count: products.length }].concat(
    Object.keys(cats).map((c) => ({ id: c, label: c, count: cats[c] })),
  )
}

// backoffice.dc.html: livesCountFor — 이 상품이 담긴 방송(라이브) 개수.
function livesCountFor(lives: LiveSession[], pid: string): number {
  return lives.filter((l) => l.items.some((it) => it.productId === pid)).length
}

// backoffice.dc.html: productRows 의 옵션 요약 문자열.
function optionSummary(p: Product): string {
  const opt: string[] = []
  if (p.colors && p.colors.length) opt.push(p.colors.length + '색')
  if (p.sizes && p.sizes.length) opt.push(p.sizes.length + '사이즈')
  return opt.join(' · ') || '단일 옵션'
}

const GRID = 'grid-cols-[2.6fr_1fr_1fr_1.1fr_.8fr_1fr]'

export default function Catalog() {
  const products = useAdmin((s) => s.products)
  const lives = useAdmin((s) => s.lives)
  const catFilter = useAdmin((s) => s.catFilter)
  const setCatFilter = useAdmin((s) => s.setCatFilter)
  const openNew = useAdmin((s) => s.openNew)
  const openEdit = useAdmin((s) => s.openEdit)

  const catFilters = buildCatFilters(products)
  const filtered = products.filter(
    (p) => catFilter === 'all' || (p.category || '기타') === catFilter,
  )

  return (
    <div className="animate-adFade">
      {/* 필터 칩 + 상품 등록 */}
      <div className="mb-[18px] flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {catFilters.map((f) => {
            const active = catFilter === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setCatFilter(f.id)}
                className={`cursor-pointer rounded-full border-[1.5px] px-[15px] py-2 text-[13px] font-bold ${
                  active
                    ? 'border-accent bg-accent text-white'
                    : 'border-line bg-card text-ink'
                }`}
              >
                {f.label} <span className="opacity-60">{f.count}</span>
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={openNew}
          className="flex cursor-pointer items-center gap-[7px] rounded-[12px] bg-accent px-[18px] py-[11px] text-[13.5px] font-bold text-white"
        >
          <span className="text-[17px] leading-none">＋</span>상품 등록
        </button>
      </div>

      <div className="mb-[14px] text-[12.5px] text-muted">
        상품은 순수 카탈로그예요.{' '}
        <b className="font-bold">재고·판매수량은 '라이브'에서</b> 상품을 담을 때
        등록하고, 라이브에 담긴 상품만 사용자에게 노출됩니다.
      </div>

      {/* 테이블 */}
      <div className="overflow-hidden rounded-[18px] border border-line bg-card">
        {/* 헤더 */}
        <div
          className={`grid ${GRID} gap-3 border-b border-line bg-soft px-5 py-[14px] text-xs font-bold text-muted`}
        >
          <span>상품</span>
          <span>상품번호</span>
          <span>카테고리</span>
          <span>판매가</span>
          <span>할인</span>
          <span>라이브 편성</span>
        </div>

        {filtered.map((p) => {
          const sp = salePrice(p)
          const hasDiscount = p.discountRate > 0
          const lc = livesCountFor(lives, p.id)
          const inLive = lc > 0
          const thumbA = p.images[0].url || p.images[0].a
          const thumbB = p.images[0].url || p.images[0].b
          return (
            <div
              key={p.id}
              onClick={() => openEdit(p.id)}
              className={`grid ${GRID} cursor-pointer items-center gap-3 border-b border-line px-5 py-[14px] text-[13px]`}
            >
              {/* 상품 (썸네일 + 이름 + 옵션요약) */}
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="relative h-12 w-10 flex-none rounded-[9px] bg-cover bg-center"
                  style={{ background: gradient(thumbA, thumbB) }}
                >
                  {!!p.tag && (
                    <span className="absolute -left-[5px] -top-[6px] rounded-[5px] bg-ink px-[5px] py-[2px] text-[8px] font-extrabold text-white">
                      {p.tag}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap font-bold">
                    {p.name}
                  </div>
                  <div className="mt-[2px] text-[11.5px] text-muted">
                    {optionSummary(p)}
                  </div>
                </div>
              </div>

              {/* 상품번호 */}
              <span className="text-[12.5px] text-muted">{p.code}</span>

              {/* 카테고리 */}
              <span className="text-[12.5px] text-muted">
                {p.category || '-'}
              </span>

              {/* 판매가 (할인 시 정가 취소선) */}
              <div>
                <div className="font-extrabold">{won(sp)}</div>
                {hasDiscount && (
                  <div className="text-[11px] text-muted line-through">
                    {won(p.price)}
                  </div>
                )}
              </div>

              {/* 할인율 */}
              <span
                className={`font-bold ${hasDiscount ? 'text-accent' : 'text-muted'}`}
              >
                {hasDiscount ? p.discountRate + '%' : '—'}
              </span>

              {/* 라이브 편성 */}
              <span>
                <span
                  className={`rounded-full px-[11px] py-[5px] text-xs font-bold ${
                    inLive ? 'bg-okSoft text-ok' : 'bg-soft text-muted'
                  }`}
                >
                  {inLive ? lc + '개 방송' : '미편성'}
                </span>
              </span>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="p-10 text-center text-[13px] text-muted">
            해당 조건의 상품이 없어요.
          </div>
        )}
      </div>
    </div>
  )
}
