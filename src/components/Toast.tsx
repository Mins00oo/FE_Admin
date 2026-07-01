import { useAdmin } from '../store/admin'

/** Global toast — bottom-center pill. Reads store.toast. */
export default function Toast() {
  const toast = useAdmin((s) => s.toast)
  if (!toast) return null
  return (
    <div
      className="pointer-events-none absolute bottom-7 left-1/2 z-[90] -translate-x-1/2 animate-adFadeFast whitespace-nowrap rounded-full px-[22px] py-[13px] text-[13.5px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,.5)]"
      style={{ background: 'rgba(40,35,29,.95)' }}
    >
      {toast}
    </div>
  )
}
