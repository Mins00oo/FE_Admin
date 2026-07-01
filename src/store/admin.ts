import { create } from 'zustand'
import type {
  LiveSession,
  Order,
  OrderActionType,
  OrderStatus,
  PayMethod,
  Product,
  ProductDraft,
  Settings,
} from '../types/domain'
import { salePrice } from '../lib/format'
import {
  LIVE_META,
  SOLD_MAP,
  makeLives,
  makeOrders,
  makeProducts,
  makeSettings,
} from '../data/shop'

// ---------- helpers ----------

let toastTimer: ReturnType<typeof setTimeout> | null = null

/** dashboard best-seller row. */
export interface BestSeller {
  id: string
  rank: number
  name: string
  thumbA: string
  thumbB: string
  sold: number
  revenue: number
}

/** dashboard live summary. */
export interface LiveSummary {
  isLive: boolean
  title: string
  viewers: number
  itemCount: number
  orders: number
  revenue: number
  aov: number
}

export interface AdminState {
  // ---- data ----
  products: Product[]
  lives: LiveSession[]
  orders: Order[]
  settings: Settings

  // ---- ui / editing state ----
  catFilter: string
  orderFilter: string
  selDay: number
  calMonth: number
  calYear: number

  // product drawer
  editing: string | null // product id being edited, 'new', or null
  draft: ProductDraft | null
  sizeInput: string
  colorName: string
  colorHex: string

  // live product picker
  picker: boolean
  pickerSel: Record<string, boolean>

  // settings memo input
  memoInput: string

  // toast
  toast: string

  // ================= actions =================

  showToast: (m: string) => void
  clearToast: () => void

  // filters / calendar
  setCatFilter: (id: string) => void
  setOrderFilter: (id: string) => void
  selectLive: (day: number) => void
  prevMonth: () => void
  nextMonth: () => void

  // ---- products / drawer ----
  openNew: () => void
  openEdit: (id: string) => void
  closeDrawer: () => void
  setDraft: <K extends keyof ProductDraft>(field: K, value: ProductDraft[K]) => void
  setDraftImage: (index: number, url: string) => void
  addOption: (kind: 'size' | 'color') => void
  removeOption: (kind: 'size' | 'color', index: number) => void
  setSizeInput: (v: string) => void
  setColorName: (v: string) => void
  setColorHex: (v: string) => void
  saveDraft: () => void
  deleteDraft: () => void

  // ---- lives ----
  setLiveField: (id: string, field: keyof LiveSession, value: string) => void
  setSelLiveLive: () => void
  addSelLive: () => void
  removeSelLive: () => void
  setLiveItemQty: (productId: string, qty: number) => void
  moveLiveItem: (productId: string, dir: -1 | 1) => void
  removeLiveItem: (productId: string) => void
  openPicker: () => void
  closePicker: () => void
  togglePick: (productId: string) => void
  confirmPicker: () => void

  // ---- orders ----
  setOrderStatus: (id: string, next: OrderStatus, extra?: Partial<Order>) => void
  setTracking: (id: string, v: string) => void
  confirmDeposit: (id: string) => void
  handleAction: (id: string, type: OrderActionType) => void

  // ---- settings ----
  setSetting: <K extends keyof Settings>(field: K, value: Settings[K]) => void
  togglePay: (k: PayMethod) => void
  addMemo: () => void
  removeMemo: (index: number) => void
  setMemoInput: (v: string) => void
}

// ---------- store ----------

