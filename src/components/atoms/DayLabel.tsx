interface IDayLabelProps {
  label: string
}

export function DayLabel({ label }: IDayLabelProps) {
  return (
    <div className="flex items-center justify-center aspect-square">
      <span className="text-label-sm text-on-surface-variant">{label}</span>
    </div>
  )
}
