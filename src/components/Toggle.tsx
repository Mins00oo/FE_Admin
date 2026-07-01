interface Props {
  on: boolean
  onToggle: () => void
}

/** iOS-style toggle switch (payment on/off). */
export default function Toggle({ on, onToggle }: Props) {
  return (
    <div
      onClick={onToggle}
      className={`relative h-[26px] w-[46px] flex-none cursor-pointer rounded-full transition-colors duration-200 ${
        on ? 'bg-accent' : 'bg-[#D5CEC3]'
      }`}
    >
      <span
        className="absolute top-[2px] h-[22px] w-[22px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.2)] transition-all duration-200"
        style={{ left: on ? '22px' : '2px' }}
      />
    </div>
  )
}