export const useAdmin = create<AdminState>((set, get) => ({
  products: makeProducts(),
  lives: makeLives(),
  orders: makeOrders(),
  settings: makeSettings(),

  catFilter: 'all',
  orderFilter: 'all',
  // seed selected day = day of the LIVE session (July 1)
  selDay: (() => {
    const lives = makeLives()
    let i = lives.findIndex((l) => l.status === 'live')
    if (i < 0) i = 0
    return lives[i] ? lives[i].day : 1
  })(),
  calMonth: 6,
  calYear: 2026,

  editing: null,
  draft: null,
  sizeInput: '',
  colorName: '',
  colorHex: '#CCCCCC',

  picker: false,
  pickerSel: {},

  memoInput: '',

  toast: '',

  showToast: (m) => {
    set({ toast: m })
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => set({ toast: '' }), 1600)
  },
  clearToast: () => set({ toast: '' }),

  setCatFilter: (id) => set({ catFilter: id }),
  setOrderFilter: (id) => set({ orderFilter: id }),
  selectLive: (day) => set({ selDay: day }),
  prevMonth: () =>
    set((s) => {
      let m = s.calMonth - 1
      let y = s.calYear
      if (m < 0) {
        m = 11
        y--
      }
      return { calMonth: m, calYear: y }
    }),
  nextMonth: () =>
    set((s) => {
      let m = s.calMonth + 1
      let y = s.calYear
      if (m > 11) {
        m = 0
        y++
      }
      return { calMonth: m, calYear: y }
    }),

  // -------- products / drawer --------
  openNew: () =>
    set((s) => ({
      editing: 'new',
      draft: {
        id: 'new',
        code: 'HS-' + (1009 + Math.max(0, s.products.length - 8)),
        name: '',
        category: '',
        tag: '',
        price: 0,
        discountRate: 0,
        sizes: [],
        colors: [],
        desc: '',
        details: [],
        images: [
          { a: '#E7E1D6', b: '#CFC6B6', url: '' },
          { a: '#E1DACD', b: '#C6BBA8', url: '' },
          { a: '#EDE7DC', b: '#D4CAB8', url: '' },
        ],
      },
      sizeInput: '',
      colorName: '',
      colorHex: '#CCCCCC',
    })),

  openEdit: (id) => {
    const p = get().products.find((x) => x.id === id)
    if (!p) return
    set({
      editing: id,
      draft: JSON.parse(JSON.stringify(p)),
      sizeInput: '',
      colorName: '',
      colorHex: '#CCCCCC',
    })
  },

  closeDrawer: () => set({ editing: null, draft: null }),

  setDraft: (field, value) =>
    set((s) => (s.draft ? { draft: { ...s.draft, [field]: value } } : {})),

  setDraftImage: (index, url) =>
    set((s) => {
      if (!s.draft) return {}
      const images = s.draft.images.slice()
      images[index] = { ...images[index], url }
      return { draft: { ...s.draft, images } }
    }),

  addOption: (kind) =>
    set((s) => {
      if (!s.draft) return {}
      if (kind === 'size') {
        const v = s.sizeInput.trim()
        if (!v) return {}
        return { draft: { ...s.draft, sizes: s.draft.sizes.concat([v]) }, sizeInput: '' }
      }
      // color
      const n = s.colorName.trim()
      if (!n) {
        get().showToast('색상명을 입력해 주세요')
        return {}
      }
      return {
        draft: { ...s.draft, colors: s.draft.colors.concat([{ name: n, hex: s.colorHex }]) },
        colorName: '',
      }
    }),

  removeOption: (kind, index) =>
    set((s) => {
      if (!s.draft) return {}
      if (kind === 'size') {
        return { draft: { ...s.draft, sizes: s.draft.sizes.filter((_, i) => i !== index) } }
      }
      return { draft: { ...s.draft, colors: s.draft.colors.filter((_, i) => i !== index) } }
    }),

  setSizeInput: (v) => set({ sizeInput: v }),
  setColorName: (v) => set({ colorName: v }),
  setColorHex: (v) => set({ colorHex: v }),

  saveDraft: () => {
    const { draft, editing, products, showToast } = get()
    if (!draft) return
    if (!draft.name.trim()) {
      showToast('상품명을 입력해 주세요')
      return
    }
    if (!draft.price || draft.price <= 0) {
      showToast('정가를 입력해 주세요')
      return
    }
    const clean: Product = {
      ...draft,
      price: Number(draft.price) || 0,
      discountRate: Number(draft.discountRate) || 0,
    }
    if (editing === 'new') {
      clean.id = 'p_' + Date.now()
      set({ products: products.concat([clean]), editing: null, draft: null })
      showToast('상품을 등록했어요')
    } else {
      set({
        products: products.map((p) => (p.id === editing ? clean : p)),
        editing: null,
        draft: null,
      })
      showToast('저장했어요')
    }
  },

  deleteDraft: () => {
    const { editing, products, closeDrawer, showToast } = get()
    if (editing === 'new') {
      closeDrawer()
      return
    }
    set({
      products: products.filter((p) => p.id !== editing),
      editing: null,
      draft: null,
    })
    showToast('상품을 삭제했어요')
  },

  // -------- lives --------
  setLiveField: (id, field, value) =>
    set((s) => ({
      lives: s.lives.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    })),

  setSelLiveLive: () => {
    const lv = selLive(get())
    if (!lv) return
    set((s) => ({
      lives: s.lives.map((l) => ({
        ...l,
        status: l.id === lv.id ? 'live' : l.status === 'live' ? 'upcoming' : l.status,
      })),
    }))
  },

  addSelLive: () =>
    set((s) => {
      const d = s.selDay
      const dow = ['일', '월', '화', '수', '목', '금', '토'][
        new Date(s.calYear, s.calMonth, d).getDay()
      ]
      const lv: LiveSession = {
        id: 'lv' + Date.now(),
        day: d,
        date: s.calMonth + 1 + '월 ' + d + '일',
        dow,
        start: '21:00',
        end: '23:00',
        title: '새 라이브 방송',
        status: 'upcoming',
        videoUrl: '',
        items: [],
      }
      return { lives: s.lives.concat([lv]) }
    }),

  removeSelLive: () => {
    const lv = selLive(get())
    if (!lv) return
    set((s) => ({ lives: s.lives.filter((l) => l.id !== lv.id) }))
    get().showToast('방송을 삭제했어요')
  },

  setLiveItemQty: (productId, qty) => {
    const lv = selLive(get())
    if (!lv) return
    const q = Math.max(0, Math.floor(qty) || 0)
    set((s) => ({
      lives: s.lives.map((l) =>
        l.id === lv.id
          ? { ...l, items: l.items.map((it) => (it.productId === productId ? { ...it, qty: q } : it)) }
          : l,
      ),
    }))
  },

  moveLiveItem: (productId, dir) => {
    const lv = selLive(get())
    if (!lv) return
    const items = lv.items.slice().sort((a, b) => a.order - b.order)
    const i = items.findIndex((x) => x.productId === productId)
    const j = i + dir
    if (i < 0 || j < 0 || j >= items.length) return
    const tmp = items[i]
    items[i] = items[j]
    items[j] = tmp
    items.forEach((it, k) => (it.order = k))
    set((s) => ({ lives: s.lives.map((l) => (l.id === lv.id ? { ...l, items } : l)) }))
  },

  removeLiveItem: (productId) => {
    const lv = selLive(get())
    if (!lv) return
    set((s) => ({
      lives: s.lives.map((l) =>
        l.id === lv.id ? { ...l, items: l.items.filter((it) => it.productId !== productId) } : l,
      ),
    }))
  },

  openPicker: () => {
    const lv = selLive(get())
    if (!lv) return
    const sel: Record<string, boolean> = {}
    lv.items.forEach((it) => (sel[it.productId] = true))
    set({ picker: true, pickerSel: sel })
  },

  closePicker: () => set({ picker: false }),

  togglePick: (productId) =>
    set((s) => ({ pickerSel: { ...s.pickerSel, [productId]: !s.pickerSel[productId] } })),

  confirmPicker: () => {
    const lv = selLive(get())
    if (!lv) return
    const sel = get().pickerSel
    const kept = lv.items.filter((it) => sel[it.productId])
    const keptIds = kept.map((it) => it.productId)
    const added = Object.keys(sel)
      .filter((id) => sel[id] && keptIds.indexOf(id) < 0)
      .map((id) => ({ productId: id, qty: 10, order: 0 }))
    const items = kept.concat(added)
    items.forEach((it, k) => (it.order = k))
    set((s) => ({
      lives: s.lives.map((l) => (l.id === lv.id ? { ...l, items } : l)),
      picker: false,
    }))
    get().showToast(items.length + '개 상품을 담았어요')
  },

  // -------- orders --------
  setOrderStatus: (id, next, extra) =>
    set((s) => ({
      orders: s.orders.map((o) => (o.id === id ? { ...o, status: next, ...(extra || {}) } : o)),
    })),

  setTracking: (id, v) =>
    set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, tracking: v } : o)) })),

  confirmDeposit: (id) => {
    get().setOrderStatus(id, 'paid')
    get().showToast('입금을 확인했어요')
  },

  handleAction: (id, type) => {
    const { setOrderStatus, showToast, orders } = get()
    if (type === 'confirm') {
      setOrderStatus(id, 'paid')
      showToast('입금을 확인했어요')
    } else if (type === 'expire') {
      setOrderStatus(id, 'expired')
      showToast('주문을 만료 처리했어요')
    } else if (type === 'ready') {
      setOrderStatus(id, 'ready')
      showToast('배송 준비로 변경했어요')
    } else if (type === 'ship') {
      const o = orders.find((x) => x.id === id)
      if (!o || !o.tracking || !o.tracking.trim()) {
        showToast('송장번호를 입력해 주세요')
        return
      }
      setOrderStatus(id, 'shipping')
      showToast('배송을 시작했어요')
    } else if (type === 'done') {
      setOrderStatus(id, 'done')
      showToast('배송 완료 처리했어요')
    } else if (type === 'restore') {
      setOrderStatus(id, 'paid')
      showToast('주문을 복구했어요')
    } else if (type === 'refund') {
      setOrderStatus(id, 'refund')
      showToast('환불 처리했어요')
    }
  },

  // -------- settings --------
  setSetting: (field, value) => set((s) => ({ settings: { ...s.settings, [field]: value } })),
  togglePay: (k) =>
    set((s) => ({
      settings: { ...s.settings, payments: { ...s.settings.payments, [k]: !s.settings.payments[k] } },
    })),
  addMemo: () =>
    set((s) => {
      const v = s.memoInput.trim()
      if (!v) return {}
      return { settings: { ...s.settings, memos: s.settings.memos.concat([v]) }, memoInput: '' }
    }),
  removeMemo: (index) =>
    set((s) => ({
      settings: { ...s.settings, memos: s.settings.memos.filter((_, i) => i !== index) },
    })),
  setMemoInput: (v) => set({ memoInput: v }),
}))

