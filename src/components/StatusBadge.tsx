import type { OrderStatus } from '../types/domain'
import { statusMeta } from '../lib/format'

interface Props {
  status: OrderStatus
  className?: string
}

/** Pill badge for an order status — label + themed text/bg color. */
export default function StatusBadge({ status, className = '' }: Props) {
  const m = statusMeta(status)
  return (
    <span
      className={`inline-flex items-center rounded-full px-[11px] py-[5px] text-xs font-extrabold whitespace-nowrap ${m.textClass} ${m.bgClass} ${className}`}
    >
      {m.label}
    </span>
  )
}
