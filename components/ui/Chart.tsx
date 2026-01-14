'use client';

import { cn } from '@/lib/utils';

// Simple Bar Chart
interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  maxValue?: number;
  showValues?: boolean;
  horizontal?: boolean;
  height?: number;
  className?: string;
}

export function BarChart({
  data,
  maxValue,
  showValues = true,
  horizontal = true,
  height = 200,
  className,
}: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  if (horizontal) {
    return (
      <div className={cn('space-y-3', className)}>
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-grey font-medium">{item.label}</span>
              {showValues && <span className="text-ink font-semibold">{item.value.toLocaleString()}</span>}
            </div>
            <div className="h-3 bg-grey-light/50 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500', item.color || 'bg-sky')}
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex items-end gap-2 justify-between', className)} style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-1 h-full">
          <div className="flex-1 w-full flex items-end">
            <div
              className={cn('w-full rounded-t-lg transition-all duration-500', item.color || 'bg-sky')}
              style={{ height: `${(item.value / max) * 100}%`, minHeight: 4 }}
            />
          </div>
          {showValues && (
            <span className="text-xs font-semibold text-ink">{item.value}</span>
          )}
          <span className="text-xs text-grey truncate max-w-full">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// Simple Line Chart
interface LineChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  height?: number;
  color?: string;
  showDots?: boolean;
  showLabels?: boolean;
  className?: string;
}

export function LineChart({
  data,
  height = 150,
  color = '#0EA5E9',
  showDots = true,
  showLabels = true,
  className,
}: LineChartProps) {
  if (data.length < 2) return null;

  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;

  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - ((d.value - min) / range) * 100,
  }));

  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaData = `${pathData} L ${points[points.length - 1].x} 100 L 0 100 Z`;

  return (
    <div className={cn('relative', className)} style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {/* Area fill */}
        <path
          d={areaData}
          fill={color}
          fillOpacity={0.1}
        />
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
        {/* Dots */}
        {showDots && points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="white"
            stroke={color}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {/* Labels */}
      {showLabels && (
        <div className="flex justify-between mt-2">
          {data.map((d, i) => (
            <span key={i} className="text-xs text-grey">
              {d.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Donut/Pie Chart
interface DonutChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  size?: number;
  strokeWidth?: number;
  showLegend?: boolean;
  centerLabel?: string;
  centerValue?: string | number;
  className?: string;
}

export function DonutChart({
  data,
  size = 160,
  strokeWidth = 20,
  showLegend = true,
  centerLabel,
  centerValue,
  className,
}: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <div className={cn('flex items-center gap-6', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = item.value / total;
            const dashLength = circumference * percentage;
            const dashOffset = circumference * currentOffset;
            currentOffset += percentage;

            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference}`}
                strokeDashoffset={-dashOffset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue !== undefined && (
              <span className="text-2xl font-bold text-ink">{centerValue}</span>
            )}
            {centerLabel && (
              <span className="text-xs text-grey">{centerLabel}</span>
            )}
          </div>
        )}
      </div>
      {showLegend && (
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-grey">{item.label}</span>
              <span className="text-sm font-semibold text-ink">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Mini Sparkline
interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function Sparkline({
  data,
  width = 80,
  height = 24,
  color = '#0EA5E9',
  className,
}: SparklineProps) {
  if (data.length < 2) return null;

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * height,
  }));

  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <svg width={width} height={height} className={className}>
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