// ---------- plain (non-hook) selectors ----------

/** The live currently selected by day in the calendar. */
export function selLive(s: Pick<AdminState, 'lives' | 'selDay'>): LiveSession | null {
  return s.lives.find((l) => l.day === s.selDay) || null
}

/** The single LIVE-status session (source of "stock"). */
export function liveOne(s: Pick<AdminState, 'lives'>): LiveSession | null {
  return s.lives.find((l) => l.status === 'live') || null
}

export function waitCount(s: Pick<AdminState, 'orders'>): number {
  return s.orders.filter((o) => o.status === 'wait').length
}

export function excCount(s: Pick<AdminState, 'orders'>): number {
  return s.orders.filter((o) => o.status === 'expired' || o.status === 'late').length
}

/** available "stock" for a product = its qty inside the LIVE session. */
export function totalQtyForProduct(s: Pick<AdminState, 'lives'>, productId: string): number {
  const lv = liveOne(s)
  if (!lv) return 0
  const it = lv.items.find((x) => x.productId === productId)
  return it ? it.qty : 0
}

/** whether an order can be restored (LIVE stock covers every line). */
export function stockAvailableFor(s: Pick<AdminState, 'lives'>, o: Order): boolean {
  return o.items.every((it) => totalQtyForProduct(s, it.productId) >= it.qty)
}

/** TOP 5 best sellers by SOLD_MAP. */
export function bestSellers(s: Pick<AdminState, 'products'>): BestSeller[] {
  return s.products
    .map((p) => {
      const sold = SOLD_MAP[p.id] || 0
      return {
        id: p.id,
        rank: 0,
        name: p.name,
        thumbA: p.images[0].a,
        thumbB: p.images[0].b,
        sold,
        revenue: sold * salePrice(p),
      }
    })
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5)
    .map((b, i) => ({ ...b, rank: i + 1 }))
}

/** dashboard live/session summary. */
export function liveSummary(s: Pick<AdminState, 'lives' | 'orders'>): LiveSummary {
  const lv = liveOne(s)
  const valid = s.orders.filter((o) => o.status !== 'cancel' && o.status !== 'expired')
  const revenue = valid.reduce((a, o) => a + o.total, 0)
  const aov = valid.length ? Math.round(revenue / valid.length) : 0
  return {
    isLive: !!lv,
    title: lv ? lv.title : '진행 중인 방송 없음',
    viewers: LIVE_META.viewers,
    itemCount: lv ? lv.items.length : 0,
    orders: valid.length,
    revenue,
    aov,
  }
}
