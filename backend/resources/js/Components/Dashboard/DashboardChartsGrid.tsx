import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import {
    attendanceWeekly,
    debtorsBuckets,
    enrollmentTrend,
    feeCollection,
    genderSplit,
    performanceBySubject,
} from '@/data/dashboardMock';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const tick = { fill: 'hsl(var(--muted-foreground))', fontSize: 11 };

export function DashboardChartsGrid() {
    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Enrollment trend</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <LineChart data={enrollmentTrend}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border/80" />
                            <XAxis dataKey="month" tick={tick} />
                            <YAxis tick={tick} width={32} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: 12,
                                    border: '1px solid hsl(var(--border))',
                                    background: 'hsl(var(--card))',
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="students" stroke="hsl(217 91% 60%)" strokeWidth={2} dot={false} name="Enrolled" />
                            <Line type="monotone" dataKey="target" stroke="hsl(215 16% 70%)" strokeDasharray="4 4" name="Target" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Weekly attendance</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <BarChart data={attendanceWeekly}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border/80" />
                            <XAxis dataKey="day" tick={tick} />
                            <YAxis domain={[88, 100]} tick={tick} width={36} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: 12,
                                    border: '1px solid hsl(var(--border))',
                                    background: 'hsl(var(--card))',
                                }}
                            />
                            <Bar dataKey="rate" fill="hsl(199 89% 48%)" radius={[6, 6, 0, 0]} name="% present" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Fee collection vs expected</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <BarChart data={feeCollection}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border/80" />
                            <XAxis dataKey="week" tick={tick} />
                            <YAxis tick={tick} width={44} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: 12,
                                    border: '1px solid hsl(var(--border))',
                                    background: 'hsl(var(--card))',
                                }}
                            />
                            <Legend />
                            <Bar dataKey="collected" fill="hsl(142 69% 45%)" radius={[6, 6, 0, 0]} name="Collected" />
                            <Bar dataKey="expected" fill="hsl(215 16% 82%)" radius={[6, 6, 0, 0]} name="Expected" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Subject performance</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={performanceBySubject} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border/80" />
                                <XAxis type="number" domain={[60, 90]} tick={tick} />
                                <YAxis type="category" dataKey="subject" width={64} tick={tick} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 12,
                                        border: '1px solid hsl(var(--border))',
                                        background: 'hsl(var(--card))',
                                    }}
                                />
                                <Bar dataKey="avg" fill="hsl(217 91% 60%)" radius={[0, 6, 6, 0]} name="Avg %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Gender distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={genderSplit}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={48}
                                    outerRadius={72}
                                    paddingAngle={3}
                                >
                                    {genderSplit.map((entry) => (
                                        <Cell key={entry.name} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 12,
                                        border: '1px solid hsl(var(--border))',
                                        background: 'hsl(var(--card))',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Debtors analytics</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <BarChart data={debtorsBuckets}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border/80" />
                            <XAxis dataKey="bucket" tick={tick} />
                            <YAxis tick={tick} width={52} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: 12,
                                    border: '1px solid hsl(var(--border))',
                                    background: 'hsl(var(--card))',
                                }}
                            />
                            <Bar dataKey="amount" fill="hsl(38 92% 50%)" radius={[6, 6, 0, 0]} name="MWK" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
