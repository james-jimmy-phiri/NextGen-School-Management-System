import PublicSiteLayout from '@/Layouts/PublicSiteLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
    return { ref, inView };
}

const ARTICLES = [
    { cat: 'Getting Started', title: 'How to claim your school subdomain and log in', desc: 'A step-by-step walkthrough on finalizing registration, creating administrator accounts, and accessing your unique subdomain.' },
    { cat: 'Student Management', title: 'Importing students using Excel sheets templates', desc: 'Download our student CSV templates, format student rosters properly, and upload them via the School Setup panel.' },
    { cat: 'Finance & Billing', title: 'Setting up termly invoices and stream payments', desc: 'Configure fee brackets per grade stream, generate automated invoices, and record mobile money cash deposits.' },
    { cat: 'Troubleshooting', title: 'Resolving parent mobile app login errors', desc: 'How to verify parent mobile phone identifiers, reset parent portal passwords, and configure phone credentials.' },
    { cat: 'Student Management', title: 'Allocating teachers to stream subject courses', desc: 'Create teacher work allocations, assign stream subjects, and automatically compile timetables schedules.' },
    { cat: 'Finance & Billing', title: 'Integrating Airtel Money &TN Mpamba accounts', desc: 'Link your school\'s mobile merchant wallets for real-time fee payment receipts reconciliation.' }
];

const CATS = ['All', 'Getting Started', 'Student Management', 'Finance & Billing', 'Troubleshooting'];

