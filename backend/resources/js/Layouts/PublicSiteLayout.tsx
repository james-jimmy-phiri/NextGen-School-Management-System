import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

// ─── Navigation Data ──────────────────────────────────────────────────────────
interface MegaMenuData {
    ctaLabel: string;
    ctaHref: string;
    image: string;
    imageAlt: string;
    links: { label: string; href: string }[][];
}

interface NavItem {
    label: string;
    href: string;
    megaMenu?: MegaMenuData;
}

const NAV_ITEMS: NavItem[] = [
    {
        label: 'PRODUCT',
        href: '/site/features',
        megaMenu: {
            ctaLabel: 'EXPLORE MODULES',
            ctaHref: '/site/features',
            image: '/images/site/news-academics.png',
            imageAlt: 'Product Features',
            links: [
                [
                    { label: 'Academics & Exams', href: '/site/features' },
                    { label: 'Admissions & Enrollment', href: '/site/onboarding' },
                    { label: 'Student Information (SIS)', href: '/site/solutions' },
                ],
                [
                    { label: 'Finance & Payments', href: '/site/pricing' },
                    { label: 'Administrative Setup', href: '/site/compare' },
                    { label: 'News & Communication', href: '/site/support' },
                ],
            ],
        },
    },
    {
        label: 'SOLUTIONS',
        href: '/site/solutions',
        megaMenu: {
            ctaLabel: 'FIND YOUR SOLUTION',
            ctaHref: '/site/solutions',
            image: '/images/site/welcome-students.png',
            imageAlt: 'SaaS Solutions',
            links: [
                [
                    { label: 'Primary Schools', href: '/site/solutions#primary' },
                    { label: 'Secondary / High Schools', href: '/site/solutions#secondary' },
                    { label: 'Private Academies', href: '/site/solutions#private' },
                ],
                [
                    { label: 'Higher Ed Colleges', href: '/site/solutions#colleges' },
                    { label: 'Faith-based Schools', href: '/site/solutions#faith' },
                    { label: 'Multi-School Districts', href: '/site/solutions#districts' },
                ],
            ],
        },
    },
    {
        label: 'PRICING',
        href: '/site/pricing',
        megaMenu: {
            ctaLabel: 'VIEW PLANS',
            ctaHref: '/site/pricing',
            image: '/images/site/news-graduation.png',
            imageAlt: 'Pricing Plans',
            links: [
                [
                    { label: 'Subscription Plans', href: '/site/pricing' },
                    { label: 'Feature Matrix', href: '/site/pricing#compare' },
                ],
                [
                    { label: 'Custom Quotes', href: '/site/contact' },
                    { label: 'Billing FAQs', href: '/site/pricing#faq' },
                ],
            ],
        },
    },
    {
        label: 'HOW IT WORKS',
        href: '/site/onboarding',
        megaMenu: {
            ctaLabel: 'SEE ONBOARDING',
            ctaHref: '/site/onboarding',
            image: '/images/site/welcome-students.png',
            imageAlt: 'Onboarding Process',
            links: [
                [
                    { label: 'Onboarding Steps', href: '/site/onboarding' },
                    { label: 'Data Migration', href: '/site/onboarding#migration' },
                ],
                [
                    { label: 'Security & Compliance', href: '/site/security' },
                    { label: 'NGMS vs Alternatives', href: '/site/compare' },
                ],
            ],
        },
    },
    {
        label: 'ABOUT US',
        href: '/about',
        megaMenu: {
            ctaLabel: 'MEET THE TEAM',
            ctaHref: '/about',
            image: '/images/site/welcome-students.png',
            imageAlt: 'About Us',
            links: [
                [
                    { label: 'Our Story', href: '/about' },
                    { label: 'Mission & Values', href: '/about#mission' },
                ],
                [
                    { label: 'Milestones & Timeline', href: '/about#history' },
                    { label: 'Leadership Team', href: '/about#leadership' },
                ],
            ],
        },
    },
    {
        label: 'SUPPORT',
        href: '/site/support',
        megaMenu: {
            ctaLabel: 'GET HELP',
            ctaHref: '/site/support',
            image: '/images/site/news-academics.png',
            imageAlt: 'Support Center',
            links: [
                [
                    { label: 'Help Center & FAQs', href: '/site/support' },
                    { label: 'Video Tutorials', href: '/site/support#tutorials' },
                ],
                [
                    { label: 'System Status', href: '/site/support#status' },
                    { label: 'Contact Support', href: '/site/contact' },
                ],
            ],
        },
    },
];

