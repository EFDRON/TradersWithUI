import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

const CustomTooltip = ({ active, payload, color }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs font-mono">
      <p style={{ color }} className="font-semibold">
        ${payload[0].value?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
      <p className="text-white/40 text-[10px]">{payload[0].payload.time}</p>
    </div>
  );
};

export default function BalanceChart({ data, color, colorRgb }) {
  const gradientId = `chart-gradient-${color.replace('#', '')}`;
  const glowId = `chart-glow-${color.replace('#', '')}`;

  // Calculate domain with padding
  const values = data.map((d) => d.balance);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.15 || max * 0.01;

  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            {/* Gradient fill */}
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="50%" stopColor={color} stopOpacity={0.08} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            {/* Glow filter */}
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <YAxis domain={[min - padding, max + padding]} hide />

          <Tooltip
            content={<CustomTooltip color={color} />}
            cursor={{
              stroke: `rgba(${colorRgb}, 0.2)`,
              strokeWidth: 1,
              strokeDasharray: '4 4',
            }}
          />

          {/* Glow layer */}
          <Area
            type="monotoneX"
            dataKey="balance"
            stroke={color}
            strokeWidth={4}
            fill="transparent"
            dot={false}
            activeDot={false}
            strokeOpacity={0.3}
            style={{ filter: `url(#${glowId})` }}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-out"
          />

          {/* Main line */}
          <Area
            type="monotoneX"
            dataKey="balance"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{
              r: 4,
              fill: color,
              stroke: '#0d1220',
              strokeWidth: 2,
              style: {
                filter: `drop-shadow(0 0 6px ${color})`,
              },
            }}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Live dot indicator at the end */}
      <div
        className="absolute right-1 animate-pulse-glow"
        style={{
          top: '30%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
        }}
      />
    </div>
  );
}
