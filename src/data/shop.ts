// Dummy data ported from docs/01. 화면설게/백오피스/shop-data.js + backoffice.dc.html boot().
// These builder functions return fresh copies so the store can own mutable state.

import type {
  LiveSession,
  Order,
  OrderLine,
  PayMethod,
  Product,
  Settings,
} from '../types/domain'

interface RawColor {
  name: string
  hex: string
}
interface RawProduct {
  id: string
  code: string
  name: string
  price: number
  discountRate: number
  stock: number
  tag: string
  category: string
  sizes: string[]
  colors: RawColor[]
  desc: string
  details: string[]
  images: { a: string; b: string }[]
}

// shop-data.js: products (8) — keeps `stock` here only to seed the LIVE 편성 qty.
const RAW_PRODUCTS: RawProduct[] = [
  {
    id: 'p1', code: 'HS-1001', name: '오버핏 코튼 셔츠',
    price: 39000, discountRate: 20, stock: 6, tag: 'BEST', category: '상의',
    sizes: ['S', 'M', 'L'],
    colors: [{ name: '아이보리', hex: '#ECE7DC' }, { name: '블랙', hex: '#26262B' }, { name: '세이지', hex: '#A7B39B' }],
    desc: '하루종일 편한 코튼 100% 오버핏 셔츠',
    details: ['코튼 100%, 여름용 경량 원단', '루즈핏 · 남녀공용', '모델 착용 M · 키 168'],
    images: [{ a: '#EDE8DF', b: '#CFC6B8' }, { a: '#E4DED2', b: '#C2B7A4' }, { a: '#F1ECE3', b: '#D6CDBD' }],
  },
  {
    id: 'p2', code: 'HS-1002', name: '워싱 데님 와이드팬츠',
    price: 52000, discountRate: 15, stock: 24, tag: '', category: '하의',
    sizes: ['25', '26', '27', '28', '29', '30'],
    colors: [{ name: '라이트블루', hex: '#AEBCD6' }, { name: '딥블루', hex: '#3E4B66' }],
    desc: '빈티지 워싱 감성 하이웨스트 와이드',
    details: ['코튼 98% 폴리 2%', '하이웨스트 · 와이드핏', '밑단 컷 가능'],
    images: [{ a: '#AEBCD6', b: '#6E82A8' }, { a: '#9AAAC8', b: '#5A6E94' }, { a: '#B7C3D9', b: '#7688AC' }],
  },
  {
    id: 'p3', code: 'HS-1003', name: '크롭 니트 가디건',
    price: 34000, discountRate: 0, stock: 3, tag: 'NEW', category: '상의',
    sizes: ['FREE'],
    colors: [{ name: '버터', hex: '#F0DFA8' }, { name: '모카', hex: '#B79B77' }, { name: '차콜', hex: '#4A4A50' }],
    desc: '데일리로 입기 좋은 봄가을 크롭 가디건',
    details: ['아크릴 70% 울 30%', '크롭 기장 · 슬림핏', '정전기 방지 처리'],
    images: [{ a: '#F0DFA8', b: '#D8BE7A' }, { a: '#EAD79A', b: '#CBB06A' }, { a: '#F3E4B2', b: '#DDC585' }],
  },
  {
    id: 'p4', code: 'HS-1004', name: '플리츠 미니 스커트',
    price: 29000, discountRate: 30, stock: 40, tag: '', category: '하의',
    sizes: ['S', 'M', 'L'],
    colors: [{ name: '블랙', hex: '#2A2A30' }, { name: '베이지', hex: '#D8C7AC' }],
    desc: '찰랑이는 플리츠 미니 스커트',
    details: ['폴리 100%', '속바지 일체형', '허리 밴딩'],
    images: [{ a: '#3A3A40', b: '#1C1C20' }, { a: '#46464D', b: '#232329' }, { a: '#333339', b: '#18181C' }],
  },
  {
    id: 'p5', code: 'HS-1005', name: '링클프리 셔츠 원피스',
    price: 47000, discountRate: 10, stock: 0, tag: '', category: '원피스',
    sizes: ['FREE'],
    colors: [{ name: '화이트', hex: '#EDEFF3' }, { name: '네이비', hex: '#2E3852' }],
    desc: '구김 없는 데일리 셔츠 원피스',
    details: ['폴리 95% 스판 5%', '링클프리 · 미들 기장', '히든 버튼'],
    images: [{ a: '#E7E9EE', b: '#B9C0CE' }, { a: '#DDE0E7', b: '#AEB6C6' }, { a: '#EAECF1', b: '#C3C9D6' }],
  },
  {
    id: 'p6', code: 'HS-1006', name: '볼드 골드 체인 목걸이',
    price: 22000, discountRate: 0, stock: 15, tag: '', category: '액세서리',
    sizes: [],
    colors: [{ name: '골드', hex: '#E4C878' }, { name: '실버', hex: '#CFD2D8' }],
    desc: '포인트 주기 좋은 볼드 체인 목걸이',
    details: ['써지컬 스틸 · 변색 방지', '길이 42cm + 연장 5cm', '알러지 프리'],
    images: [{ a: '#E9CF86', b: '#C7A24E' }, { a: '#EAD293', b: '#CBA85A' }, { a: '#E5C778', b: '#C29B45' }],
  },
  {
    id: 'p7', code: 'HS-1007', name: '스트럭처 숄더백',
    price: 68000, discountRate: 25, stock: 8, tag: 'BEST', category: '가방',
    sizes: [],
    colors: [{ name: '크림', hex: '#DCC9AC' }, { name: '브라운', hex: '#8A6C4C' }, { name: '블랙', hex: '#2B2B30' }],
    desc: '각 잡힌 실루엣의 데일리 숄더백',
    details: ['PU 레더 · 골드 하드웨어', '26 x 18 x 9 cm', '내부 포켓 2개'],
    images: [{ a: '#CDB79A', b: '#9A7E5F' }, { a: '#C6AF90', b: '#907457' }, { a: '#D3BFA4', b: '#A48768' }],
  },
  {
    id: 'p8', code: 'HS-1008', name: '청키 데일리 스니커즈',
    price: 59000, discountRate: 20, stock: 30, tag: 'NEW', category: '신발',
    sizes: ['230', '240', '250', '260'],
    colors: [{ name: '화이트', hex: '#E9E9EC' }, { name: '블랙', hex: '#28282D' }],
    desc: '키높이 3cm 청키 스니커즈',
    details: ['합성피혁 · 논슬립 아웃솔', '3cm 키높이', '정사이즈'],
    images: [{ a: '#E9E9EC', b: '#C4C4CC' }, { a: '#E2E2E6', b: '#BCBCC4' }, { a: '#EDEDEF', b: '#CBCBD2' }],
  },
]

