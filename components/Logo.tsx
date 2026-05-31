export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 130 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lg-head" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="lg-brain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ddd6fe" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
        <radialGradient id="lg-node1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
        <radialGradient id="lg-node2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0891b2" />
        </radialGradient>
        <radialGradient id="lg-node3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f9a8d4" />
          <stop offset="100%" stopColor="#db2777" />
        </radialGradient>
        <clipPath id="lg-clip">
          <path d="M 36,118 L 36,92 C 30,87 22,80 20,72 C 17,64 18,56 22,50 C 24,47 25,44 24,41 C 22,37 23,32 27,28 C 32,22 40,18 50,17 C 60,16 70,19 76,26 C 82,33 82,43 78,51 C 75,57 70,61 67,67 C 64,74 62,82 60,92 L 60,118 Z" />
        </clipPath>
      </defs>

      {/* ── Head silhouette ── */}
      <path
        d="M 36,118 L 36,92 C 30,87 22,80 20,72 C 17,64 18,56 22,50 C 24,47 25,44 24,41 C 22,37 23,32 27,28 C 32,22 40,18 50,17 C 60,16 70,19 76,26 C 82,33 82,43 78,51 C 75,57 70,61 67,67 C 64,74 62,82 60,92 L 60,118 Z"
        fill="url(#lg-head)"
      />

      {/* ── Brain inside head (clipped) ── */}
      <g clipPath="url(#lg-clip)">
        {/* Left lobe */}
        <ellipse cx="42" cy="44" rx="14" ry="11" fill="url(#lg-brain)" />
        {/* Right lobe */}
        <ellipse cx="62" cy="46" rx="13" ry="10" fill="url(#lg-brain)" />
        {/* Brain fold lines */}
        <path d="M 33,40 C 36,35 41,35 42,39" stroke="#7c3aed" strokeWidth="1.3" strokeOpacity="0.5" fill="none" strokeLinecap="round" />
        <path d="M 44,37 C 47,33 51,34 51,38" stroke="#7c3aed" strokeWidth="1.3" strokeOpacity="0.5" fill="none" strokeLinecap="round" />
        <path d="M 33,48 C 36,53 42,53 43,48" stroke="#7c3aed" strokeWidth="1.3" strokeOpacity="0.5" fill="none" strokeLinecap="round" />
        <path d="M 55,47 C 58,52 64,51 65,47" stroke="#7c3aed" strokeWidth="1.3" strokeOpacity="0.5" fill="none" strokeLinecap="round" />
        <path d="M 57,38 C 60,33 64,34 65,38" stroke="#7c3aed" strokeWidth="1.3" strokeOpacity="0.5" fill="none" strokeLinecap="round" />
        {/* Center divide */}
        <line x1="52" y1="34" x2="52" y2="56" stroke="#7c3aed" strokeWidth="1" strokeOpacity="0.35" />
      </g>

      {/* ── Lines connecting head → nodes ── */}
      {/* Head to main node */}
      <line x1="74" y1="30" x2="94" y2="18" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
      {/* Main node to right node */}
      <line x1="106" y1="18" x2="122" y2="35" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      {/* Main node to top node */}
      <line x1="106" y1="18" x2="115" y2="4" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />

      {/* ── Node 1 — large, purple (closest to head) ── */}
      <circle cx="100" cy="18" r="16" fill="#7c3aed" fillOpacity="0.15" />
      <circle cx="100" cy="18" r="12" fill="url(#lg-node1)" />
      <circle cx="97" cy="15" r="3" fill="white" fillOpacity="0.35" />

      {/* ── Node 2 — medium, cyan (right) ── */}
      <circle cx="122" cy="35" r="10" fill="#0891b2" fillOpacity="0.15" />
      <circle cx="122" cy="35" r="8" fill="url(#lg-node2)" />
      <circle cx="120" cy="33" r="2.2" fill="white" fillOpacity="0.35" />

      {/* ── Node 3 — small, pink (top) ── */}
      <circle cx="115" cy="4" r="8" fill="#db2777" fillOpacity="0.15" />
      <circle cx="115" cy="4" r="6" fill="url(#lg-node3)" />
      <circle cx="113" cy="2.5" r="1.8" fill="white" fillOpacity="0.35" />
    </svg>
  );
}
