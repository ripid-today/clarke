interface ClarkeLogoProps {
  size?: number;
  className?: string;
}

export function ClarkeLogo({ size = 24, className = "" }: ClarkeLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16 2 L18.5 12 L28 9.5 L20 16 L28 22.5 L18.5 20 L16 30 L13.5 20 L4 22.5 L12 16 L4 9.5 L13.5 12 Z"
        fill="currentColor"
      />
    </svg>
  );
}