interface RawSchedule {
  date: string
  dow: string
  start: string
  end: string
  title: string
  status: 'live' | 'upcoming'
}

const RAW_SCHEDULE: RawSchedule[] = [
  { date: '7월 1일', dow: '화', start: '21:00', end: '23:00', title: '여름 신상 대방출', status: 'live' },
  { date: '7월 2일', dow: '목', start: '21:00', end: '23:00', title: '데일리 코디 특집', status: 'upcoming' },
  { date: '7월 5일', dow: '일', start: '20:00', end: '22:00', title: '가디건 & 니트 위크', status: 'upcoming' },
  { date: '7월 7일', dow: '화', start: '21:00', end: '23:00', title: '가방 & 슈즈 클리어런스', status: 'upcoming' },
]

const DELIVERY_MEMOS: string[] = [
  '부재 시 문 앞에 놓아 주세요',
  '배송 전 미리 연락 주세요',
  '경비실에 맡겨 주세요',
  '파손 위험 상품이니 주의해 주세요',
]

const SHIPPING = { fee: 3000, freeOver: 70000 }

/** live meta (dashboard banner viewers). */
export const LIVE_META = { title: '여름 신상 대방출 LIVE', viewers: 1284 }

/** best-seller sold counts (dashboard TOP5) — from soldMap(). */
export const SOLD_MAP: Record<string, number> = {
  p1: 48, p2: 32, p3: 27, p4: 61, p5: 19, p6: 40, p7: 23, p8: 35,
}

export const PAY_LABEL: Record<PayMethod, string> = {
  kakao: '카카오페이',
  toss: '토스페이',
  bank: '무통장입금',
}

const sale = (p: { price: number; discountRate: number }): number =>
  p.discountRate > 0 ? Math.round(p.price * (1 - p.discountRate / 100)) : p.price

/** Fresh copy of the 8 catalog products (no stock field). */
export function makeProducts(): Product[] {
  return RAW_PRODUCTS.map((p) => ({
    id: p.id,
    code: p.code,
    name: p.name,
    category: p.category,
    tag: (p.tag || '') as Product['tag'],
    price: p.price,
    discountRate: p.discountRate,
    sizes: p.sizes.slice(),
    colors: p.colors.map((c) => ({ name: c.name, hex: c.hex })),
    desc: p.desc,
    details: p.details.slice(),
    images: p.images.map((im) => ({ a: im.a, b: im.b, url: '' })),
  }))
}

