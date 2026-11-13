import type { PageProps } from '@/types';
import PublicSiteLayout from '@/Layouts/PublicSiteLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface School {
    id: number;
    name: string;
    slug: string;
    city?: string;
    country?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const HERO_SLIDES = [
    {
        label: '| THE COMPLETE SAAS PLATFORM',
        heading: 'THIS IS',
        accent: 'NEXT GEN.',
        sub: 'Transforming how Malawian schools manage admissions, academics, finances, and parent engagement — all in one secure cloud platform.',
        cta: 'Book a Demo',
        ctaHref: '/site/contact',
        bg: '/images/site/hero-students.png',
    },
    {
        label: '| BUILT FOR SCHOOLS IN MALAWI',
        heading: 'WE ARE',
        accent: 'DIGITAL.',
        sub: 'Real-time attendance, automated report cards, fee invoicing with Airtel Money, and live parent portals — go live in under a week.',
        cta: 'Start Free Trial',
        ctaHref: '/register',
        bg: '/images/site/welcome-students.png',
    },
];

const STATS = [
    { value: '50+', label: 'Partner Schools' },
    { value: '20,000+', label: 'Students Managed' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '< 7 Days', label: 'Avg. Setup Time' },
];

const PARTNER_LOGOS = [
    { name: 'Lilongwe Academy', icon: 'school' },
    { name: 'Chichiri Secondary', icon: 'account_balance' },
    { name: 'Kamuzu Academy', icon: 'castle' },
    { name: "St Andrew's International", icon: 'local_library' },
    { name: 'Blantyre CDSS', icon: 'apartment' },
    { name: 'Mzuzu University Prep', icon: 'science' },
    { name: 'Trinity Private School', icon: 'star' },
    { name: 'Nyika National Academy', icon: 'landscape' },
    { name: 'New Apostolic School', icon: 'church' },
    { name: 'Stella Maris College', icon: 'auto_awesome' },
];

const KEY_FEATURES = [
    { title: 'Attendance Tracking', desc: 'Real-time push alerts to parents, monthly analytics, and offline-resilient daily registers.', icon: 'fact_check' },
    { title: 'Finance & Invoicing', desc: 'Custom invoices, multi-currency support, Airtel Money / Mpamba integration, automated reconciliation.', icon: 'account_balance_wallet' },
    { title: 'Academics & Grading', desc: 'Digital gradebooks, standardized report cards, automated transcripts in one click.', icon: 'history_edu' },
    { title: 'Communication Hub', desc: 'SMS broadcasts, targeted announcements, and integrated email updates for parents and staff.', icon: 'forum' },
    { title: 'Parent & Student App', desc: 'Parents track grades, pay fees, view timetables, and download files from any device.', icon: 'smartphone' },
    { title: 'Staff & Payroll', desc: 'Manage assignments, monitor performance, and automate school staff administration.', icon: 'badge' },
    { title: 'Analytics & Reports', desc: 'Visual dashboards for academic results, financial collection tracking, and school statistics.', icon: 'analytics' },
    { title: 'Compliance & Audits', desc: 'Detailed change logs, role-based access controls, and administrative approval workflows.', icon: 'verified_user' },
];

const ONBOARDING_STEPS = [
    { step: '1', title: 'Start Your Trial', desc: "Create your account, pick your package, and claim your school's unique subdomain." },
    { step: '2', title: 'Import Existing Data', desc: 'Upload spreadsheets or request our free data migration service — students, staff, fees.' },
    { step: '3', title: 'Customize Settings', desc: 'Set up your academic calendar, define streams and departments, configure grading scales.' },
    { step: '4', title: 'Go Live', desc: 'Send login credentials to parents and teachers and begin managing operations digitally.' },
];

const TESTIMONIALS = [
    {
        quote: 'NGMS has completely revolutionized our administrative workflow. We reconciled termly fees in 2 days instead of 3 weeks, and paper usage dropped by 70%.',
        author: 'Mr. Hastings Msiska',
        title: 'Bursar & Administrator, Lilongwe Academy',
        initials: 'HM',
    },
    {
        quote: "Parents love the parent portal. They pay fees via Airtel Money and track their child's grades in real-time. It has built deep trust with our community.",
        author: 'Dr. Catherine Banda',
        title: 'Principal, Chichiri Secondary School',
        initials: 'CB',
    },
];

