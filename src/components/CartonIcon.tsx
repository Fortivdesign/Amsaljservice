/** Liten kartong på en hylla, används i varukorgsknappen. */
export function CartonIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect x="3" y="33.5" width="34" height="2.5" rx="1.25" fill="#3d0617" opacity="0.45" />
      <polygon points="20,5.5 34.5,11.8 20,18.1 5.5,11.8" fill="#f4cd8f" />
      <polygon points="5.5,11.8 20,18.1 20,33.5 5.5,27.2" fill="#d9a05a" />
      <polygon points="20,18.1 34.5,11.8 34.5,27.2 20,33.5" fill="#bb7c39" />
      <polygon points="11.6,9.2 15,7.7 29,13.8 25.6,15.3" fill="#fde8c2" />
      <polygon points="25.6,15.3 29,13.8 29,19.6 25.6,21.1" fill="#e7b778" />
      <polygon points="8.2,20.4 13,22.5 13,25.6 8.2,23.5" fill="#fbe0b0" opacity="0.9" />
    </svg>
  );
}
