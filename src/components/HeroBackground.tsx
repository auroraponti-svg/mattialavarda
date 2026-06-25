import AnimatedSpine from "@/components/AnimatedSpine";

// Decorative animated backdrop for the hero: floating brand-colored orbs
// + a stylized swaying spine. Purely decorative, sits behind content.
export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Floating gradient orbs */}
      <span
        className="orb"
        style={{ width: 320, height: 320, top: "-60px", left: "-40px", background: "#7FB1DC", animation: "orb-a 13s ease-in-out infinite" }}
      />
      <span
        className="orb"
        style={{ width: 380, height: 380, bottom: "-120px", right: "-60px", background: "#3F6FA0", animation: "orb-b 16s ease-in-out infinite", opacity: 0.35 }}
      />
      <span
        className="orb"
        style={{ width: 240, height: 240, top: "40%", left: "55%", background: "#AFD2EF", animation: "orb-c 11s ease-in-out infinite", opacity: 0.4 }}
      />

      {/* Swaying spine, right side, subtle */}
      <AnimatedSpine className="absolute right-[4%] top-1/2 -translate-y-1/2 h-[115%] w-auto opacity-[0.13] hidden lg:block" />
    </div>
  );
}
