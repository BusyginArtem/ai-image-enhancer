import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      width='60'
      height='60'
      viewBox='0 0 60 60'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn("text-background", className)}
    >
      <rect width='60' height='60' fill='currentColor' />

      <g filter='url(#shadow)'>
        <rect x='12' y='12' width='36' height='36' rx='6' stroke='#1E88E5' strokeWidth='2.5' />
        <rect x='14.5' y='14.5' width='31' height='31' rx='3.5' fill='currentColor' />
      </g>

      <rect x='18' y='18' width='6' height='6' fill='#1E88E5' />
      <rect x='24' y='18' width='6' height='6' fill='#F44336' />
      <rect x='30' y='18' width='6' height='6' fill='#1E88E5' />
      <rect x='18' y='24' width='6' height='6' fill='#F44336' />
      <rect x='24' y='24' width='6' height='6' fill='#1E88E5' />
      <rect x='30' y='24' width='6' height='6' fill='#F44336' />
      <rect x='18' y='30' width='6' height='6' fill='#1E88E5' />
      <rect x='24' y='30' width='6' height='6' fill='#F44336' />
      <rect x='30' y='30' width='6' height='6' fill='#1E88E5' />

      <rect x='36' y='20' width='10' height='8' rx='2' fill='#1E88E5' />
      <circle cx='41' cy='24' r='2' fill='#F44336' />

      <circle cx='42' cy='42' r='2.5' fill='#1E88E5' />
      <circle cx='48' cy='42' r='2.5' fill='#1E88E5' />
      <circle cx='54' cy='42' r='2.5' fill='#1E88E5' />

      <defs>
        <filter id='shadow' x='-50%' y='-50%' width='200%' height='200%'>
          <feDropShadow dx='1' dy='1' stdDeviation='1.5' floodColor='#000000' floodOpacity='0.1' />
        </filter>
      </defs>
    </svg>
  );
}
