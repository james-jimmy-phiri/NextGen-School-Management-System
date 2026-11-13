import PublicSiteLayout from '@/Layouts/PublicSiteLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
    return { ref, inView };
}

const MODULES = [
    {
        title: 'Student Information (SIS)',
        desc: 'The core database of your school, holding complete lifecycle records of students from admission to graduation.',
        points: [
            'Secure student profiles with bio data, parent links, and health cards.',
            'Digital files repository for storing birth certificates, transcripts, and records.',
            'Real-time class list generations and school statistics reporting.'
        ],
        icon: 'badge',
        image: '/images/site/welcome-students.png'
    },
    {
        title: 'Attendance Tracker',
        desc: 'Streamlined, error-free attendance management for class registers, exams, and hostels.',
        points: [
            'Single-tap attendance registers for teachers in class.',
            'Automated SMS notifications sent to parents for absent students.',
            'Termly percentage compliance reporting for administration audits.'
        ],
        icon: 'fact_check',
        image: '/images/site/news-academics.png'
    },
    {
        title: 'Academics & Exams',
        desc: 'Highly customizable grading scales, assessments structures, and report card generations.',
        points: [
            'Digital gradebooks for teachers with secure mark sheets entry.',
            'Auto-calculated stream positions, grade averages, and pass/fail status.',
            'Batch printing of premium, branded progress report cards.'
        ],
        icon: 'history_edu',
        image: '/images/site/news-graduation.png'
    },
    {
        title: 'Finance & Fee Management',
        desc: 'End-to-end billing tool designed for Bursars to minimize fee defaults and leakages.',
        points: [
            'Flexible custom invoice structures (per class, per stream, or individual).',
            'Integrated cash books, fee collection ledgers, and expense recorders.',
            'Automated balance statements sent via SMS on customized schedules.'
        ],
        icon: 'payments',
        image: '/images/site/news-academics.png'
    },
    {
        title: 'Communication Hub',
        desc: 'Unify interactions between administrators, teachers, and parent communities.',
        points: [
            'Direct parent-to-teacher instant messaging channels.',
            'School-wide announcements board with mobile notification support.',
            'Targeted SMS broadcasting lists for fee reminders or event alerts.'
        ],
        icon: 'forum',
        image: '/images/site/welcome-students.png'
    },
    {
        title: 'Staff & Payroll Administration',
        desc: 'Control administrative roles, track teacher allocations, and manage payroll scales.',
        points: [
            'Granular Role-Based Access Controls (RBAC) for security policies.',
            'Visual class timetables builder and teacher workload assignments tracker.',
            'Manage staff contracts, profiles, and basic salary slips.'
        ],
        icon: 'groups',
        image: '/images/site/news-graduation.png'
    }
];

const MOBILE_APPS = [
    { name: 'Parent App Portal', desc: 'Allows parents to instantly view fee invoice balances, download PDF report cards, check live attendance, and message teachers.', icon: 'diversity_1' },
    { name: 'Teacher Portal App', desc: 'Gives teachers portable access to input marks, mark daily attendance registers, and upload homework syllabus files on the go.', icon: 'co_present' },
    { name: 'Student Portal Dashboard', desc: 'An intuitive workspace for students to track timetables, check assignments, and receive announcement broadcasts.', icon: 'school' }
];

