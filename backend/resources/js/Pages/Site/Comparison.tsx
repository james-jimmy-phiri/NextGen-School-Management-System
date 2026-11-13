import PublicSiteLayout from '@/Layouts/PublicSiteLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
    return { ref, inView };
}

const COMPARISONS = [
    { feature: 'Subscription Pricing', ngms: 'Affordable, localized plans (monthly/termly)', legacy: 'Expensive USD licenses or heavy custom setups' },
    { feature: 'Local Payments Support', ngms: 'Integrated TNM Mpamba, Airtel Money, and local banks', legacy: 'Credit cards only (complex for parents)' },
    { feature: 'Offline Sync Client', ngms: 'Syncs data locally during network outages and syncs when back', legacy: 'Completely goes down with network loss' },
    { feature: 'Customer Support Response', ngms: 'On-site coaching and 4-hour local support tickets SLA', legacy: 'Delayed email responses from offshore centers' },
    { feature: 'Onboarding & Migration', ngms: '100% free assisted data cleanup and import', legacy: 'Self-serve templates or expensive consulting fees' },
    { feature: 'School Portal Logins', ngms: 'Integrated Parent, Teacher, and Student mobile portals', legacy: 'Administrators-only dashboard, disconnected parents' }
];

const SWITCHERS_TESTIMONIALS = [
    {
        quote: "We were using an international school system, but parents found fee payments extremely difficult because it only accepted global credit cards. Switching to NGMS allowed our parents to pay via Mpamba and Airtel Money instantly.",
        author: "Mrs. Brenda Mzembe",
        title: "Bursar, Blantyre Secondary School",
        initials: "BM"
    },
    {
        quote: "Our previous software would freeze and lose database records whenever electricity went out. NGMS\'s offline sync ensures teachers can enter grades offline, and it uploads once connectivity returns.",
        author: "Brother John Phiri",
        title: "Principal, Saint Peter Academy",
        initials: "JP"
    }
];

