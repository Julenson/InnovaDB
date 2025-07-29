
import type { SVGProps } from "react";

export function InnovaSportLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <title>Innova-Sport Logo</title>
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
        opacity="0.3"
      />
      <path d="M12.01 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm0 17a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zm-1-11.5h2V12h-2V8zm0 5h2v2h-2v-2zM9.5 12c.83 0 1.5-.67 1.5-1.5S10.33 9 9.5 9 8 9.67 8 10.5 8.67 12 9.5 12zm5 0c.83 0 1.5-.67 1.5-1.5S15.33 9 14.5 9s-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
    </svg>
  );
}

// Keep the old logo just in case
export function InnovaTrackLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <title>Innova Sport Logo</title>
            <path
                d="M50,10a40,40 0 1,0 0,80a40,40 0 1,0 0,-80"
                stroke="hsl(var(--primary))"
                strokeWidth="12"
            />
            <path
                d="M50,22a28,28 0 1,0 0,56a28,28 0 1,0 0,-56"
                fill="hsl(var(--primary))"
                opacity="0.2"
                stroke="none"
            />
            <path
                d="M68,32 L32,68"
                stroke="hsl(var(--background))"
                strokeWidth="14"
            />
        </svg>
    );
}
