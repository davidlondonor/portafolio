import { ShaderAnimation } from "@/components/ui/shader-animation";

export default function ShaderDemo() {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden">
      <ShaderAnimation />
      <span className="absolute pointer-events-none z-10 text-center text-7xl leading-none font-semibold tracking-tighter whitespace-pre-wrap text-white">
        Shader Animation
      </span>
    </div>
  );
}
