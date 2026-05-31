export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6c63ff" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Background rounded square */}
      <rect width="36" height="36" rx="10" fill="url(#grad)" />

      {/* Brain / neural network icon */}
      {/* Left brain lobe */}
      <path
        d="M11 14.5C11 12.5 12.5 11 14.5 11C15.5 11 16.3 11.4 16.9 12C17 11.4 17.5 11 18 11C18.5 11 19 11.4 19.1 12C19.7 11.4 20.5 11 21.5 11C23.5 11 25 12.5 25 14.5C25 15.3 24.7 16 24.2 16.6C24.7 17.2 25 18 25 18.8C25 20.2 24.1 21.4 22.8 21.8C22.8 23.6 21.3 25 19.5 25C18.7 25 18 24.7 17.5 24.2C17 24.7 16.3 25 15.5 25C13.6 25 12 23.4 12 21.5C12 21.3 12 21.1 12.1 20.9C11.4 20.3 11 19.4 11 18.5C11 17.6 11.4 16.8 12 16.2C11.4 15.7 11 15.1 11 14.5Z"
        fill="white"
        fillOpacity="0.95"
      />

      {/* Neural connection lines */}
      <line x1="18" y1="11.5" x2="18" y2="24.5" stroke="url(#grad)" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="13" y1="17" x2="23" y2="17" stroke="url(#grad)" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="14" y1="13" x2="22" y2="22" stroke="url(#grad)" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="22" y1="13" x2="14" y2="22" stroke="url(#grad)" strokeWidth="0.8" strokeOpacity="0.3" />

      {/* Neural dots */}
      <circle cx="18" cy="17" r="1.5" fill="url(#grad)" />
      <circle cx="14" cy="14" r="1" fill="#38bdf8" fillOpacity="0.8" />
      <circle cx="22" cy="14" r="1" fill="#38bdf8" fillOpacity="0.8" />
      <circle cx="14" cy="21" r="1" fill="#6c63ff" fillOpacity="0.8" />
      <circle cx="22" cy="21" r="1" fill="#6c63ff" fillOpacity="0.8" />
      <circle cx="18" cy="12" r="0.8" fill="white" fillOpacity="0.9" />
      <circle cx="18" cy="24" r="0.8" fill="white" fillOpacity="0.9" />
      <circle cx="12" cy="17" r="0.8" fill="white" fillOpacity="0.9" />
      <circle cx="24" cy="17" r="0.8" fill="white" fillOpacity="0.9" />
    </svg>
  );
}
