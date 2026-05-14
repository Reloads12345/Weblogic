/**
 * BrandLogos — inline SVG components rendered with proper brand colors.
 * Used in the "Trusted by category leaders" marquee.
 *
 * Apple and GitHub are intentionally monochrome (matches their brand
 * standards on dark backgrounds). The rest carry their full color palettes.
 */

interface LogoProps {
  className?: string;
}

export function AppleLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label="Apple" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function GitHubLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-label="GitHub" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function MicrosoftLogo({ className }: LogoProps) {
  // Classic 4-square Microsoft brand colors
  return (
    <svg viewBox="0 0 220 50" className={className} aria-label="Microsoft" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" fill="#F25022" />
      <rect x="24" y="2" width="20" height="20" fill="#7FBA00" />
      <rect x="2" y="24" width="20" height="20" fill="#00A4EF" />
      <rect x="24" y="24" width="20" height="20" fill="#FFB900" />
      <text
        x="56"
        y="32"
        fontFamily='-apple-system, "Segoe UI", sans-serif'
        fontSize="22"
        fontWeight="500"
        letterSpacing="-0.4"
        fill="#ffffff"
      >
        Microsoft
      </text>
    </svg>
  );
}

export function AwsLogo({ className }: LogoProps) {
  // White "aws" wordmark + AWS Squid Ink orange #FF9900 smile arrow
  return (
    <svg viewBox="0 0 100 60" className={className} aria-label="Amazon Web Services" xmlns="http://www.w3.org/2000/svg">
      <text
        x="50"
        y="34"
        textAnchor="middle"
        fontFamily="-apple-system, sans-serif"
        fontSize="26"
        fontWeight="700"
        letterSpacing="-1"
        fill="#ffffff"
      >
        aws
      </text>
      <path d="M22 44 Q50 56 78 44" stroke="#FF9900" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path
        d="M73 41 L80 44 L77 51"
        stroke="#FF9900"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GoogleCloudLogo({ className }: LogoProps) {
  // White cloud + "Google" in brand colors + "Cloud" in white
  return (
    <svg viewBox="0 0 240 60" className={className} aria-label="Google Cloud" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M30 38 a10 10 0 0 1 4-19 a13 13 0 0 1 25 2 a8 8 0 0 1 -3 16 z"
        fill="#ffffff"
      />
      <text
        x="68"
        y="34"
        fontFamily='-apple-system, "Product Sans", sans-serif'
        fontSize="22"
        fontWeight="600"
        letterSpacing="-0.5"
      >
        <tspan fill="#4285F4">G</tspan>
        <tspan fill="#EA4335">o</tspan>
        <tspan fill="#FBBC04">o</tspan>
        <tspan fill="#4285F4">g</tspan>
        <tspan fill="#34A853">l</tspan>
        <tspan fill="#EA4335">e</tspan>
      </text>
      <text
        x="153"
        y="34"
        fontFamily='-apple-system, "Product Sans", sans-serif'
        fontSize="22"
        fontWeight="500"
        letterSpacing="-0.4"
        fill="#ffffff"
      >
        Cloud
      </text>
    </svg>
  );
}

export function VisaLogo({ className }: LogoProps) {
  // Bright Visa blue + classic gold accent stroke under the wordmark
  return (
    <svg viewBox="0 0 140 56" className={className} aria-label="Visa" xmlns="http://www.w3.org/2000/svg">
      <text
        x="70"
        y="38"
        textAnchor="middle"
        fontFamily="-apple-system, sans-serif"
        fontSize="34"
        fontStyle="italic"
        fontWeight="800"
        letterSpacing="2"
        fill="#1A4FFF"
      >
        VISA
      </text>
      <path d="M22 46 L66 46" stroke="#1A4FFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M70 46 L118 46" stroke="#F7B600" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function PayPalLogo({ className }: LogoProps) {
  // Authentic PayPal two-tone blue P
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-label="PayPal"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="20" fill="#0070BA" />
      <path
        d="M32.3305 18.0977C32.3082 18.24 32.2828 18.3856 32.2542 18.5351C31.2704 23.5861 27.9046 25.331 23.606 25.331H21.4173C20.8916 25.331 20.4486 25.7127 20.3667 26.2313L19.2461 33.3381L18.9288 35.3527C18.8755 35.693 19.1379 36 19.4815 36H23.3634C23.8231 36 24.2136 35.666 24.286 35.2127L24.3241 35.0154L25.055 30.3772L25.1019 30.1227C25.1735 29.6678 25.5648 29.3338 26.0245 29.3338H26.6051C30.3661 29.3338 33.3103 27.8068 34.1708 23.388C34.5303 21.5421 34.3442 20.0008 33.393 18.9168C33.1051 18.59 32.748 18.3188 32.3305 18.0977Z"
        fill="#ffffff"
        fillOpacity="0.6"
      />
      <path
        d="M31.3009 17.6871C31.1506 17.6434 30.9955 17.6036 30.8364 17.5678C30.6766 17.5328 30.5127 17.5018 30.3441 17.4748C29.754 17.3793 29.1074 17.334 28.4147 17.334H22.5676C22.4237 17.334 22.2869 17.3666 22.1644 17.4254C21.8948 17.5551 21.6944 17.8104 21.6459 18.1229L20.402 26.0013L20.3662 26.2311C20.4481 25.7126 20.8911 25.3308 21.4168 25.3308H23.6055C27.9041 25.3308 31.2699 23.5851 32.2537 18.5349C32.2831 18.3854 32.3078 18.2398 32.33 18.0975C32.0811 17.9655 31.8115 17.8525 31.5212 17.7563C31.4496 17.7324 31.3757 17.7094 31.3009 17.6871Z"
        fill="#ffffff"
        fillOpacity="0.8"
      />
      <path
        d="M21.6461 18.1231C21.6946 17.8105 21.895 17.5552 22.1646 17.4264C22.2879 17.3675 22.4239 17.3349 22.5678 17.3349H28.4149C29.1077 17.3349 29.7542 17.3803 30.3444 17.4757C30.513 17.5027 30.6768 17.5338 30.8367 17.5687C30.9957 17.6045 31.1508 17.6443 31.3011 17.688C31.3759 17.7103 31.4498 17.7334 31.5222 17.7564C31.8125 17.8527 32.0821 17.9664 32.331 18.0976C32.6237 16.231 32.3287 14.9601 31.3194 13.8093C30.2068 12.5424 28.1986 12 25.629 12H18.169C17.6441 12 17.1963 12.3817 17.1152 12.9011L14.0079 32.5969C13.9467 32.9866 14.2473 33.3381 14.6402 33.3381H19.2458L20.4022 26.0014L21.6461 18.1231Z"
        fill="#ffffff"
      />
    </svg>
  );
}

export const BRAND_LOGOS = [
  { name: "Apple", Component: AppleLogo, ratio: "h-9 w-auto md:h-10" },
  { name: "GitHub", Component: GitHubLogo, ratio: "h-9 w-auto md:h-10" },
  { name: "Microsoft", Component: MicrosoftLogo, ratio: "h-7 w-auto md:h-9" },
  { name: "AWS", Component: AwsLogo, ratio: "h-10 w-auto md:h-12" },
  { name: "Google Cloud", Component: GoogleCloudLogo, ratio: "h-7 w-auto md:h-9" },
  { name: "Visa", Component: VisaLogo, ratio: "h-7 w-auto md:h-9" },
  { name: "PayPal", Component: PayPalLogo, ratio: "h-9 w-auto md:h-11" },
];
