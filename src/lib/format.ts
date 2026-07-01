import type { OrderStatus, Product } from '../types/domain'

/** ₩ formatting — matches DCLogic.won(). */
export function won(n: number): string {
  return Number(n || 0).toLocaleString('ko-KR') + '원'
}

/** Sale price after discount — matches DCLogic.sale(). */
export function salePrice(p: Pick<Product, 'price' | 'discountRate'> | undefined | null): number {
  if (!p) return 0
  return p.discountRate > 0 ? Math.round(p.price * (1 - p.discountRate / 100)) : p.price
}

/** Status meta — label + text color class + bg color class (Tailwind theme tokens). */
export interface StatusMeta {
  label: string
  /** text color (theme token name, e.g. 'amber') */
  color: string
  /** bg color (theme token name, e.g. 'amberSoft') */
  bg: string
  /** tailwind text-* class */
  textClass: string
  /** tailwind bg-* class */
  bgClass: string
}

// Mirrors STM in renderVals(). expired/cancel use non-token greys.
const STM: Record<OrderStatus, StatusMeta> = {
  wait: { label: '입금대기', color: 'amber', bg: 'amberSoft', textClass: 'text-amber', bgClass: 'bg-amberSoft' },
  paid: { label: '결제완료', color: 'sky', bg: 'skySoft', textClass: 'text-sky', bgClass: 'bg-skySoft' },
  ready: { label: '배송준비', color: 'sky', bg: 'skySoft', textClass: 'text-sky', bgClass: 'bg-skySoft' },
  shipping: { label: '배송중', color: 'accent', bg: 'accentSoft', textClass: 'text-accent', bgClass: 'bg-accentSoft' },
  done: { label: '배송완료', color: 'ok', bg: 'okSoft', textClass: 'text-ok', bgClass: 'bg-okSoft' },
  expired: { label: '자동만료', color: '#8A8075', bg: '#EEE9E1', textClass: 'text-[#8A8075]', bgClass: 'bg-[#EEE9E1]' },
  late: { label: '늦은입금', color: 'amber', bg: 'amberSoft', textClass: 'text-amber', bgClass: 'bg-amberSoft' },
  refund: { label: '환불', color: 'del', bg: 'delSoft', textClass: 'text-del', bgClass: 'bg-delSoft' },
  cancel: { label: '취소', color: '#8A8075', bg: '#EEE9E1', textClass: 'text-[#8A8075]', bgClass: 'bg-[#EEE9E1]' },
}

export function statusMeta(status: OrderStatus): StatusMeta {
  return STM[status] || STM.wait
}

/** CSS linear-gradient for a gradient placeholder image. */
export function gradient(a: string, b: string): string {
  return `linear-gradient(150deg, ${a}, ${b})`
}

/** dashboard status hints per status (order detail). */
export const STATUS_HINTS: Record<OrderStatus, string> = {
  wait: '무통장 입금을 기다리는 중이에요. 입금 확인 후 결제완료로 변경하세요.',
  paid: '결제가 확인됐어요. 배송 준비로 넘기세요.',
  ready: '상품을 준비하고 송장번호를 등록해 배송을 시작하세요.',
  shipping: '배송 중이에요. 도착하면 배송 완료로 변경하세요.',
  done: '배송이 완료된 주문이에요.',
  expired: '입금기한이 지나 자동 만료됐어요. 재고가 있으면 복구할 수 있어요.',
  late: '만료 후 입금이 확인된 건이에요. 복구하거나 환불하세요.',
  refund: '환불 처리된 주문이에요.',
  cancel: '취소된 주문이에요.',
}