export default function Features() {
    const modulesReveal = useReveal();
    const integrationReveal = useReveal();
    const appsReveal = useReveal();

    return (
        <PublicSiteLayout activePage="PRODUCT">
            <Head>
                <title>Features Hub — NextGen School Management System</title>
                <meta name="description" content="Explore the comprehensive features of NGMS - grading scales, finance invoicing, automated attendance registers, and parent portals." />
            </Head>

            {/* ── Page Hero ── */}
            <div className="relative pt-48 pb-20 bg-ngms-navy overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/site/news-academics.png" alt="" className="w-full h-full object-cover opacity-25" />
                    <div className="absolute inset-0 bg-gradient-to-br from-ngms-navy/95 to-ngms-teal/80" />
                </div>
                <div className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-16 text-white">
                    <p className="font-label text-[11px] tracking-[0.22em] uppercase text-ngms-sky-light mb-3 flex items-center gap-2">
                        <span className="inline-block w-0.5 h-3.5 bg-ngms-gold rounded" />
                        Everything in One System
                    </p>
                    <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight mb-5">
                        Features Built for<br />Modern School Operations
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
                        NGMS replaces single-purpose tools with one unified software ecosystem. Streamline daily administration, optimize collection revenues, and connect with parents.
                    </p>
                </div>
            </div>

            {/* ── Module Breakdown ── */}
            <section ref={modulesReveal.ref} className="py-24 px-5 lg:px-16 max-w-[1280px] mx-auto space-y-20">
                <div className="text-center">
                    <p className="font-label text-[12px] tracking-[0.22em] uppercase text-ngms-blue mb-2">Deep Dive Modules</p>
                    <h2 className="font-serif text-4xl font-bold text-ngms-navy">Explore Platform Capabilities</h2>
                </div>

                <div className="space-y-24">
                    {MODULES.map((mod, idx) => (
                        <motion.div
                            key={mod.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={modulesReveal.inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: idx * 0.05 }}
                            className={`flex flex-col lg:flex-row items-center gap-12 ${
                                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                            }`}
                        >
                            {/* Content Column */}
                            <div className="w-full lg:w-1/2 space-y-6">
                                <div className="inline-flex w-12 h-12 rounded-xl bg-ngms-sky/10 text-ngms-sky items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">{mod.icon}</span>
                                </div>
                                <h3 className="font-serif text-2xl lg:text-3xl font-bold text-ngms-navy">
                                    {mod.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-on-surface-var">
                                    {mod.desc}
                                </p>
                                <ul className="space-y-3">
                                    {mod.points.map((pt, pIdx) => (
                                        <li key={pIdx} className="flex items-start gap-2.5 text-xs text-on-surface-var/90">
                                            <span className="material-symbols-outlined text-ngms-gold text-base mt-0.5 leading-none">check_circle</span>
                                            <span>{pt}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Image Mockup Column */}
                            <div className="w-full lg:w-1/2">
                                <div className="border border-surface-variant p-4 bg-surface rounded-xl hover:shadow-xl transition-shadow duration-300">
                                    <img
                                        src={mod.image}
                                        alt={mod.title}
                                        className="w-full h-72 object-cover rounded shadow-inner"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Integration Highlights ── */}
            <section ref={integrationReveal.ref} className="bg-ngms-navy py-24 px-5 lg:px-16 text-white">
                <div className="max-w-[1280px] mx-auto text-center space-y-6">
                    <p className="font-label text-[12px] tracking-[0.22em] uppercase text-ngms-sky-light">Seamless Integrations</p>
                    <h2 className="font-serif text-4xl font-bold">Local Payment Gateways & SMS Channels</h2>
                    <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
                        NGMS is built specifically for Malawi. We integrate with major national utilities and banking systems to ensure billing operations are seamless.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 max-w-4xl mx-auto">
                        {[
                            { name: 'Mobile Money Gateways', desc: 'Accept direct payments via TNM Mpamba and Airtel Money. Parents receive digital invoice receipts, and fees reconcile automatically.', icon: 'smartphone' },
                            { name: 'Local Bank Integrations', desc: 'Reconcile school fee balances directly with bank statement imports, connecting parent cash deposits to students.', icon: 'account_balance' },
                            { name: 'National SMS Gateways', desc: 'Send real-time alerts, class reminders, emergency notices, and balance messages directly to parent numbers.', icon: 'textsms' }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 16 }}
                                animate={integrationReveal.inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="bg-white/5 border border-white/10 p-8 rounded-lg text-left hover:bg-white/10 transition-colors"
                            >
                                <span className="material-symbols-outlined text-ngms-gold text-2xl mb-4 block">{item.icon}</span>
                                <h3 className="font-sans text-base font-bold text-white mb-2">{item.name}</h3>
                                <p className="text-xs text-white/60 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Mobile Apps highlights ── */}
            <section ref={appsReveal.ref} className="py-24 px-5 lg:px-16 max-w-[1280px] mx-auto">
                <div className="text-center mb-16">
                    <p className="font-label text-[12px] tracking-[0.22em] uppercase text-ngms-blue mb-2">Connected Community</p>
                    <h2 className="font-serif text-4xl font-bold text-ngms-navy">NGMS App Portals</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {MOBILE_APPS.map((app, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={appsReveal.inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="border border-surface-variant p-8 rounded-xl bg-surface-alt hover:border-ngms-gold transition-colors group"
                        >
                            <div className="w-12 h-12 bg-ngms-gold/10 text-ngms-gold rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200">
                                <span className="material-symbols-outlined text-2xl">{app.icon}</span>
                            </div>
                            <h3 className="font-serif text-lg font-bold text-ngms-navy mb-2">{app.name}</h3>
                            <p className="text-xs text-on-surface-var leading-relaxed">{app.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="bg-surface-low border-t border-surface-variant py-20 px-5 lg:px-16 text-center">
                <div className="max-w-[600px] mx-auto space-y-6">
                    <h2 className="font-serif text-3xl font-bold text-ngms-navy">Ready to See It in Action?</h2>
                    <p className="text-on-surface-var text-sm leading-relaxed">
                        Book a personalized live demo session. One of our Malawian school implementation specialists will walk you through the portals, grading systems, and fee management features.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/site/contact"
                            className="inline-flex items-center gap-2 font-label text-xs tracking-widest uppercase bg-ngms-navy text-white px-8 py-3.5 rounded-full hover:bg-ngms-sky transition-colors font-bold"
                        >
                            Book a Demo Callback
                        </Link>
                    </div>
                </div>
            </section>
        </PublicSiteLayout>
    );
}
