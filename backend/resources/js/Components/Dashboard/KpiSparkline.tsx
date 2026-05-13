import { useId } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

type KpiSparklineProps = {
    data: number[];
    color: string;
};

export function KpiSparkline({ data, color }: KpiSparklineProps) {
    const uid = useId().replace(/:/g, '');
    const chartData = data.map((v, i) => ({ i, v }));
    const gradId = `kpi-grad-${uid}`;
    return (
        <div className="h-10 w-28 shrink-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="v"
                        stroke={color}
                        strokeWidth={2}
                        fill={`url(#${gradId})`}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
