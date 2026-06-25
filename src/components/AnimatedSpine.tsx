// Stylized animated spine — each vertebra sways/breathes in sequence,
// evoking a gentle spinal mobilization. Pure CSS animation (GPU, reduced-motion aware).
export default function AnimatedSpine({ className = "" }: { className?: string }) {
  const vertebrae = Array.from({ length: 9 });
  const stepY = 36;
  const startY = 26;

  return (
    <svg
      viewBox="0 0 140 360"
      className={className}
      fill="none"
      aria-hidden="true"
      role="presentation"
    >
      <g className="spine-float">
        {vertebrae.map((_, i) => {
          const y = startY + i * stepY;
          const delay = `${i * 200}ms`;
          // leggera curvatura naturale della colonna
          const cx = 70 + Math.sin(i / 2.2) * 10;
          return (
            <g key={i} className="vertebra" style={{ animationDelay: delay }}>
              {/* disco intervertebrale */}
              {i < vertebrae.length - 1 && (
                <ellipse cx={70 + Math.sin((i + 0.5) / 2.2) * 10} cy={y + stepY / 2} rx="13" ry="5" fill="#AFD2EF" opacity="0.6" />
              )}
              {/* corpo vertebrale */}
              <rect x={cx - 17} y={y - 11} width="34" height="22" rx="9" fill="#3F6FA0" />
              {/* processi laterali */}
              <circle cx={cx - 24} cy={y} r="4.5" fill="#7FB1DC" />
              <circle cx={cx + 24} cy={y} r="4.5" fill="#7FB1DC" />
              {/* processo spinoso */}
              <circle cx={cx} cy={y} r="5" fill="#2B2E54" opacity="0.45" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
