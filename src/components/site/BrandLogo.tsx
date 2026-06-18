import { useTheme } from "@/hooks/use-theme";
import lightLogo from "@/assets/virsa-logo-light.png.asset.json";
import darkLogo from "@/assets/virsa-logo-dark.png.asset.json";

export function BrandLogo({ className = "h-7 w-auto" }: { className?: string }) {
  const { theme } = useTheme();
  const src = theme === "light" ? lightLogo.url : darkLogo.url;
  return (
    <img
      src={src}
      alt="VIRSA"
      className={className}
      width={192}
      height={64}
      draggable={false}
    />
  );
}
