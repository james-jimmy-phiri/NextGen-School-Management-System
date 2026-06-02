import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

export default function PublicLayout({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-screen flex-col bg-slate-50 py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col items-center mb-10"
            >
                <Link href="/" className="group flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-lg font-bold text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
                        NG
                    </span>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">
                            NextGen Schools
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                            Admissions Portal
                        </p>
                    </div>
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
            >
                {children}
            </motion.div>
            
            <p className="mt-20 text-center text-xs text-slate-500 pb-8">
                &copy; {new Date().getFullYear()} NextGen School Management System. All rights reserved.
            </p>
        </div>
    );
}
