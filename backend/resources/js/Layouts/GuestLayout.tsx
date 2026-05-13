import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 py-12 sm:px-6 lg:px-8">
            {/* Background elements */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -top-40 flex justify-center overflow-hidden pointer-events-none"
            >
                <div className="h-[600px] w-[900px] rounded-full bg-indigo-600/20 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col items-center"
            >
                <Link href="/" className="group flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-400 text-lg font-bold text-white shadow-lg shadow-indigo-500/40 transition-transform group-hover:scale-105">
                        NG
                    </span>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            NextGen Schools
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                            Authentication
                        </p>
                    </div>
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative z-10 mt-10 w-full sm:max-w-md"
            >
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-8 py-10 shadow-2xl backdrop-blur-xl sm:px-10">
                    {children}
                </div>
            </motion.div>
            
            <p className="relative z-10 mt-10 text-center text-xs text-slate-500">
                &copy; {new Date().getFullYear()} NextGen School Management System. All rights reserved.
            </p>
        </div>
    );
}