export default function Comparison() {
    const tableReveal = useReveal();
    const migrationReveal = useReveal();

    return (
        <PublicSiteLayout activePage="HOW IT WORKS">
            <Head>
                <title>NextGen vs Alternatives — NextGen School Management System</title>
                <meta name="description" content="Discover why Malawian schools are switching from legacy databases and spreadsheets to NextGen. View our side-by-side comparison." />
            </Head>

            {/* ── Page Hero ── */}
            <div className="relative pt-48 pb-20 bg-ngms-navy overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/site/news-academics.png" alt="" className="w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-ngms-navy/97 to-ngms-teal/85" />
                </div>
                <div className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-16 text-white text-center">
                    <p className="font-label text-[11px] tracking-[0.22em] uppercase text-ngms-sky-light mb-3 flex items-center justify-center gap-2">
                        <span className="inline-block w-0.5 h-3.5 bg-ngms-gold rounded" />
                        Why Switch?
                    </p>
                    <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight mb-5">
                        Why Schools Switch to NextGen
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                        Compare NextGen side-by-side with spreadsheets or legacy offshore databases. Built specifically to handle Malawian payment options, connectivity, and budgets.
                    </p>
                </div>
            </div>

            {/* ── Comparison Table ── */}
            <section ref={tableReveal.ref} className="py-24 px-5 lg:px-16 max-w-[1024px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={tableReveal.inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-serif text-3xl font-bold text-ngms-navy">Side-by-Side Comparison</h2>
                    <p className="text-on-surface-var text-xs mt-2">See how NGMS compares to traditional legacy school databases.</p>
                </motion.div>

                <div className="bg-white border border-surface-variant rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-surface-variant bg-surface-alt font-label text-xs tracking-wider uppercase text-ngms-navy">
                                <th className="py-4.5 px-6 font-bold w-1/3">Feature Capabilities</th>
                                <th className="py-4.5 px-6 font-bold text-ngms-teal bg-ngms-teal/5 w-1/3">NextGen Platform</th>
                                <th className="py-4.5 px-6 font-bold text-on-surface-var/60 w-1/3">Legacy / Excel Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {COMPARISONS.map((item, idx) => (
                                <tr key={idx} className="border-b border-surface-variant/40 text-xs hover:bg-surface-low/35 transition-colors">
                                    <td className="py-5 px-6 font-bold text-ngms-navy">{item.feature}</td>
                                    <td className="py-5 px-6 text-ngms-teal bg-ngms-teal/[0.02] font-medium leading-relaxed">{item.ngms}</td>
                                    <td className="py-5 px-6 text-on-surface-var/80 leading-relaxed">{item.legacy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ── Migration Support Section ── */}
            <section ref={migrationReveal.ref} className="py-24 px-5 lg:px-16 bg-surface-low border-t border-surface-variant">
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={migrationReveal.inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <span className="inline-block bg-ngms-gold/15 text-ngms-navy font-label text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded font-bold">
                            HASSLE-FREE SWITCHING
                        </span>
                        <h2 className="font-serif text-3xl font-bold text-ngms-navy">We Help You Switch — Free Data Migration</h2>
                        <p className="text-sm text-on-surface-var leading-relaxed">
                            Concerned about losing historical attendance records, grading history, or fee balances? Our customer support engineering team specializes in clean database conversions.
                        </p>
                        <p className="text-sm text-on-surface-var leading-relaxed">
                            We format your lists, upload them securely, configure stream rules, and issue teacher credentials. Most schools transition from their previous setups in less than 5 days.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={migrationReveal.inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-white border border-surface-variant p-8 rounded-xl shadow-sm space-y-6"
                    >
                        <h3 className="font-serif text-lg font-bold text-ngms-navy">Our Switching Protocol</h3>
                        <ul className="space-y-4">
                            {[
                                { title: '1. Send Us Your Files', desc: 'Email your rosters in any spreadsheet or paper scan format.' },
                                { title: '2. Data Structure & Import', desc: 'We clean database fields and import records securely.' },
                                { title: '3. Verification & Go Live', desc: 'Check records accuracy and send automated SMS logins.' }
                            ].map((step, idx) => (
                                <li key={idx} className="flex gap-4">
                                    <span className="inline-flex w-6 h-6 rounded-full bg-ngms-teal text-white items-center justify-center font-bold text-xs shrink-0">{idx + 1}</span>
                                    <div>
                                        <h4 className="font-sans text-xs font-bold text-ngms-navy">{step.title}</h4>
                                        <p className="text-[11px] text-on-surface-var mt-0.5">{step.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* ── Testimonials from Switchers ── */}
            <section className="py-24 px-5 lg:px-16 max-w-[1280px] mx-auto">
                <div className="text-center mb-16">
                    <p className="font-label text-xs tracking-[0.22em] uppercase text-ngms-blue mb-2">Real Feedback</p>
                    <h2 className="font-serif text-3xl font-bold text-ngms-navy">What Onboarded Schools Say</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {SWITCHERS_TESTIMONIALS.map((t, idx) => (
                        <div key={idx} className="border border-surface-variant p-8 rounded-xl bg-white hover:shadow-md transition-shadow relative">
                            <span className="material-symbols-outlined text-4xl text-ngms-sky/20 absolute left-4 top-4">format_quote</span>
                            <p className="text-xs text-on-surface-var/90 leading-relaxed italic mb-6 pl-6 relative z-10">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-3 border-t border-surface-low pt-4">
                                <div className="w-9 h-9 rounded-full bg-ngms-teal text-white flex items-center justify-center font-sans font-bold text-xs">{t.initials}</div>
                                <div>
                                    <h4 className="font-sans text-xs font-bold text-ngms-navy">{t.author}</h4>
                                    <p className="text-[10px] text-on-surface-var">{t.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Final Comparison CTA ── */}
            <section className="bg-ngms-navy py-20 px-5 lg:px-16 text-white text-center">
                <div className="max-w-[600px] mx-auto space-y-6">
                    <h2 className="font-serif text-3xl font-bold">See the Difference Today</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Book a demo session where we compare NextGen side-by-side with your current administrative processes or tools.
                    </p>
                    <div className="pt-2 flex justify-center gap-4">
                        <Link
                            href="/site/contact"
                            className="font-label text-xs tracking-widest uppercase bg-ngms-gold text-ngms-navy px-8 py-3.5 rounded-full hover:bg-white transition-colors font-bold"
                        >
                            Book a Side-by-Side Demo
                        </Link>
                    </div>
                </div>
            </section>
        </PublicSiteLayout>
    );
}
