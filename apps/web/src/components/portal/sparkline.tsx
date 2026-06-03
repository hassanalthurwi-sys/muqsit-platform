interface SparklineProps {
  values: number[];
  className?: string;
  ariaLabel?: string;
}

export function Sparkline({ values, className, ariaLabel }: SparklineProps) {
  if (values.length < 2) return null;
  const width = 320;
  const height = 96;
  const padding = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);

  const toX = (i: number) => padding + ((width - padding * 2) * i) / (values.length - 1);
  const toY = (v: number) => height - padding - ((height - padding * 2) * (v - min)) / span;

  const pathD = values.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(2)} ${toY(v).toFixed(2)}`).join(" ");
  const areaD = `${pathD} L ${toX(values.length - 1).toFixed(2)} ${height - padding} L ${toX(0).toFixed(2)} ${height - padding} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      preserveAspectRatio="none"
      className={className}
    >
      <defs>
        <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#sparkFill)" />
      <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={toX(values.length - 1)} cy={toY(values[values.length - 1] ?? 0)} r={3.5} fill="var(--primary)" />
    </svg>
  );
}
