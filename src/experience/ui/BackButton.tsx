interface Props {
  onBack: () => void
}

export default function BackButton({ onBack }: Props) {
  return (
    <button
      onClick={onBack}
      className="absolute left-4 top-4 z-50 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm font-medium text-white/80 shadow backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white"
    >
      ← Back
    </button>
  )
}
