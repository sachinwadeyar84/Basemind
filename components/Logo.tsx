export default function Logo({ size = 36 }: { size?: number }) {
  const id = `sg-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0D0B21" />
          <stop offset="100%" stopColor="#0A1F15" />
        </linearGradient>
        <linearGradient id={`${id}-main`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9945FF" />
          <stop offset="50%" stopColor="#6E7BFF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
        <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9945FF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#14F195" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="40" height="40" rx="11" fill={`url(#${id}-bg)`} />

      {/* Outer partial ring */}
      <circle cx="20" cy="20" r="17" stroke={`url(#${id}-ring)`} strokeWidth="1.5" fill="none" strokeDasharray="70 36" />

      {/* Stylised S — circuit path */}
      <path
        d="M 26,13 C 26,13 24,11 20,11 C 15,11 13,14 13,17 C 13,20 16,21 20,22 C 24,23 27,24 27,27 C 27,30 24,29 20,29 C 16,29 14,27 14,27"
        stroke={`url(#${id}-main)`}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Node dots at S endpoints */}
      <circle cx="26" cy="13" r="2.2" fill="#9945FF" />
      <circle cx="14" cy="27" r="2.2" fill="#14F195" />
      <circle cx="20" cy="22" r="1.5" fill="#6E7BFF" fillOpacity="0.9" />
    </svg>
  );
}
