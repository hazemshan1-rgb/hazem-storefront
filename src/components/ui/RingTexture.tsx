export function RingTexture() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="80%" cy="50%" r="300" fill="none" stroke="rgba(202,138,4,0.14)" strokeWidth="1" />
      <circle cx="80%" cy="50%" r="220" fill="none" stroke="rgba(202,138,4,0.10)" strokeWidth="1" />
      <circle cx="80%" cy="50%" r="140" fill="none" stroke="rgba(202,138,4,0.07)" strokeWidth="1" />
      <circle cx="10%" cy="80%" r="180" fill="none" stroke="rgba(202,138,4,0.07)" strokeWidth="1" />
    </svg>
  )
}
