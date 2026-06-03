import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface PerformanceChartProps {
    data: { subject: string; score: number; average?: number }[];
    height?: number;
}

export default function PerformanceChart({ data, height = 300 }: PerformanceChartProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const getScoreColor = (score: number) => {
        if (score >= 80) return isDark ? '#34d399' : '#10b981'; // emerald
        if (score >= 60) return isDark ? '#60a5fa' : '#3b82f6'; // blue
        if (score >= 50) return isDark ? '#fbbf24' : '#f59e0b'; // amber
        return isDark ? '#f87171' : '#ef4444'; // red
    };

    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                    <XAxis 
                        dataKey="subject" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} 
                        domain={[0, 100]}
                    />
                    <Tooltip 
                        cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9' }}
                        contentStyle={{ 
                            backgroundColor: isDark ? '#0f172a' : '#ffffff',
                            borderColor: isDark ? '#334155' : '#e2e8f0',
                            borderRadius: '0.75rem',
                            color: isDark ? '#f8fafc' : '#0f172a',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                        }}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={40}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
