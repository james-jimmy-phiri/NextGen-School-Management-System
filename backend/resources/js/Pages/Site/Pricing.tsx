import PublicSiteLayout from '@/Layouts/PublicSiteLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
    return { ref, inView };
}

interface PricingPlan {
    name: string;
    description: string;
    monthlyPrice: string;
    termlyPrice: string;
    annualPrice: string;
    features: string[];
    popular?: boolean;
    ctaLabel: string;
}

const PLANS: PricingPlan[] = [
    {
        name: 'Starter Plan',
        description: 'Perfect for small or newly established schools needing basic administrative tools.',
        monthlyPrice: 'MK 20,000',
        termlyPrice: 'MK 75,000',
        annualPrice: 'MK 200,000',
        features: [
            'Student & Staff Records (SIS)',
            'Daily Attendance Register',
            'Basic Marks Entry & Gradebook',
            'Pre-designed Report Card Templates',
            'Manual Fee Record Logging',
            'Email Support'
        ],
        ctaLabel: 'Start Starter Trial'
    },
    {
        name: 'Standard Plan',
        description: 'For growing schools looking to unify invoicing, communication, and grading.',
        monthlyPrice: 'MK 40,000',
        termlyPrice: 'MK 150,000',
        annualPrice: 'MK 400,000',
        features: [
            'Everything in Starter',
            'Automated Finance Invoicing',
            'Mpamba / Airtel Money Integrations',
            'Broadcasting SMS & Notices',
            'Parent App & Web Portal login',
            'Customizable Grading Scales',
            'Priority Email & Phone Support'
        ],
        popular: true,
        ctaLabel: 'Start Standard Trial'
    },
    {
        name: 'Premium Plan',
        description: 'A comprehensive solution with advanced analytics, RBAC controls, and full data migrations.',
        monthlyPrice: 'MK 75,000',
        termlyPrice: 'MK 280,000',
        annualPrice: 'MK 750,000',
        features: [
            'Everything in Standard',
            'Role-Based Access Control (RBAC)',
            'Visual Timetable & Stream Builder',
            'Staff Payroll Slip Generator',
            'Finance Cash Book & Ledgers',
            'AI-Powered Academics Analytics',
            'Free Managed Data Migration',
            '24/7 Dedicated Account Manager'
        ],
        ctaLabel: 'Start Premium Trial'
    }
];

const COMPARISON_FEATURES = [
    { module: 'Core Database', starter: 'Up to 250 students', standard: 'Unlimited students', premium: 'Unlimited students' },
    { module: 'Attendance Registers', starter: 'Yes', standard: 'Yes (with live parent SMS alerts)', premium: 'Yes (with live parent SMS alerts)' },
    { module: 'Invoicing & Ledgers', starter: 'Manual logging only', standard: 'Automated billing', premium: 'Automated billing + cash books' },
    { module: 'Mobile Money Gateway', starter: 'No', standard: 'Yes', premium: 'Yes' },
    { module: 'SMS Notifications', starter: 'No', standard: 'Bulk broadcasts', premium: 'Automated alerts + custom groups' },
    { module: 'Parent Portal Login', starter: 'No', standard: 'Yes', premium: 'Yes' },
    { module: 'Role-Based Security', starter: 'No', standard: 'No', premium: 'Yes' },
    { module: 'Academic Analytics', starter: 'No', starterClass: 'text-on-surface-var/30', standard: 'Basic metrics', premium: 'AI performance forecasts' },
    { module: 'Data Migrations support', starter: 'Self-serve templates', standard: 'Assisted template upload', premium: 'Fully managed migrations' },
    { module: 'Support Channels', starter: 'Email support', standard: 'Email & phone support', premium: '24/7 account manager' }
];

const ADD_ONS = [
    { title: 'Hostel & Boarding Module', desc: 'Track hostel capacities, assign rooms, and bill boarding fees separately.', price: 'MK 20,000/term' },
    { title: 'School Transport Tracker', desc: 'Manage bus routes, track passenger lists, and calculate logistics bills.', price: 'MK 25,000/term' },
    { title: 'Library Catalog Management', desc: 'Log inventory, control book issuances, track returns, and calculate delay fines.', price: 'MK 15,000/term' }
];