const FAQS = [
    { q: 'How long does it take to set up NGMS for our school?', a: 'Most schools are fully set up and live within 1 week. Our support team handles all data importing (student rosters, class configurations, historical balances) completely free of charge.' },
    { q: 'Does NGMS support local mobile payment options?', a: 'Yes! NGMS integrates directly with Airtel Money, TNM Mpamba, and local bank transfers, enabling automated reconciliation of fee collections.' },
    { q: 'What happens to our data if we cancel our subscription?', a: 'You retain full ownership of all data. Export all student profiles, financial ledgers, and academic results in Excel or PDF format at any point.' },
    { q: 'Is our school data secure?', a: 'Absolutely. NGMS uses AES-256 data encryption and isolates each school\'s database using standard multi-tenant secure isolation practices with regular automated cloud backups.' },
];

// ─── Scroll-reveal hook ────────────────────────────────────────────────────────
function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
    return { ref, inView };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Welcome({ auth, schools = [] }: PageProps<{ schools?: School[] }>) {
    const [slide, setSlide] = useState(0);
    const [faqOpen, setFaqOpen] = useState<number | null>(null);

    const statsReveal   = useReveal();
    const stannerReveal = useReveal();
    const featuresReveal = useReveal();
    const onboardingReveal = useReveal();
    const pricingReveal = useReveal();
    const faqReveal     = useReveal();

    const current = HERO_SLIDES[slide];

    return (
        <PublicSiteLayout activePage="HOME" heroTransparent>
            <Head>
                <title>NextGen School Management System — The Complete SaaS Platform for Malawi</title>
                <meta name="description" content="NextGen School Management System (NGMS) unifies admissions, academics, attendance, finance, and parent portals into one online SaaS platform built for schools in Malawi." />
            </Head>

            {/* ══════════════════════════════════════════════════════════
                1. HERO — Full screen, text anchored bottom-left
            ══════════════════════════════════════════════════════════ */}
            <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-ngms-navy">
                {/* Background layers */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.9 }}
                        className="absolute inset-0"
                    >
                        <video
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                            autoPlay muted loop playsInline
                            poster={current.bg}
                        >
                            <source src="/videos/hero.mp4" type="video/mp4" />
                        </video>
                        <img
                            src={current.bg}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                            style={{ zIndex: -1 }}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Gradient vignettes — clear center, dark top and bottom, and left readability overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-ngms-navy/95 via-transparent to-ngms-navy z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-ngms-navy/80 via-transparent to-transparent z-10" />

                {/* ── Text block — bottom-left, Molloy-style ── */}
                <div className="absolute bottom-0 left-0 right-0 z-20 pb-16 lg:pb-20 px-5 lg:px-16 max-w-[1440px] mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slide}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.7 }}
                            className="max-w-3xl"
                        >
                            {/* Small italic label with left pipe — exactly like Molloy */}
                            <p className="font-label text-[11px] tracking-[0.3em] uppercase text-white/60 mb-3 italic">
                                {current.label}
                            </p>

                            {/* Big bold heading */}
                            <h1 className="font-sans font-black text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-white mb-5">
                                {current.heading}{' '}
                                <span className="text-ngms-sky-light">{current.accent}</span>
                            </h1>

                            <p className="text-white/65 text-base max-w-xl leading-relaxed mb-8">
                                {current.sub}
                            </p>

                            {/* CTA button — white outlined pill, Molloy style */}
                            <Link
                                href={current.ctaHref}
                                className="inline-flex items-center gap-2 font-label text-[12px] tracking-[0.22em] uppercase border-2 border-white text-white px-8 py-3.5 rounded-none font-bold hover:bg-white hover:text-ngms-navy transition-all duration-300"
                            >
                                {current.cta}
                            </Link>
                        </motion.div>
                    </AnimatePresence>

                    {/* Slide nav arrows — bottom right, Molloy carousel style */}
                    <div className="absolute bottom-16 lg:bottom-20 right-5 lg:right-16 flex items-center gap-2">
                        <button
                            onClick={() => setSlide((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                            className="w-9 h-9 rounded-full border border-white/40 text-white/60 hover:bg-white hover:text-ngms-navy flex items-center justify-center transition-all duration-200"
                            aria-label="Previous slide"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        <button
                            onClick={() => setSlide((slide + 1) % HERO_SLIDES.length)}
                            className="w-9 h-9 rounded-full border border-white/40 text-white/60 hover:bg-white hover:text-ngms-navy flex items-center justify-center transition-all duration-200"
                            aria-label="Next slide"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                2. "I AM a NGMS School" — Molloy "I AM a Stanner" style
                Two columns: framed photo + banner LEFT | text RIGHT
            ══════════════════════════════════════════════════════════ */}
            <section ref={stannerReveal.ref} className="bg-white py-20 px-5 lg:px-16 overflow-hidden">
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* LEFT — Photo frame with banner strip (Molloy "I [M] a Stanner") */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={stannerReveal.inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Blue background block offset — Molloy signature design */}
                        <div className="absolute -left-5 -bottom-5 w-[88%] h-[88%] bg-ngms-sky/10 rounded-sm z-0" />

                        {/* Image */}
                        <div className="relative z-10 overflow-hidden">
                            {/* Banner strip on top of image — "I [logo] a NGMS School" */}
                            <div className="flex items-center gap-3 bg-ngms-sky px-5 py-3">
                                <span className="font-sans text-white font-bold text-lg italic">I</span>
                                <div className="flex items-center gap-1 bg-white/20 rounded px-2 py-0.5">
                                    <span className="material-symbols-outlined text-white text-base">school</span>
                                    <span className="font-label text-[10px] tracking-widest text-white font-bold uppercase">NGMS</span>
                                </div>
                                <span className="font-sans text-white font-bold text-lg italic">a Digital School</span>
                            </div>
                            <img
                                src="/images/site/welcome-students.png"
                                alt="NGMS school students and teachers"
                                className="w-full h-auto object-cover"
                                style={{ maxHeight: '420px', objectFit: 'cover', objectPosition: 'top' }}
                            />
                        </div>
                    </motion.div>

                    {/* RIGHT — Welcome text, heading, description */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={stannerReveal.inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="space-y-6"
                    >
                        {/* Small label with left border — Molloy style */}
                        <p className="flex items-center gap-3 font-label text-[10px] tracking-[0.28em] uppercase text-ngms-teal font-semibold">
                            <span className="block w-0.5 h-4 bg-ngms-teal" />
                            Welcome to NGMS
                        </p>

                        {/* Heading — "I AM a Digital School Manager" */}
                        <h2 className="font-sans font-black text-4xl lg:text-5xl text-ngms-navy leading-tight">
                            I AM a{' '}
                            <span className="text-ngms-sky">Game Changer.</span>
                        </h2>

                        <p className="text-on-surface-var leading-relaxed max-w-md">
                            NextGen School Management System is a cloud-based SaaS platform that empowers administrators, teachers, and parents across Malawi. NGMS has rigorous automation, real-time financial controls, and digital engagement tools — built for the modern African school. It's where technology meets education, and smart management sets you on the path to excellence.
                        </p>

                        <div className="flex items-center gap-4 pt-2">
                            <Link
                                href="/site/features"
                                className="inline-flex items-center gap-2 font-label text-[11px] tracking-[0.2em] uppercase border-2 border-ngms-navy text-ngms-navy px-7 py-3 font-bold hover:bg-ngms-navy hover:text-white transition-all duration-300"
                            >
                                Learn More
                            </Link>
                            <Link
                                href="/site/contact"
                                className="font-label text-[11px] tracking-[0.18em] uppercase text-ngms-sky font-bold hover:text-ngms-navy transition-colors flex items-center gap-1"
                            >
                                Book a Demo
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>

                        {/* Carousel dots */}
                        <div className="flex items-center gap-2 pt-2">
                            {[0, 1].map(i => (
                                <button
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${i === 0 ? 'bg-ngms-teal scale-125' : 'bg-surface-variant'}`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                3. BY THE NUMBERS — Molloy "Learn About Molloy / By The Numbers"
                Two columns: large image LEFT | stats grid RIGHT
            ══════════════════════════════════════════════════════════ */}
            <section ref={statsReveal.ref} className="bg-surface-low py-20 px-5 lg:px-16 border-y border-surface-variant">
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* LEFT — Large image */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={statsReveal.inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="relative overflow-hidden shadow-xl"
                    >
                        <img
                            src="/images/site/news-academics.png"
                            alt="NGMS Dashboard Overview"
                            className="w-full h-auto object-cover"
                            style={{ maxHeight: '440px', objectFit: 'cover' }}
                        />
                    </motion.div>

                    {/* RIGHT — Label + Heading + 2×2 Stat Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={statsReveal.inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="space-y-8"
                    >
                        <div>
                            <p className="flex items-center gap-3 font-label text-[10px] tracking-[0.28em] uppercase text-ngms-teal font-semibold mb-2">
                                <span className="block w-0.5 h-4 bg-ngms-teal" />
                                Learn About NGMS
                            </p>
                            <h2 className="font-sans font-black text-4xl lg:text-5xl text-ngms-navy uppercase tracking-tight">
                                By The Numbers
                            </h2>
                        </div>

                        {/* 2×2 stat grid — Molloy style with dividers */}
                        <div className="grid grid-cols-2 border border-surface-variant">
                            {STATS.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={statsReveal.inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                                    className={`p-8 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b' : ''} border-surface-variant hover:bg-ngms-navy hover:text-white transition-all duration-300 group`}
                                >
                                    <span className="block font-sans font-black text-4xl lg:text-5xl text-ngms-teal group-hover:text-ngms-sky-light transition-colors mb-1">
                                        {stat.value}
                                    </span>
                                    <span className="block font-label text-[10px] tracking-widest uppercase text-on-surface-var group-hover:text-white/60 transition-colors">
                                        {stat.label}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Carousel arrows — Molloy-style */}
                        <div className="flex items-center gap-2">
                            <button className="w-8 h-8 rounded-full border border-ngms-navy/30 text-ngms-navy/50 hover:bg-ngms-navy hover:text-white flex items-center justify-center transition-all duration-200" aria-label="Previous">
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <button className="w-8 h-8 rounded-full border border-ngms-navy/30 text-ngms-navy/50 hover:bg-ngms-navy hover:text-white flex items-center justify-center transition-all duration-200" aria-label="Next">
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                4. TRUSTED BY — "COLLEGE BOUND" style scrolling logos
            ══════════════════════════════════════════════════════════ */}
            <section className="bg-white py-16 px-5 overflow-hidden">
                <h2 className="text-center font-sans font-black text-3xl lg:text-4xl uppercase tracking-tight text-ngms-navy mb-10">
                    Trusted By Schools
                </h2>

                {/* Scrolling logo strip */}
                <div className="relative overflow-hidden">
                    {/* Left/right fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                    <div className="animate-marquee">
                        {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center justify-center gap-2 px-10 shrink-0 group cursor-default"
                                style={{ minWidth: '160px' }}
                            >
                                {/* Logo circle — Molloy-style institution logo stand-in */}
                                <div className="w-16 h-16 rounded-full border-2 border-surface-variant flex items-center justify-center bg-surface-alt group-hover:border-ngms-sky group-hover:bg-ngms-sky/5 transition-all duration-300">
                                    <span className="material-symbols-outlined text-2xl text-ngms-teal/60 group-hover:text-ngms-sky transition-colors">
                                        {logo.icon}
                                    </span>
                                </div>
                                <span className="font-label text-[9px] tracking-widest uppercase text-on-surface-var/50 group-hover:text-ngms-navy text-center transition-colors whitespace-nowrap">
                                    {logo.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                5. KEY FEATURES OVERVIEW
            ══════════════════════════════════════════════════════════ */}
            <section ref={featuresReveal.ref} className="py-24 px-5 lg:px-16 bg-surface-low border-t border-surface-variant">
                <div className="max-w-[1280px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={featuresReveal.inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="mb-14"
                    >
                        <p className="flex items-center gap-3 font-label text-[10px] tracking-[0.28em] uppercase text-ngms-teal font-semibold mb-3">
                            <span className="block w-0.5 h-4 bg-ngms-teal" />
                            Features Spotlight
                        </p>
                        <h2 className="font-sans font-black text-4xl lg:text-5xl uppercase tracking-tight text-ngms-navy max-w-xl">
                            Built for Every Aspect of Your School
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {KEY_FEATURES.map((feat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={featuresReveal.inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: i * 0.06 }}
                                className="bg-white border border-surface-variant p-6 hover:border-ngms-sky hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="w-10 h-10 bg-ngms-sky/10 text-ngms-sky flex items-center justify-center mb-4 group-hover:bg-ngms-sky group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-xl">{feat.icon}</span>
                                </div>
                                <h3 className="font-sans text-sm font-bold text-ngms-navy mb-2 group-hover:text-ngms-sky transition-colors">
                                    {feat.title}
                                </h3>
                                <p className="text-xs text-on-surface-var/80 leading-relaxed">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                6. HOW IT WORKS
            ══════════════════════════════════════════════════════════ */}
            <section ref={onboardingReveal.ref} className="py-24 px-5 lg:px-16 bg-ngms-navy text-white">
                <div className="max-w-[1280px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={onboardingReveal.inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="mb-14"
                    >
                        <p className="flex items-center gap-3 font-label text-[10px] tracking-[0.28em] uppercase text-ngms-sky-light font-semibold mb-3">
                            <span className="block w-0.5 h-4 bg-ngms-sky-light" />
                            Onboarding Roadmap
                        </p>
                        <h2 className="font-sans font-black text-4xl lg:text-5xl uppercase tracking-tight text-white max-w-xl">
                            Getting Started is Simple &amp; Fast
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
                        {ONBOARDING_STEPS.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={onboardingReveal.inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-ngms-navy p-8 relative overflow-hidden hover:bg-ngms-navy-mid transition-colors duration-300 group"
                            >
                                <span className="absolute right-4 top-4 text-7xl font-sans font-black text-white/[0.04]">
                                    {step.step}
                                </span>
                                <div className="w-10 h-10 rounded-full bg-ngms-sky/20 text-ngms-sky-light flex items-center justify-center font-bold text-base mb-5 group-hover:bg-ngms-sky group-hover:text-white transition-all duration-300">
                                    {step.step}
                                </div>
                                <h3 className="font-sans text-sm font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-xs text-white/50 leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-10">
                        <Link
                            href="/site/onboarding"
                            className="inline-flex items-center gap-2 font-label text-[11px] tracking-[0.2em] uppercase border-2 border-white/40 text-white px-7 py-3.5 font-bold hover:bg-white hover:text-ngms-navy transition-all duration-300"
                        >
                            Explore Onboarding Support
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                7. TESTIMONIALS
            ══════════════════════════════════════════════════════════ */}
            <section className="py-24 px-5 lg:px-16 bg-white border-b border-surface-variant">
                <div className="max-w-[1280px] mx-auto">
                    <div className="mb-12">
                        <p className="flex items-center gap-3 font-label text-[10px] tracking-[0.28em] uppercase text-ngms-teal font-semibold mb-3">
                            <span className="block w-0.5 h-4 bg-ngms-teal" />
                            School Testimonials
                        </p>
                        <h2 className="font-sans font-black text-4xl lg:text-5xl uppercase tracking-tight text-ngms-navy">
                            Loved by Head Teachers &amp; Bursars
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="border border-surface-variant p-8 relative flex flex-col justify-between hover:border-ngms-sky hover:shadow-md transition-all duration-300">
                                <span className="material-symbols-outlined text-5xl text-ngms-sky/15 mb-4">format_quote</span>
                                <p className="text-sm leading-relaxed text-on-surface-var/90 italic mb-6">
                                    &ldquo;{t.quote}&rdquo;
                                </p>
                                <div className="flex items-center gap-4 border-t border-surface-variant pt-5">
                                    <div className="w-10 h-10 bg-ngms-teal text-white flex items-center justify-center font-bold text-sm font-sans">
                                        {t.initials}
                                    </div>
                                    <div>
                                        <h4 className="font-sans text-sm font-bold text-ngms-navy">{t.author}</h4>
                                        <p className="text-xs text-on-surface-var">{t.title}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                8. PRICING TEASER
            ══════════════════════════════════════════════════════════ */}
            <section ref={pricingReveal.ref} className="py-24 px-5 lg:px-16 bg-surface-low border-b border-surface-variant">
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={pricingReveal.inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-5 space-y-5"
                    >
                        <p className="flex items-center gap-3 font-label text-[10px] tracking-[0.28em] uppercase text-ngms-teal font-semibold">
                            <span className="block w-0.5 h-4 bg-ngms-teal" />
                            Flexible Pricing
                        </p>
                        <h2 className="font-sans font-black text-4xl lg:text-5xl uppercase tracking-tight text-ngms-navy">
                            Pricing that Scales with Your School
                        </h2>
                        <p className="text-on-surface-var leading-relaxed">
                            No hidden contracts or setup fees. Pay only for what your school uses, with convenient termly options structured around school sizes.
                        </p>
                        <Link
                            href="/site/pricing"
                            className="inline-flex items-center gap-2 font-label text-[11px] tracking-[0.2em] uppercase border-2 border-ngms-navy text-ngms-navy px-7 py-3.5 font-bold hover:bg-ngms-navy hover:text-white transition-all duration-300"
                        >
                            View Pricing Plans
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </motion.div>

                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-px bg-surface-variant">
                        <div className="bg-white p-8 hover:bg-ngms-navy hover:text-white transition-all duration-300 group">
                            <span className="font-label text-[9px] tracking-widest text-on-surface-var/50 uppercase block mb-2 group-hover:text-white/50">Starter Tier</span>
                            <h3 className="font-sans text-base font-bold text-ngms-navy mb-2 group-hover:text-white">Ideal for Small Schools</h3>
                            <p className="text-xs text-on-surface-var leading-relaxed mb-6 group-hover:text-white/60">Core modules — admissions, attendance, and basic grading.</p>
                            <span className="font-sans font-black text-3xl text-ngms-teal block group-hover:text-ngms-sky-light">MK 75,000</span>
                            <span className="text-[10px] text-on-surface-var/50 group-hover:text-white/40">per Term</span>
                        </div>
                        <div className="bg-ngms-navy p-8 relative">
                            <span className="absolute top-3 right-3 bg-ngms-gold text-ngms-navy font-label text-[8px] tracking-widest uppercase px-2 py-0.5 font-bold">Most Popular</span>
                            <span className="font-label text-[9px] tracking-widest text-ngms-sky-light uppercase block mb-2">Standard Tier</span>
                            <h3 className="font-sans text-base font-bold text-white mb-2">For Growing Schools</h3>
                            <p className="text-xs text-white/50 leading-relaxed mb-6">Finance &amp; mobile invoices, SMS broadcasts, and Parent portals.</p>
                            <span className="font-sans font-black text-3xl text-ngms-sky-light block">MK 150,000</span>
                            <span className="text-[10px] text-white/40">per Term</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                9. FAQ SNIPPET
            ══════════════════════════════════════════════════════════ */}
            <section ref={faqReveal.ref} className="py-24 px-5 lg:px-16 bg-white">
                <div className="max-w-[900px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={faqReveal.inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <p className="flex items-center gap-3 font-label text-[10px] tracking-[0.28em] uppercase text-ngms-teal font-semibold mb-3">
                            <span className="block w-0.5 h-4 bg-ngms-teal" />
                            Common Inquiries
                        </p>
                        <h2 className="font-sans font-black text-4xl lg:text-5xl uppercase tracking-tight text-ngms-navy">
                            Frequently Asked Questions
                        </h2>
                    </motion.div>

                    <div className="divide-y divide-surface-variant border-y border-surface-variant">
                        {FAQS.map((faq, idx) => (
                            <div key={idx}>
                                <button
                                    onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                                    className="w-full text-left px-0 py-5 flex justify-between items-center hover:text-ngms-sky transition-colors duration-150 group"
                                >
                                    <span className="font-sans text-sm font-bold text-ngms-navy group-hover:text-ngms-sky transition-colors pr-4">
                                        {faq.q}
                                    </span>
                                    <span className="material-symbols-outlined text-on-surface-var select-none shrink-0">
                                        {faqOpen === idx ? 'remove' : 'add'}
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {faqOpen === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pb-5 text-sm text-on-surface-var leading-relaxed max-w-2xl">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                10. FINAL CTA BANNER
            ══════════════════════════════════════════════════════════ */}
            <section className="bg-ngms-navy py-24 px-5 lg:px-16 text-white text-center">
                <div className="max-w-[800px] mx-auto space-y-6">
                    <p className="font-label text-[10px] tracking-[0.3em] uppercase text-ngms-sky-light">
                        | Ready to Transform Your School?
                    </p>
                    <h2 className="font-sans font-black text-4xl lg:text-6xl uppercase tracking-tight">
                        Let's Get Started.
                    </h2>
                    <p className="text-white/55 text-sm leading-relaxed max-w-lg mx-auto">
                        Get started with your free 30-day trial today, or book a live demo callback with one of our Malawian school management representatives.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <Link
                            href={route('register')}
                            className="font-label text-[11px] tracking-[0.22em] uppercase bg-ngms-gold text-ngms-navy px-10 py-4 font-bold hover:bg-white transition-all duration-300 hover:scale-105"
                        >
                            Start Your Free Trial
                        </Link>
                        <Link
                            href="/site/contact"
                            className="font-label text-[11px] tracking-[0.22em] uppercase border-2 border-white/40 text-white px-10 py-4 font-bold hover:bg-white hover:text-ngms-navy transition-all duration-300 hover:scale-105"
                        >
                            Book a Callback
                        </Link>
                    </div>
                </div>
            </section>
        </PublicSiteLayout>
    );
}
