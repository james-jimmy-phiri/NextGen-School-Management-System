import { Head } from '@inertiajs/react';
import PortalLayout from '@/Layouts/PortalLayout';
import SectionHeader from '@/Components/Portal/SectionHeader';
import ChildSwitcher from '@/Components/Portal/ChildSwitcher';
import BalanceCard from '@/Components/Portal/BalanceCard';
import { Wallet, FileText, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import type { PageProps } from '@/types';
import { format, parseISO } from 'date-fns';

export default function ChildFees({ student, summary, invoices, payments }: PageProps<{ student: any, summary: any, invoices: any[], payments: any[] }>) {
    return (
        <PortalLayout>
            <Head title={`Finances - ${student.first_name}`} />

            <SectionHeader 
                title="Financial Accounts" 
                subtitle="Fee statements and payment history"
                backHref={route('portal.children.show', student.id)}
                icon={Wallet}
                actions={<ChildSwitcher students={[student]} currentStudentId={student.id} />}
            />

            <div className="mb-8 grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <BalanceCard 
                        totalFees={summary.total_fees} 
                        amountPaid={summary.amount_paid} 
                        balanceDue={summary.balance_due} 
                        currency={summary.currency}
                        status={summary.balance_due === 0 ? 'paid' : (summary.balance_due > 0 && summary.amount_paid > 0 ? 'partial' : 'unpaid')}
                        dueDate="Jun 30, 2026"
                    />
                </div>
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm h-full flex flex-col justify-center text-center items-center">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                            <Wallet className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Make a Payment</h3>
                        <p className="text-sm text-muted-foreground max-w-md mb-6">
                            Securely pay school fees online using credit card, mobile money, or bank transfer directly from the portal.
                        </p>
                        <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-primary/90 transition-colors focus:ring-2 focus:ring-primary/40 focus:ring-offset-1">
                            Pay Now via Gateway
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Invoices */}
                <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col overflow-hidden">
                    <div className="border-b border-border bg-muted/30 px-6 py-4 flex justify-between items-center">
                        <h3 className="font-semibold text-foreground">Invoices & Statements</h3>
                    </div>
                    <div className="flex flex-col divide-y divide-border p-0">
                        {invoices.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">No invoices found.</div>
                        ) : (
                            invoices.map((inv, idx) => (
                                <div key={idx} className="p-4 transition-colors hover:bg-muted/20">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-3">
                                            <div className="mt-0.5 text-muted-foreground">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">{inv.term}</h4>
                                                <p className="text-xs text-muted-foreground">#{inv.invoice_number} · Due {format(parseISO(inv.due_date), 'MMM d, yyyy')}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <p className="font-semibold text-foreground">{summary.currency} {Number(inv.total).toLocaleString()}</p>
                                            <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                                                inv.status === 'partial' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                                                'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                            }`}>
                                                {inv.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 border border-border rounded-lg overflow-hidden">
                                        <table className="w-full text-left text-xs">
                                            <tbody className="divide-y divide-border bg-muted/10">
                                                {inv.lines.map((line: any, lIdx: number) => (
                                                    <tr key={lIdx}>
                                                        <td className="px-3 py-2 text-muted-foreground">{line.description}</td>
                                                        <td className="px-3 py-2 text-right font-medium">{Number(line.amount).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-3 flex justify-end">
                                        <button className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                                            <Download className="w-3.5 h-3.5" /> Download PDF
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Payments */}
                <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col overflow-hidden">
                    <div className="border-b border-border bg-muted/30 px-6 py-4">
                        <h3 className="font-semibold text-foreground">Recent Payments</h3>
                    </div>
                    <div className="flex flex-col divide-y divide-border p-0">
                        {payments.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">No payment history found.</div>
                        ) : (
                            payments.map((payment, idx) => (
                                <div key={idx} className="p-4 transition-colors hover:bg-muted/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{payment.method}</p>
                                            <p className="text-xs text-muted-foreground">Ref: {payment.reference} · {format(parseISO(payment.paid_at), 'MMM d, yyyy h:mm a')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-emerald-600 dark:text-emerald-400">+{summary.currency} {Number(payment.amount).toLocaleString()}</p>
                                        <button className="mt-1 flex items-center justify-end w-full gap-1 text-[10px] font-semibold text-primary hover:underline">
                                            Receipt <Download className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
