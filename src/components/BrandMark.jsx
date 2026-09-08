import { Droplet, Zap } from "lucide-react";

export default function BrandMark({ size = 44 }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-amber-500 shadow-lg"
      style={{ width: size, height: size }}
    >
      <Droplet className="absolute -translate-x-1.5 text-white/90" size={size * 0.42} />
      <Zap className="absolute translate-x-1.5 translate-y-0.5 text-white" size={size * 0.42} />
    </div>
  );
}
