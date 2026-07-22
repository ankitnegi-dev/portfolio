import Image from "next/image";

export function Avatar({
  size = 96,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-full overflow-hidden border border-[var(--border-strong)] grayscale hover:grayscale-0 transition-[filter] duration-300 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/avatar.jpg"
        alt="Ankit Negi"
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </div>
  );
}