const FAQS = [
    { q: "How are school subscriptions billed?", a: "We support monthly, termly, and annual billing cycle options. Termly billing is the most popular, aligning payment milestones directly with Malawian school calendars." },
    { q: "What constitutes the 30-day free trial?", a: "Every school gets full standard access for 30 days without inputting credit card or banking details. This allows your administration, teachers, and bursars to explore the tools." },
    { q: "Can we switch plans at any time?", a: "Yes, you can upgrade, downgrade, or change billing cycles directly inside your portal setup dashboard at the end of any billing period." },
    { q: "Who owns the data entered into the system?", a: "The school owns all data. We use automated backup systems, and you can export student rosters, ledger records, and exam results into spreadsheet format at any time." },
    { q: "Are training and system setup included?", a: "Yes. For standard and premium subscription plans, our Malawian implementation specialists provide system training webinars for school staff and onboarding resources completely free." }
];

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'termly' | 'annual'>('termly');
    const plansReveal = useReveal();
    const compareReveal = useReveal();
    const addonsReveal = useReveal();

    const getPriceText = (plan: PricingPlan) => {
        if (billingCycle === 'monthly') return plan.monthlyPrice;
        if (billingCycle === 'termly') return plan.termlyPrice;
        return plan.annualPrice;
    };

    return (
        <PublicSiteLayout activePage="PRICING">
            <Head>
                <title>Plans & Pricing — NextGen School Management System</title>
                <meta name="description" content="Transparent, scalable SaaS pricing plans for Malawian schools. Choose between monthly, termly, or annual billing options." />
            </Head>

            {/* ── Page Hero ── */}
            <div className="relative pt-48 pb-20 bg-ngms-navy overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/site/news-graduation.png" alt="" className="w-full h-full object-cover opacity-25" />
                    <div className="absolute inset-0 bg-gradient-to-br from-ngms-navy/95 to-ngms-teal/80" />
                </div>
                <div className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-16 text-white text-center">
                    <p className="font-label text-[11px] tracking-[0.22em] uppercase text-ngms-sky-light mb-3 flex items-center justify-center gap-2">
                        <span className="inline-block w-0.5 h-3.5 bg-ngms-gold rounded" />
                        Flexible Plans
                    </p>
                    <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight mb-5">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                        Scale NextGen to fit your school. Pay based on your billing preference, with special pricing termly structured for Malawian institutions.
                    </p>

                    {/* Toggle Button */}
                    <div className="mt-10 inline-flex items-center bg-white/5 border border-white/15 p-1 rounded-full backdrop-blur-sm">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-5 py-2 rounded-full font-label text-xs tracking-wider uppercase font-semibold transition-all ${
                                billingCycle === 'monthly' ? 'bg-ngms-gold text-ngms-navy' : 'text-white/80 hover:text-white'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('termly')}
                            className={`px-5 py-2 rounded-full font-label text-xs tracking-wider uppercase font-semibold transition-all ${
                                billingCycle === 'termly' ? 'bg-ngms-gold text-ngms-navy' : 'text-white/80 hover:text-white'
                            }`}
                        >
                            Termly
                        </button>
                        <button
                            onClick={() => setBillingCycle('annual')}
                            className={`px-5 py-2 rounded-full font-label text-xs tracking-wider uppercase font-semibold transition-all ${
                                billingCycle === 'annual' ? 'bg-ngms-gold text-ngms-navy' : 'text-white/80 hover:text-white'
                            }`}
                        >
                            Annual
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Plan Cards ── */}
            <section ref={plansReveal.ref} className="py-24 px-5 lg:px-16 max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {PLANS.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 24 }}
                            animate={plansReveal.inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.55, delay: i * 0.1 }}
                            className={`border rounded-xl p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative ${
                                plan.popular ? 'border-ngms-sky bg-surface-alt shadow-md' : 'border-surface-variant bg-white'
                            }`}
                        >
                            {plan.popular && (
                                <span className="absolute top-4 right-4 bg-ngms-sky text-white font-label text-[10px] tracking-widest uppercase px-3 py-1 rounded font-bold">
                                    MOST POPULAR
                                </span>
                            )}
                            <div>
                                <h3 className="font-serif text-2xl font-bold text-ngms-navy mb-2">{plan.name}</h3>
                                <p className="text-xs text-on-surface-var mb-6 leading-relaxed">{plan.description}</p>
                                
                                <div className="mb-8 flex items-baseline gap-1.5">
                                    <span className="font-serif text-4xl font-extrabold text-ngms-teal">
                                        {getPriceText(plan)}
                                    </span>
                                    <span className="text-xs text-on-surface-var/60">
                                        / {billingCycle === 'monthly' ? 'month' : billingCycle === 'termly' ? 'term' : 'year'}
                                    </span>
                                </div>

                                <ul className="space-y-4 border-t border-surface-variant/70 pt-6">
                                    {plan.features.map((feat) => (
                                        <li key={feat} className="flex items-start gap-2.5 text-xs text-on-surface-var/90">
                                            <span className="material-symbols-outlined text-ngms-teal text-base leading-none">check</span>
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8 pt-6 border-t border-surface-variant/50">
                                <Link
                                    href={route('register')}
                                    className={`block text-center font-label text-xs tracking-widest uppercase py-3.5 rounded-full font-bold transition-colors ${
                                        plan.popular
                                            ? 'bg-ngms-sky text-white hover:bg-ngms-navy'
                                            : 'bg-ngms-navy text-white hover:bg-ngms-blue'
                                    }`}
                                >
                                    {plan.ctaLabel}
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Feature Comparison Table ── */}
            <section ref={compareReveal.ref} className="py-24 px-5 lg:px-16 bg-surface-low border-t border-surface-variant">
                <div className="max-w-[960px] mx-auto">
                    <div className="text-center mb-16">
                        <p className="font-label text-xs tracking-[0.22em] uppercase text-ngms-blue mb-2">Detailed Matrix</p>
                        <h2 className="font-serif text-3xl font-bold text-ngms-navy">Feature Comparison</h2>
                    </div>

                    <div className="bg-white border border-surface-variant rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-surface-variant bg-surface-alt font-label text-xs tracking-wider uppercase text-ngms-navy">
                                    <th className="py-4 px-6 font-bold">Module / Feature</th>
                                    <th className="py-4 px-6 font-bold">Starter</th>
                                    <th className="py-4 px-6 font-bold">Standard</th>
                                    <th className="py-4 px-6 font-bold">Premium</th>
                                </tr>
                            </thead>
                            <tbody>
                                {COMPARISON_FEATURES.map((item, idx) => (
                                    <tr key={idx} className="border-b border-surface-variant/50 text-xs text-on-surface-var hover:bg-surface-low/30">
                                        <td className="py-4.5 px-6 font-semibold text-ngms-navy">{item.module}</td>
                                        <td className="py-4.5 px-6">{item.starter}</td>
                                        <td className="py-4.5 px-6">{item.standard}</td>
                                        <td className="py-4.5 px-6 font-semibold text-ngms-teal">{item.premium}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ── Add-ons Section ── */}
            <section ref={addonsReveal.ref} className="py-24 px-5 lg:px-16 max-w-[1280px] mx-auto">
                <div className="text-center mb-16">
                    <p className="font-label text-xs tracking-[0.22em] uppercase text-ngms-blue mb-2">Optional Modules</p>
                    <h2 className="font-serif text-3xl font-bold text-ngms-navy">System Add-Ons</h2>
                    <p className="text-on-surface-var text-xs mt-2">Priced separately as modules, you can activate them on any plan as your school operations scale.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {ADD_ONS.map((add, i) => (
                        <div key={i} className="border border-surface-variant p-6 hover:border-ngms-gold transition-colors duration-300 group">
                            <h3 className="font-sans text-sm font-bold text-ngms-navy group-hover:text-ngms-sky transition-colors">{add.title}</h3>
                            <p className="text-xs text-on-surface-var leading-relaxed mt-2 mb-4">{add.desc}</p>
                            <span className="font-serif text-sm font-bold text-ngms-teal block">{add.price}</span>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-xs text-on-surface-var">
                        Looking for a custom plan to support multiple school campuses or higher education colleges?{' '}
                        <a href="/site/contact" className="text-ngms-sky font-semibold hover:underline">Talk to our Sales Team</a>
                    </p>
                </div>
            </section>

            {/* ── FAQ Section ── */}
            <section className="py-24 px-5 lg:px-16 bg-surface-low border-t border-surface-variant">
                <div className="max-w-[800px] mx-auto">
                    <div className="text-center mb-16">
                        <p className="font-label text-xs tracking-[0.22em] uppercase text-ngms-blue mb-2">Billing Inquiries</p>
                        <h2 className="font-serif text-3xl font-bold text-ngms-navy">Pricing FAQs</h2>
                    </div>

                    <div className="space-y-6">
                        {FAQS.map((faq, i) => (
                            <div key={i} className="border-b border-surface-variant pb-6 last:border-0">
                                <h3 className="font-sans text-sm font-bold text-ngms-navy mb-2">{faq.q}</h3>
                                <p className="text-xs text-on-surface-var leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Final Trial CTA ── */}
            <section className="bg-ngms-navy py-20 px-5 lg:px-16 text-white text-center">
                <div className="max-w-[600px] mx-auto space-y-6">
                    <h2 className="font-serif text-3xl font-bold">Ready to Start Your Free Trial?</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Claim your school's unique sub-domain workspace and explore all automated tools for admissions, billing registers, and reports completely free for 30 days.
                    </p>
                    <div className="pt-2">
                        <Link
                            href={route('register')}
                            className="font-label text-xs tracking-widest uppercase bg-ngms-gold text-ngms-navy px-8 py-4 rounded-full hover:bg-white transition-colors font-bold"
                        >
                            Start Your 30-Day Free Trial
                        </Link>
                    </div>
                </div>
            </section>
        </PublicSiteLayout>
    );
}
