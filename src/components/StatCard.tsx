interface Props {
  label: string
  value: string
  hint: string
  icon: string
  iconBgClass: string
  iconFgClass: string
  /** value text color style (theme token or hex). */
  valueColor?: string
  onClick?: () => void
}

/** Dashboard stat card. Clickable when onClick provided. */
export default function StatCard({
  label,
  value,
  hint,
  icon,
  iconBgClass,
  iconFgClass,
  valueColor,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`rounded-[18px] border border-line bg-card px-5 py-[18px] ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-muted">{label}</span>
        <span
          className={`flex h-[30px] w-[30px] items-center justify-center rounded-[9px] text-[15px] ${iconBgClass} ${iconFgClass}`}
        >
          {icon}
        </span>
      </div>
      <div
        className="mt-3 text-[28px] font-extrabold tracking-[-.02em]"
        style={{ color: valueColor || '#28231D' }}
      >
        {value}
      </div>
      <div className="mt-[3px] text-xs text-muted">{hint}</div>
    </div>
  )
}