/** Live sessions with LIVE session seeded with all products (qty=stock). */
export function makeLives(): LiveSession[] {
  const lives: LiveSession[] = RAW_SCHEDULE.map((s, idx) => {
    const mm = s.date.match(/(\d+)\s*일/)
    return {
      id: 'lv' + idx,
      day: mm ? parseInt(mm[1], 10) : 1,
      date: s.date,
      dow: s.dow,
      start: s.start,
      end: s.end,
      title: s.title,
      status: s.status,
      videoUrl: s.status === 'live' ? 'https://youtube.com/live/happysuju' : '',
      items: [],
    }
  })
  let liveIdx = lives.findIndex((l) => l.status === 'live')
  if (liveIdx < 0) liveIdx = 0
  lives[liveIdx].items = RAW_PRODUCTS.map((p, i) => ({ productId: p.id, qty: p.stock, order: i }))
  if (lives[1]) {
    lives[1].items = RAW_PRODUCTS.slice(0, 3).map((p, i) => ({ productId: p.id, qty: 20, order: i }))
  }
  return lives
}

function mkOrder(
  id: string,
  no: string,
  buyer: string,
  phone: string,
  addr: string,
  addrDetail: string,
  memo: string,
  depositor: string,
  method: PayMethod,
  lines: { pid: string; c?: string; s?: string; q: number }[],
  status: Order['status'],
  deadline: string,
  tracking: string,
  date: string,
): Order {
  const items: OrderLine[] = lines.map((l) => {
    const p = RAW_PRODUCTS.find((x) => x.id === l.pid)!
    return { productId: l.pid, color: l.c || '', size: l.s || '', qty: l.q, unitPrice: sale(p) }
  })
  const sub = items.reduce((a, it) => a + it.unitPrice * it.qty, 0)
  const fee = sub >= SHIPPING.freeOver ? 0 : SHIPPING.fee
  return {
    id, no, buyer: { name: buyer, phone }, address: addr, addrDetail, memo,
    depositor, method, items, shippingFee: fee, total: sub + fee,
    status, deadline, tracking: tracking || '', date,
  }
}

/** 8 seed orders spanning every status. */
export function makeOrders(): Order[] {
  return [
    mkOrder('o1', 'HS24070112', '김지수', '010-1234-5678', '서울시 강남구 테헤란로 123', '101동 1502호', '부재 시 문 앞', '김지수', 'bank', [{ pid: 'p1', c: '아이보리', s: 'M', q: 2 }], 'wait', '7/1 23:59', '', '07/01 21:14'),
    mkOrder('o2', 'HS24070111', '이서연', '010-2222-3456', '경기도 성남시 분당구 판교로 45', '302호', '', '이서연', 'bank', [{ pid: 'p4', c: '블랙', s: 'M', q: 1 }], 'wait', '7/1 23:59', '', '07/01 21:09'),
    mkOrder('o3', 'HS24070110', '박하늘', '010-3333-9012', '부산시 해운대구 우동 88', '1203호', '경비실에 맡겨주세요', '', 'kakao', [{ pid: 'p2', c: '딥블루', s: '27', q: 1 }, { pid: 'p8', c: '화이트', s: '250', q: 1 }], 'paid', '', '', '07/01 21:02'),
    mkOrder('o4', 'HS24070109', '최윤아', '010-4444-3456', '인천시 연수구 송도동 12', '2405호', '', '', 'toss', [{ pid: 'p6', c: '골드', s: '', q: 2 }], 'ready', '', '', '07/01 20:51'),
    mkOrder('o5', 'HS24070108', '정민서', '010-5555-7890', '대구시 수성구 범어동 77', '901호', '문 앞에 놓아주세요', '', 'kakao', [{ pid: 'p7', c: '브라운', s: '', q: 1 }], 'shipping', '', 'CJ대한통운 1234-5678-9012', '07/01 20:44'),
    mkOrder('o6', 'HS24070107', '한소미', '010-6666-1234', '서울시 마포구 연남동 33', '3층', '', '', 'toss', [{ pid: 'p8', c: '블랙', s: '260', q: 1 }], 'done', '', 'CJ대한통운 9876-5432-1098', '07/01 20:30'),
    mkOrder('o7', 'HS24070106', '오예은', '010-7777-5678', '광주시 서구 치평동 55', '1101호', '', '오예은', 'bank', [{ pid: 'p3', c: '버터', s: 'FREE', q: 1 }], 'expired', '7/1 20:00', '', '07/01 18:40'),
    mkOrder('o8', 'HS24070105', '유나경', '010-8888-9012', '대전시 유성구 봉명동 21', '204호', '', '유나경', 'bank', [{ pid: 'p4', c: '베이지', s: 'L', q: 2 }], 'late', '7/1 20:00', '', '07/01 18:20'),
  ]
}

export function makeSettings(): Settings {
  return {
    fee: SHIPPING.fee,
    freeOver: SHIPPING.freeOver,
    account: '국민 123456-01-234567 (해피수주)',
    depositHrs: 24,
    payments: { kakao: true, toss: true, bank: true },
    memos: DELIVERY_MEMOS.slice(),
  }
}
