import PublicSiteLayout from '@/Layouts/PublicSiteLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
    return { ref, inView };
}

const SEC_PILLARS = [
    {
        title: 'Data Encryption',
        icon: 'enhanced_encryption',
        desc: 'All connections are protected using high-grade Transport Layer Security (TLS). Data in the database is encrypted at rest using AES-256 standards, meaning records are secure.'
    },
    {
        title: 'Multi-Tenant Isolation',
        icon: 'hub',
        desc: 'NGMS isolates each school\'s database schema. Your records, user profiles, and logs are completely separated, ensuring your school\'s data never mixes with others.'
    },
    {
        title: 'Backup & Disaster Recovery',
        icon: 'backup',
        desc: 'We perform automated database backups hourly. Backups are stored in separate, geographically isolated cloud servers, with a 30-day retention policy.'
    },
    {
        title: 'Access Controls (RBAC)',
        icon: 'admin_panel_settings',
        desc: 'Granular Role-Based Access Controls restrict system access. Teachers, bursars, and registrar agents only access features explicit to their roles.'
    }
];

export default function Security() {
    const pillarsReveal = useReveal();
    const complianceReveal = useReveal();

    return (
        <PublicSiteLayout activePage="HOW IT WORKS">
            <Head>
                <title>Security & Compliance — NextGen School Management System</title>
                <meta name="description" content="Learn how NextGen keeps student data secure. Discover database encryption, multi-tenant isolation, automated backups, and compliance structures." />
            </Head>

            {/* ── Page Hero ── */}
            <div className="relative pt-48 pb-20 bg-ngms-navy overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/site/athletics-students.png" alt="" className="w-full h-full object-cover opacity-25" />
                    <div className="absolute inset-0 bg-gradient-to-br from-ngms-navy/95 to-ngms-teal/80" />
                </div>
                <div className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-16 text-white text-center">
                    <p className="font-label text-[11px] tracking-[0.22em] uppercase text-ngms-sky-light mb-3 flex items-center justify-center gap-2">
                        <span className="inline-block w-0.5 h-3.5 bg-ngms-gold rounded" />
                        Trust & Safety
                    </p>
                    <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight mb-5">
                        Enterprise-Grade Security<br />for Every School
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                        NextGen is built to hold sensitive student records and financial ledgers. We implement state-of-the-art security measures to keep your school data protected.
                    </p>
                </div>
            </div>

            {/* ── Security Pillars ── */}
            <section ref={pillarsReveal.ref} className="py-24 px-5 lg:px-16 max-w-[1280px] mx-auto">
                <div className="text-center mb-16">
                    <p className="font-label text-xs tracking-[0.22em] uppercase text-ngms-blue mb-2">Our Architecture</p>
                    <h2 className="font-serif text-3xl lg:text-4xl font-bold text-ngms-navy">How We Keep Your Data Safe</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {SEC_PILLARS.map((pil, i) => (
                        <motion.div
                            key={pil.title}
                            initial={{ opacity: 0, y: 16 }}
                            animate={pillarsReveal.inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="bg-white border border-surface-variant p-8 rounded-xl hover:border-ngms-sky hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-ngms-sky/10 text-ngms-sky flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined text-2xl">{pil.icon}</span>
                            </div>
                            <h3 className="font-sans text-base font-bold text-ngms-navy mb-2">{pil.title}</h3>
                            <p className="text-xs leading-relaxed text-on-surface-var">{pil.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Compliance Statements ── */}
            <section ref={complianceReveal.ref} className="py-24 px-5 lg:px-16 bg-surface-low border-t border-surface-variant">
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={complianceReveal.inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7 space-y-6"
                    >
                        <span className="inline-block bg-ngms-gold/10 text-ngms-gold font-label text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded font-bold">
                            REGULATORY ALIGNMENT
                        </span>
                        <h2 className="font-serif text-3xl font-bold text-ngms-navy">Compliance with Malawian Data Laws</h2>
                        <p className="text-sm text-on-surface-var leading-relaxed">
                            NGMS conforms fully with the Malawian Data Protection Act and other relevant regional communications and privacy standards governing the storage of personal identity documents and minor records.
                        </p>
                        <p className="text-sm text-on-surface-var leading-relaxed">
                            We commit to never selling, sharing, or leasing student records, parent email directories, or transaction histories to third-party advertisers or aggregators.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={complianceReveal.inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:col-span-5 bg-white border border-surface-variant p-8 rounded-xl shadow-sm space-y-4"
                    >
                        <h3 className="font-serif text-lg font-bold text-ngms-navy">Security Checklist</h3>
                        {[
                            { item: 'Secure HTTPS (TLS 1.3)', val: 'Enforced' },
                            { item: 'AES-256 DB Encryption', val: 'Active' },
                            { item: 'Database schema separation', val: 'Active' },
                            { item: 'Audit logs tracking', val: 'Active' },
                            { item: 'GDPR / Local Act alignment', val: 'Compliant' }
                        ].map((chk, i) => (
                            <div key={i} className="flex justify-between py-2 border-b border-surface-low last:border-b-0">
                                <span className="text-xs font-semibold text-on-surface-var">{chk.item}</span>
                                <span className="text-xs text-ngms-teal font-bold flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs leading-none">verified</span>
                                    {chk.val}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="bg-ngms-navy py-20 px-5 lg:px-16 text-white text-center">
                <div className="max-w-[600px] mx-auto space-y-6">
                    <h2 className="font-serif text-3xl font-bold">Have Questions About Security?</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Request our detailed technical security whitepaper or talk directly to our engineering compliance officer.
                    </p>
                    <div className="pt-2 flex justify-center gap-4">
                        <Link
                            href="/site/contact"
                            className="font-label text-xs tracking-widest uppercase bg-ngms-gold text-ngms-navy px-8 py-3.5 rounded-full hover:bg-white transition-colors font-bold"
                        >
                            Talk to Compliance
                        </Link>
                    </div>
                </div>
            </section>
        </PublicSiteLayout>
    );
}
