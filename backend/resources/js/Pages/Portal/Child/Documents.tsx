import { Head } from '@inertiajs/react';
import PortalLayout from '@/Layouts/PortalLayout';
import SectionHeader from '@/Components/Portal/SectionHeader';
import ChildSwitcher from '@/Components/Portal/ChildSwitcher';
import { FileText, Download, FileArchive, FileDown } from 'lucide-react';
import type { PageProps } from '@/types';
import { format, parseISO } from 'date-fns';

export default function ChildDocuments({ student, documents }: PageProps<{ student: any, documents: any[] }>) {
    return (
        <PortalLayout>
            <Head title={`Documents - ${student.first_name}`} />

            <SectionHeader 
                title="School Documents" 
                subtitle="Downloadable records and reports"
                backHref={route('portal.children.show', student.id)}
                icon={FileText}
                actions={<ChildSwitcher students={[student]} currentStudentId={student.id} />}
            />

            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Available Files</h3>
                    <span className="text-xs text-muted-foreground">{documents.length} files</span>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    {documents.length === 0 ? (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <FileArchive className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <p>No documents available for download.</p>
                        </div>
                    ) : (
                        documents.map((doc, idx) => (
                            <div key={idx} className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md">
                                <div>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center shrink-0">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                            {doc.type}
                                        </span>
                                    </div>
                                    <h4 className="font-semibold text-foreground line-clamp-1" title={doc.name}>{doc.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Uploaded {format(parseISO(doc.created_at), 'MMM d, yyyy')}</p>
                                </div>
                                <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                                    <FileDown className="w-4 h-4" /> Download
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </PortalLayout>
    );
}
