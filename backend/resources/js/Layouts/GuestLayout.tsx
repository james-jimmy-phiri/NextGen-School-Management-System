import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-screen flex-col bg-slate-50">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-br from-blue-600/10 via-sky-500/5 to-transparent"
            />

            <header className="relative z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4 sm:px-6">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-sky-500 text-white shadow-md">
                            <GraduationCap className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-sm font-bold text-slate-900">NextGen Schools</p>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500">Secure sign in</p>
                        </div>
                    </Link>
                    <Link
                        href={route('public.admissions.create')}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-800"
                    >
                        Apply for admission
                    </Link>
                </div>
            </header>

            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="w-full max-w-md"
                >
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-lg shadow-slate-200/50 sm:px-8">
                        {children}
                    </div>
                </motion.div>
            </div>

            <footer className="relative z-10 py-6 text-center text-xs text-slate-400">
                &copy; {new Date().getFullYear()} NextGen School Management System
            </footer>
        </div>
    );
}
