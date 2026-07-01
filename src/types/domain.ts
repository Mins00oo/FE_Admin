// Domain types — mirrors backoffice.dc.html boot()/state dummy shapes.

/** Product tag / label. Empty string means "no tag". */
export type ProductTag = '' | 'BEST' | 'NEW'

export interface ProductColor {
  name: string
  hex: string
}

/** Gradient placeholder image (a→b linear-gradient). url is a data-URL override when uploaded. */
export interface ProductImage {
  a: string
  b: string
  url: string
}

/**
 * Pure catalog product. NOTE: no stock field — stock/qty lives on the live
 * (LiveItem.qty). Stock is managed only via live 편성.
 */
export interface Product {
  id: string
  code: string
  name: string
  category: string
  tag: ProductTag
  price: number
  discountRate: number
  sizes: string[]
  colors: ProductColor[]
  desc: string
  details: string[]
  images: ProductImage[]
}

/** live 방송 상태 (schedule status). */
export type LiveStatus = 'live' | 'upcoming'

/** A product placed into a live, with its sell-quantity (this is the real "stock"). */
export interface LiveItem {
  productId: string
  qty: number
  order: number
}

export interface LiveSession {
  id: string
  day: number
  date: string
  dow: string
  start: string
  end: string
  title: string
  status: LiveStatus
  videoUrl: string
  items: LiveItem[]
}

/** Order status transitions (backoffice.dc.html handleAction). */
export type OrderStatus =
  | 'wait' // 입금대기
  | 'paid' // 결제완료
  | 'ready' // 배송준비
  | 'shipping' // 배송중
  | 'done' // 배송완료
  | 'expired' // 자동만료
  | 'late' // 늦은입금
  | 'refund' // 환불
  | 'cancel' // 취소

export type PayMethod = 'kakao' | 'toss' | 'bank'

export interface OrderBuyer {
  name: string
  phone: string
}

export interface OrderLine {
  productId: string
  color: string
  size: string
  qty: number
  unitPrice: number
}

export interface Order {
  id: string
  no: string
  buyer: OrderBuyer
  address: string
  addrDetail: string
  memo: string
  depositor: string
  method: PayMethod
  items: OrderLine[]
  shippingFee: number
  total: number
  status: OrderStatus
  deadline: string
  tracking: string
  date: string
}

export interface PaymentToggles {
  kakao: boolean
  toss: boolean
  bank: boolean
}

export interface Settings {
  fee: number
  freeOver: number
  account: string
  depositHrs: number
  payments: PaymentToggles
  memos: string[]
}

/** Order-status transition action types (runOrderAction). */
export type OrderActionType =
  | 'confirm'
  | 'expire'
  | 'ready'
  | 'ship'
  | 'done'
  | 'restore'
  | 'refund'

/** Draft used by the product drawer (id 'new' when creating). */
export type ProductDraft = Product & { id: string }
