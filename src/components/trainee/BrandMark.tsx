/**
 * GroundReady brand mark — an upward path rising from the ground line.
 * Used in the header and boot screen; `public/logo.svg` is the favicon twin.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="8" fill="#059669" />
      <path d="M16 5.5 24 14h-5v7h-6v-7H8l8-8.5Z" fill="#fff" />
      <path
        d="M7 26h18"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
