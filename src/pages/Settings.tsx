import type { KeyboardEvent } from 'react'
import { useAdmin } from '../store/admin'
import { won } from '../lib/format'
import { PAY_LABEL } from '../data/shop'
import type { PayMethod } from '../types/domain'
import Toggle from '../components/Toggle'

const PAY_METHODS: PayMethod[] = ['kakao', 'toss', 'bank']

/** 배송·결제 설정 — backoffice.dc.html isSettings 그대로. */
export default function Settings() {
  const settings = useAdmin((s) => s.settings)
  const memoInput = useAdmin((s) => s.memoInput)
  const setSetting = useAdmin((s) => s.setSetting)
  const togglePay = useAdmin((s) => s.togglePay)
  const addMemo = useAdmin((s) => s.addMemo)
  const removeMemo = useAdmin((s) => s.removeMemo)
  const setMemoInput = useAdmin((s) => s.setMemoInput)

  const onMemoKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addMemo()
    }
  }

  return (
    <div className="grid max-w-[900px] animate-adFade grid-cols-2 items-start gap-4">
      {/* 배송비 설정 */}
      <div className="rounded-[18px] border border-line bg-card p-[22px]">
        <div className="mb-1 text-[15px] font-extrabold">배송비 설정</div>
        <div className="mb-[18px] text-[12.5px] text-muted">
          사용자 장바구니·결제에 자동 반영돼요.
        </div>

        <label className="mb-2 block text-[13px] font-bold">기본 배송비</label>
        <div className="mb-4 flex items-center overflow-hidden rounded-xl border-[1.5px] border-line">
          <input
            type="number"
            value={settings.fee}
            onChange={(e) => setSetting('fee', Number(e.target.value) || 0)}
            className="h-12 flex-1 border-none bg-card px-[14px] text-sm text-ink outline-none"
          />
          <span className="px-[15px] text-[13px] text-muted">원</span>
        </div>

        <label className="mb-2 block text-[13px] font-bold">무료배송 기준액</label>
        <div className="flex items-center overflow-hidden rounded-xl border-[1.5px] border-line">
          <input
            type="number"
            value={settings.freeOver}
            onChange={(e) => setSetting('freeOver', Number(e.target.value) || 0)}
            className="h-12 flex-1 border-none bg-card px-[14px] text-sm text-ink outline-none"
          />
          <span className="px-[15px] text-[13px] text-muted">원 이상</span>
        </div>

        <div className="mt-[14px] rounded-xl bg-soft px-[14px] py-3 text-[12.5px] leading-[1.6] text-body">
          현재 <b>{won(settings.freeOver)}</b> 이상 무료배송, 미만은 <b>{won(settings.fee)}</b>.
        </div>
      </div>

      {/* 결제 수단 + 계좌 + 입금기한 */}
      <div className="rounded-[18px] border border-line bg-card p-[22px]">
        <div className="mb-1 text-[15px] font-extrabold">결제 수단</div>
        <div className="mb-[18px] text-[12.5px] text-muted">
          켜둔 수단만 사용자 결제 화면에 노출돼요.
        </div>

        {PAY_METHODS.map((k) => (
          <div
            key={k}
            className="flex items-center justify-between border-b border-line py-3"
          >
            <div>
              <div className="text-sm font-bold">{PAY_LABEL[k]}</div>
              <div className="mt-0.5 text-xs text-muted">
                {k === 'bank' ? '계좌이체 · 입금 확인 후 배송' : '간편결제'}
              </div>
            </div>
            <Toggle on={settings.payments[k]} onToggle={() => togglePay(k)} />
          </div>
        ))}

        <label className="mb-2 mt-4 block text-[13px] font-bold">무통장 입금 계좌</label>
        <input
          value={settings.account}
          onChange={(e) => setSetting('account', e.target.value)}
          className="h-12 w-full rounded-xl border-[1.5px] border-line bg-card px-[14px] text-[13.5px] text-ink outline-none"
        />

        <label className="mb-2 mt-[14px] block text-[13px] font-bold">입금기한 (시간)</label>
        <div className="flex items-center overflow-hidden rounded-xl border-[1.5px] border-line">
          <input
            type="number"
            value={settings.depositHrs}
            onChange={(e) => setSetting('depositHrs', Number(e.target.value) || 0)}
            className="h-12 flex-1 border-none bg-card px-[14px] text-sm text-ink outline-none"
          />
          <span className="px-[15px] text-[13px] text-muted">시간 내 미입금 시 자동만료</span>
        </div>
      </div>

      {/* 배송 요청사항 프리셋 */}
      <div className="col-span-full rounded-[18px] border border-line bg-card p-[22px]">
        <div className="mb-1 text-[15px] font-extrabold">배송 요청사항 프리셋</div>
        <div className="mb-[18px] text-[12.5px] text-muted">
          여기 등록한 항목이 사용자 결제 화면의 <b>요청사항 드롭다운</b>에 나와요. 개수 제한 없음.
        </div>

        <div className="mb-[14px] flex flex-col gap-[9px]">
          {settings.memos.map((m, i) => (
            <div
              key={`mm${i}`}
              className="flex items-center gap-[10px] rounded-xl bg-soft px-[14px] py-[11px]"
            >
              <span className="text-[13px] text-muted">≡</span>
              <span className="flex-1 text-[13.5px] font-semibold">{m}</span>
              <div
                onClick={() => removeMemo(i)}
                className="cursor-pointer px-1 text-[15px] text-muted"
              >
                ✕
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-[10px]">
          <input
            value={memoInput}
            onChange={(e) => setMemoInput(e.target.value)}
            onKeyDown={onMemoKey}
            placeholder="새 요청사항 입력 후 추가"
            className="h-[46px] flex-1 rounded-xl border-[1.5px] border-line bg-card px-[14px] text-[13.5px] text-ink outline-none"
          />
          <div
            onClick={() => addMemo()}
            className="flex h-[46px] cursor-pointer items-center rounded-xl bg-ink px-5 text-[13.5px] font-bold text-white"
          >
            추가
          </div>
        </div>
      </div>

      {/* 사업자 정보 안내 */}
      <div className="col-span-full rounded-[18px] border border-dashed border-[#D8D0C2] bg-soft px-[22px] py-[18px] text-[12.5px] leading-[1.6] text-body">
        🏢 사업자 정보(상호·대표자·사업자등록번호·통신판매업 신고번호) 입력란은 다음 단계에서 추가할
        자리예요.
      </div>
    </div>
  )
}