export default function HelpCenter() {
    const [search, setSearch] = useState('');
    const [activeCat, setActiveCat] = useState('All');
    const [ticket, setTicket] = useState({ name: '', email: '', subject: '', message: '' });
    const [ticketSent, setTicketSent] = useState(false);

    const helpReveal = useReveal();
    const contactReveal = useReveal();

    const filteredArticles = ARTICLES.filter((art) => {
        const matchesCat = activeCat === 'All' || art.cat === activeCat;
        const matchesSearch = art.title.toLowerCase().includes(search.toLowerCase()) || art.desc.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const handleTicketSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTicketSent(true);
        setTicket({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setTicketSent(false), 5000);
    };

    return (
        <PublicSiteLayout activePage="SUPPORT">
            <Head>
                <title>Support & Help Center — NextGen School Management System</title>
                <meta name="description" content="Access NGMS documentation guides, search setup articles, watch video tutorials, or contact customer support." />
            </Head>

            {/* ── Page Hero ── */}
            <div className="relative pt-48 pb-20 bg-ngms-navy overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/site/hero-students.png" alt="" className="w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-ngms-navy/95 to-ngms-blue/85" />
                </div>
                <div className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-16 text-white text-center">
                    <p className="font-label text-[11px] tracking-[0.22em] uppercase text-ngms-sky-light mb-3 flex items-center justify-center gap-2">
                        <span className="inline-block w-0.5 h-3.5 bg-ngms-gold rounded" />
                        Support Desk
                    </p>
                    <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight mb-5">
                        How Can We Help You?
                    </h1>
                    
                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto mt-8 relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-var">search</span>
                        <input
                            type="text"
                            placeholder="Search help articles (e.g. data import, invoicing)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-outline-var text-on-surface rounded-full py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-ngms-sky focus:border-transparent transition-all shadow-md"
                        />
                    </div>
                </div>
            </div>

            {/* ── Help Categories & Search Results ── */}
            <section ref={helpReveal.ref} className="py-20 px-5 lg:px-16 max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-3 space-y-6">
                        <h3 className="font-label text-xs tracking-widest uppercase text-ngms-navy font-bold border-b border-surface-variant pb-3">Topics</h3>
                        <div className="flex flex-col gap-2">
                            {CATS.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCat(cat)}
                                    className={`text-left px-4 py-2.5 rounded font-sans text-xs transition-colors ${
                                        activeCat === cat
                                            ? 'bg-ngms-teal text-white font-bold'
                                            : 'text-on-surface hover:bg-surface-low border border-surface-variant'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* System status Link */}
                        <div className="bg-surface-alt border border-surface-variant p-6 rounded-lg text-left mt-8">
                            <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-bold mb-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                All Systems Operational
                            </span>
                            <p className="text-[10px] text-on-surface-var leading-relaxed mb-4">Uptime logs: 99.98% over the past 90 days. Backups are healthy.</p>
                            <a
                                href="#status"
                                className="font-label text-[10px] tracking-wider uppercase text-ngms-sky hover:underline"
                            >
                                Uptime History & logs
                            </a>
                        </div>
                    </div>

                    {/* Articles List */}
                    <div className="lg:col-span-9 space-y-6">
                        <h3 className="font-label text-xs tracking-widest uppercase text-ngms-navy font-bold border-b border-surface-variant pb-3">
                            Articles in {activeCat} {search && `matching "${search}"`}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredArticles.map((art, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                    className="border border-surface-variant bg-white p-6 rounded-lg hover:border-ngms-sky hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <span className="inline-block bg-surface-low border border-surface-variant text-on-surface-var font-label text-[9px] tracking-widest uppercase px-2 py-0.5 mb-3">
                                        {art.cat}
                                    </span>
                                    <h4 className="font-sans text-sm font-bold text-ngms-navy group-hover:text-ngms-sky transition-colors mb-2">
                                        {art.title}
                                    </h4>
                                    <p className="text-xs text-on-surface-var leading-relaxed">
                                        {art.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {filteredArticles.length === 0 && (
                            <div className="text-center py-12 text-on-surface-var/60">
                                <span className="material-symbols-outlined text-4xl block text-outline-var mb-3">search_off</span>
                                No support articles found. Try another search.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Video Tutorials Section ── */}
            <section id="tutorials" className="py-24 px-5 lg:px-16 bg-surface-low border-t border-surface-variant">
                <div className="max-w-[1280px] mx-auto text-center space-y-6">
                    <p className="font-label text-xs tracking-[0.22em] uppercase text-ngms-blue">Visual Manuals</p>
                    <h2 className="font-serif text-3xl font-bold text-ngms-navy">Video Tutorials Library</h2>
                    <p className="text-on-surface-var text-xs max-w-lg mx-auto">
                        Explore our short video walkthroughs detailing setup tasks, invoice calculations, and grade calculations.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
                        {[
                            { title: 'Overview: NextGen Admin Panel', length: '12 mins', link: '#' },
                            { title: 'Finance: Generating Stream Invoices', length: '8 mins', link: '#' },
                            { title: 'SIS: Importing Class Rosters via Excel', length: '6 mins', link: '#' }
                        ].map((vid, i) => (
                            <div key={i} className="bg-white border border-surface-variant p-6 rounded-lg text-left relative overflow-hidden group hover:border-ngms-gold transition-colors">
                                <div className="aspect-video bg-ngms-navy rounded mb-4 flex items-center justify-center relative">
                                    <span className="material-symbols-outlined text-3xl text-ngms-gold group-hover:scale-110 transition-transform">play_circle</span>
                                    <span className="absolute bottom-2 right-2 bg-black/60 text-[9px] text-white px-2 py-0.5 rounded font-label">{vid.length}</span>
                                </div>
                                <h4 className="font-sans text-xs font-bold text-ngms-navy">{vid.title}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Support Request / Ticket Form ── */}
            <section ref={contactReveal.ref} className="py-24 px-5 lg:px-16 bg-white border-t border-surface-variant max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5 space-y-6">
                        <span className="inline-block bg-ngms-teal/10 text-ngms-teal font-label text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded font-bold">
                            DIRECT ASSISTANCE
                        </span>
                        <h2 className="font-serif text-3xl font-bold text-ngms-navy">Need Custom Support?</h2>
                        <p className="text-sm text-on-surface-var leading-relaxed">
                            Submit a support ticket and our customer success specialists in Lilongwe or Blantyre will respond within 4 business hours.
                        </p>
                        <div className="space-y-4 pt-4 text-xs text-on-surface-var">
                            <p className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-ngms-sky">call</span>
                                <span>Phone support: +265 1 234 567</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-ngms-sky">mail</span>
                                <span>Email support: support@ngms.cloud</span>
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-7 bg-surface-alt border border-surface-variant p-8 rounded-xl">
                        <h3 className="font-serif text-lg font-bold text-ngms-navy mb-6">Open a Support Ticket</h3>
                        
                        {ticketSent ? (
                            <div className="bg-green-500/10 border border-green-500/30 p-6 text-center text-green-700 rounded-lg">
                                <span className="material-symbols-outlined text-3xl mb-2 block">task_alt</span>
                                <h4 className="font-bold text-sm">Ticket Submitted Successfully!</h4>
                                <p className="text-xs mt-1">Our support agents have received your request and will follow up shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleTicketSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-label tracking-wider uppercase text-on-surface-var mb-1">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={ticket.name}
                                            onChange={(e) => setTicket({ ...ticket, name: e.target.value })}
                                            className="w-full bg-white border border-outline-var rounded px-4 py-2.5 text-xs focus:outline-none focus:border-ngms-navy focus:ring-1 focus:ring-ngms-navy"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-label tracking-wider uppercase text-on-surface-var mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={ticket.email}
                                            onChange={(e) => setTicket({ ...ticket, email: e.target.value })}
                                            className="w-full bg-white border border-outline-var rounded px-4 py-2.5 text-xs focus:outline-none focus:border-ngms-navy focus:ring-1 focus:ring-ngms-navy"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-label tracking-wider uppercase text-on-surface-var mb-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={ticket.subject}
                                        onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                                        className="w-full bg-white border border-outline-var rounded px-4 py-2.5 text-xs focus:outline-none focus:border-ngms-navy focus:ring-1 focus:ring-ngms-navy"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-label tracking-wider uppercase text-on-surface-var mb-1">Message Detail</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={ticket.message}
                                        onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                                        className="w-full bg-white border border-outline-var rounded px-4 py-2.5 text-xs focus:outline-none focus:border-ngms-navy focus:ring-1 focus:ring-ngms-navy resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-ngms-navy hover:bg-ngms-sky text-white font-label text-xs tracking-widest uppercase py-3 rounded-full font-bold transition-colors"
                                >
                                    Submit Ticket
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </PublicSiteLayout>
    );
}
