// Page title/sub for the top bar, keyed by route path.
export const PAGE_TITLES: Record<string, [string, string]> = {
  '/': ['대시보드', '오늘의 판매·입금·라이브 현황'],
  '/catalog': ['상품 카탈로그', '상품 정보를 등록·관리해요 (재고는 라이브에서)'],
  '/lives': ['라이브', '방송 일정과 판매 상품·수량을 등록하세요'],
  '/orders': ['주문 관리', '주문을 확인하고 상태를 처리하세요'],
  '/exceptions': ['만료·늦은입금 관리', '예외 주문을 복구하거나 환불하세요'],
  '/settings': ['배송·결제 설정', '배송비·결제수단·요청사항을 관리해요'],
}

export const ORDER_DETAIL_TITLE: [string, string] = [
  '주문 상세',
  '받는 분·상품·결제·상태를 한 화면에서',
]

export function titleFor(pathname: string): [string, string] {
  if (pathname.startsWith('/orders/')) return ORDER_DETAIL_TITLE
  return PAGE_TITLES[pathname] || ['', '']
}