// ─── Mega Menu Component ───────────────────────────────────────────────────────
function MegaMenu({ data }: { data: MegaMenuData }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="w-[900px] bg-ngms-teal text-white shadow-2xl flex overflow-hidden rounded-b"
        >
            {/* Image Panel */}
            <div className="w-[32%] relative min-h-[300px] overflow-hidden bg-ngms-navy">
                <img
                    src={data.image}
                    alt={data.imageAlt}
                    className="w-full h-full object-cover opacity-80 hover:opacity-95 transition-opacity duration-300"
                />
                <a
                    href={data.ctaHref}
                    className="absolute bottom-0 left-0 right-0 bg-ngms-sky-fixed/90 hover:bg-white text-ngms-teal px-5 py-4 flex items-center justify-between font-label font-bold text-xs tracking-widest uppercase transition-colors duration-200"
                >
                    {data.ctaLabel}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
            </div>
            {/* Links Panel */}
            <div className="flex-1 p-8 grid grid-cols-2 gap-x-10 content-start">
                {data.links.map((col, ci) => (
                    <div key={ci} className="flex flex-col">
                        {col.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="py-3 border-b border-white/10 text-[14.5px] font-semibold text-white/90 hover:text-ngms-sky-light hover:pl-1 transition-all duration-150"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// ─── Main Public Site Layout ───────────────────────────────────────────────────
interface PublicSiteLayoutProps extends PropsWithChildren {
    activePage?: string;
    heroTransparent?: boolean;
}

export default function PublicSiteLayout({
    children,
    activePage,
    heroTransparent = false,
}: PublicSiteLayoutProps) {
    const [scrolled, setScrolled] = useState(!heroTransparent);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
    const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!heroTransparent) return;
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [heroTransparent]);

    const handleMenuEnter = (label: string) => {
        if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
        setOpenMenu(label);
    };

    const handleMenuLeave = () => {
        menuTimeoutRef.current = setTimeout(() => setOpenMenu(null), 180);
    };

    return (
        <div className="min-h-screen bg-surface font-sans text-on-surface antialiased">
            {/* ═══════════════════════════════════════════
                HEADER
            ═══════════════════════════════════════════ */}
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-ngms-navy shadow-[0_2px_24px_rgba(0,0,0,0.2)]'
                        : 'bg-gradient-to-b from-ngms-navy/90 to-transparent'
                }`}
            >
                <div className="max-w-[1440px] mx-auto px-5 lg:px-16">
                    {/* ── Utility Bar ── */}
                    <div className="flex justify-end items-center gap-5 pt-2.5 pb-1.5 text-white/80">
                        <a href="#" className="flex items-center gap-1 font-label text-[10px] tracking-widest uppercase font-medium hover:text-ngms-sky-light transition-colors">
                            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>hive</span>
                            THE PORTAL
                        </a>
                        <span className="w-px h-3.5 bg-white/20" />
                        <a href="#" className="font-label text-[10px] tracking-widest uppercase font-medium hover:text-ngms-sky-light transition-colors">CALENDARS</a>
                        <a href="#" className="font-label text-[10px] tracking-widest uppercase font-medium hover:text-ngms-sky-light transition-colors">STUDENTS</a>
                        <a href="#" className="font-label text-[10px] tracking-widest uppercase font-medium hover:text-ngms-sky-light transition-colors">PARENTS</a>
                        <a href="#" className="font-label text-[10px] tracking-widest uppercase font-medium hover:text-ngms-sky-light transition-colors">ALUMNI</a>
                        <button className="hover:text-ngms-sky-light transition-colors" aria-label="Search">
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>search</span>
                        </button>
                        <a href="/site/support" className="bg-ngms-sky-light text-ngms-teal px-4 py-1 rounded-full font-label text-[10px] tracking-widest uppercase font-bold hover:bg-white transition-colors">
                            SUPPORT
                        </a>
                        <a href={route('login')} className="bg-ngms-gold text-ngms-navy px-4 py-1 rounded-full font-label text-[10px] tracking-widest uppercase font-bold hover:bg-ngms-gold-dim transition-colors">
                            PORTAL LOGIN
                        </a>
                    </div>

                    {/* ── Main Nav Bar ── */}
                    <div className="flex items-center justify-between pb-3 relative">
                        {/* Logo */}
                        <a href="/" className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity shrink-0">
                            <div className="w-11 h-14 border border-white/40 rounded-b-lg flex flex-col items-center justify-center gap-0.5">
                                <span className="font-serif text-xl font-bold leading-none">N</span>
                                <span className="font-sans text-[7px] border-t border-white/40 pt-0.5 tracking-wider opacity-70">2024</span>
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="font-label text-[9px] tracking-[0.22em] uppercase opacity-75">NextGen</span>
                                <span className="font-serif text-[26px] font-bold leading-none tracking-tight">NGMS</span>
                                <span className="font-label text-[8px] tracking-[0.18em] uppercase opacity-75 mt-0.5">School Management</span>
                            </div>
                        </a>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-5 relative" aria-label="Main navigation">
                            {NAV_ITEMS.map((item) => (
                                <div
                                    key={item.label}
                                    onMouseEnter={() => item.megaMenu && handleMenuEnter(item.label)}
                                    onMouseLeave={handleMenuLeave}
                                    className="relative"
                                >
                                    <a
                                        href={item.href}
                                        className={`px-4 py-2 font-label text-[15px] tracking-[0.12em] uppercase font-semibold transition-colors duration-150 border-b-2 inline-block ${
                                            activePage === item.label
                                                ? 'text-ngms-sky-light border-ngms-sky-light'
                                                : 'text-white/90 border-transparent hover:text-ngms-sky-light hover:border-ngms-sky-light'
                                        }`}
                                    >
                                        {item.label}
                                    </a>
                                </div>
                            ))}
                            {/* Mega menu rendered once, outside individual items to avoid overflow */}
                            <AnimatePresence>
                                {openMenu && NAV_ITEMS.find(i => i.label === openMenu)?.megaMenu && (
                                    <div
                                        onMouseEnter={() => openMenu && handleMenuEnter(openMenu)}
                                        onMouseLeave={handleMenuLeave}
                                        className="absolute top-full right-0 z-50"
                                        style={{ pointerEvents: 'auto' }}
                                    >
                                        <MegaMenu data={NAV_ITEMS.find(i => i.label === openMenu)!.megaMenu!} />
                                    </div>
                                )}
                            </AnimatePresence>
                        </nav>

                        {/* Hamburger */}
                        <button
                            className="lg:hidden flex flex-col gap-1.5 p-1.5 text-white"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle navigation"
                            aria-expanded={mobileOpen}
                        >
                            <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
                            <span className={`block w-6 h-0.5 bg-white transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
                            <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
                        </button>
                    </div>

                    {/* ── Mobile Nav ── */}
                    <AnimatePresence>
                        {mobileOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="lg:hidden overflow-hidden bg-ngms-navy border-t border-white/10"
                            >
                                {NAV_ITEMS.map((item) => (
                                    <div key={item.label} className="border-b border-white/8">
                                        <div className="flex items-center justify-between">
                                            <a
                                                href={item.href}
                                                className="flex-1 px-5 py-3.5 font-label text-[13px] tracking-widest uppercase text-white/90 hover:text-ngms-sky-light transition-colors"
                                            >
                                                {item.label}
                                            </a>
                                            {item.megaMenu && (
                                                <button
                                                    className="px-4 py-3.5 text-white/60"
                                                    onClick={() =>
                                                        setMobileSubOpen(mobileSubOpen === item.label ? null : item.label)
                                                    }
                                                >
                                                    <span className="material-symbols-outlined text-sm">
                                                        {mobileSubOpen === item.label ? 'expand_less' : 'expand_more'}
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                        <AnimatePresence>
                                            {mobileSubOpen === item.label && item.megaMenu && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-black/20"
                                                >
                                                    {item.megaMenu.links.flat().map((link) => (
                                                        <a
                                                            key={link.href}
                                                            href={link.href}
                                                            className="block px-8 py-2.5 text-sm text-white/70 hover:text-ngms-sky-light border-b border-white/5 transition-colors"
                                                        >
                                                            {link.label}
                                                        </a>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                                <div className="p-4 flex flex-col gap-2">
                                    <a href="/site/support" className="text-center bg-ngms-sky-light text-ngms-teal py-2.5 rounded-full font-label text-xs tracking-widest uppercase font-bold">SUPPORT</a>
                                    <a href={route('login')} className="text-center bg-ngms-gold text-ngms-navy py-2.5 rounded-full font-label text-xs tracking-widest uppercase font-bold">PORTAL LOGIN</a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* ═══════════════════════════════════════════
                PAGE CONTENT
            ═══════════════════════════════════════════ */}
            <main>{children}</main>

            {/* ═══════════════════════════════════════════
                FOOTER
            ═══════════════════════════════════════════ */}
            <footer className="bg-ngms-navy text-white border-t border-ngms-navy-mid">
                <div className="max-w-[1280px] mx-auto px-5 lg:px-16 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-ngms-gold text-3xl">school</span>
                                <span className="font-serif text-xl font-bold text-ngms-gold">NGMS</span>
                            </div>
                            <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-[220px]">
                                NextGen School Management System — empowering Africa's future leaders with world-class education.
                            </p>
                            <div className="flex gap-3">
                                {[
                                    { icon: 'language', label: 'Website' },
                                    { icon: 'work', label: 'LinkedIn' },
                                    { icon: 'forum', label: 'Twitter' },
                                ].map(({ icon, label }) => (
                                    <a
                                        key={icon}
                                        href="#"
                                        aria-label={label}
                                        className="w-9 h-9 border border-white/15 rounded-full flex items-center justify-center text-ngms-gold hover:bg-ngms-gold hover:text-ngms-navy hover:border-ngms-gold transition-all duration-200"
                                    >
                                        <span className="material-symbols-outlined text-base">{icon}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-label text-[11px] tracking-[0.18em] uppercase text-ngms-sky-light mb-5 pb-2.5 border-b border-white/8">
                                Contact
                            </h4>
                            <address className="not-italic text-sm text-white/50 leading-relaxed mb-3">
                                NextGen School Management System<br />
                                123 Education Avenue<br />
                                Lilongwe, Malawi
                            </address>
                            <p className="text-[10px] font-label tracking-wider uppercase text-white/30 mb-1">General Office Hours:</p>
                            <p className="text-sm text-white/50 mb-2">Mon – Fri: 7:30 am – 3:30 pm</p>
                            <p className="text-sm text-white/50">Phone: +265 1 234 567</p>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="font-label text-[11px] tracking-[0.18em] uppercase text-ngms-sky-light mb-5 pb-2.5 border-b border-white/8">
                                Resources
                            </h4>
                            {[
                                { label: 'Contact Us', href: '/site/contact' },
                                { label: 'Privacy Policy', href: '#' },
                                { label: 'Terms of Service', href: '#' },
                                { label: 'Web Accessibility', href: '#' },
                                { label: 'Sitemap', href: '#' },
                            ].map(({ label, href }) => (
                                <a key={label} href={href} className="block text-[13px] text-white/45 hover:text-ngms-gold hover:pl-1 transition-all duration-150 mb-2.5">
                                    {label}
                                </a>
                            ))}
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-label text-[11px] tracking-[0.18em] uppercase text-ngms-sky-light mb-5 pb-2.5 border-b border-white/8">
                                Quick Links
                            </h4>
                            {[
                                { label: 'Apply for Admission', href: route('public.admissions.create') },
                                { label: 'Track Application', href: route('public.admissions.track') },
                                { label: 'Alumni Portal', href: '#' },
                                { label: 'Parent Portal', href: route('login') },
                                { label: 'Careers', href: '#' },
                            ].map(({ label, href }) => (
                                <a key={label} href={href} className="block text-[13px] text-white/45 hover:text-ngms-gold hover:pl-1 transition-all duration-150 mb-2.5">
                                    {label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-ngms-navy-mid">
                    <div className="max-w-[1280px] mx-auto px-5 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-white/30">
                            © {new Date().getFullYear()} NextGen School Management System. All Rights Reserved.
                        </p>
                        <div className="flex gap-5">
                            <a href="#" className="text-xs text-white/30 hover:text-white transition-colors">Web Accessibility</a>
                            <a href="#" className="text-xs text-white/30 hover:text-white transition-colors">Sitemap</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
