import PublicSiteLayout from '@/Layouts/PublicSiteLayout';
import { Head } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
    return { ref, inView };
}

export default function SiteContact() {
    const [form, setForm] = useState({ name: '', email: '', school: '', phone: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const formReveal = useReveal();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <PublicSiteLayout activePage="SUPPORT">
            <Head>
                <title>Contact Sales & Book Demo — NextGen School Management System</title>
                <meta name="description" content="Get in touch with our local Malawian school implementation specialists. Request a custom quote or book a live dashboard demo." />
            </Head>

            {/* ── Page Hero ── */}
            <div className="relative pt-48 pb-20 bg-ngms-navy overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-ngms-navy to-ngms-teal" />
                </div>
                <div className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-16 text-white text-center">
                    <p className="font-label text-[11px] tracking-[0.22em] uppercase text-ngms-sky-light mb-3 flex items-center justify-center gap-2">
                        <span className="inline-block w-0.5 h-3.5 bg-ngms-gold rounded" />
                        Sales & Demo Queries
                    </p>
                    <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight mb-5">
                        Book a Live Demo
                    </h1>
                    <p className="text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
                        Learn how NextGen fits your school. Talk directly to our product specialists in Lilongwe or Blantyre, Malawian offices.
                    </p>
                </div>
            </div>

            {/* ── Contact Info + Form ── */}
            <section ref={formReveal.ref} className="py-24 px-5 lg:px-16 max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Info Column */}
                    <div>
                        <h2 className="font-serif text-2xl font-bold text-ngms-navy mb-8">Our Offices</h2>
                        <div className="space-y-8">
                            {[
                                { icon: 'location_on', title: 'Lilongwe Office', lines: ['Area 3, Barron Court Building', 'Lilongwe, Malawi'] },
                                { icon: 'location_on', title: 'Blantyre Branch', lines: ['Victoria Avenue, Standard Bank Building', 'Blantyre, Malawi'] },
                                { icon: 'call', title: 'Support Hotlines', lines: ['+265 1 234 567', '+265 9 876 543'] },
                                { icon: 'email', title: 'Email Address', lines: ['sales@ngms.cloud', 'support@ngms.cloud'] },
                            ].map(({ icon, title, lines }) => (
                                <div key={title} className="flex gap-4">
                                    <div className="w-10 h-10 bg-ngms-sky/8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-ngms-sky text-xl">{icon}</span>
                                    </div>
                                    <div>
                                        <p className="font-label text-[10px] tracking-widest uppercase text-on-surface-var mb-1">{title}</p>
                                        {lines.map((line) => (
                                            <p key={line} className="text-sm text-ngms-navy font-medium">{line}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            animate={formReveal.inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6 }}
                        >
                            {submitted ? (
                                <div className="bg-ngms-sky/8 border border-ngms-sky/20 p-12 text-center rounded-xl">
                                    <span className="material-symbols-outlined text-5xl text-ngms-sky mb-4 block">check_circle</span>
                                    <h3 className="font-serif text-2xl font-bold text-ngms-navy mb-2">Request Received!</h3>
                                    <p className="text-on-surface-var text-sm leading-relaxed">Thank you for booking a demo. Our school implementation specialists will call you back within 4 business hours to arrange the scheduling.</p>
                                    <button
                                        onClick={() => { setSubmitted(false); setForm({ name: '', email: '', school: '', phone: '', subject: '', message: '' }); }}
                                        className="mt-6 font-label text-[11px] tracking-widest uppercase text-ngms-blue hover:text-ngms-navy transition-colors font-bold"
                                    >
                                        Submit another request
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="bg-white border border-surface-variant p-10 rounded-xl shadow-sm">
                                    <h2 className="font-serif text-2xl font-bold text-ngms-navy mb-6 text-center">Request a Callback & Demo</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                        <div>
                                            <label className="block font-label text-[10px] tracking-widest uppercase text-on-surface-var mb-1.5 font-semibold">Your Name *</label>
                                            <input required type="text" name="name" value={form.name} onChange={handleChange}
                                                className="w-full border border-outline-var rounded px-4 py-3 text-xs focus:outline-none focus:border-ngms-navy focus:ring-1 focus:ring-ngms-navy transition-colors bg-surface-alt/20" />
                                        </div>
                                        <div>
                                            <label className="block font-label text-[10px] tracking-widest uppercase text-on-surface-var mb-1.5 font-semibold">Email Address *</label>
                                            <input required type="email" name="email" value={form.email} onChange={handleChange}
                                                className="w-full border border-outline-var rounded px-4 py-3 text-xs focus:outline-none focus:border-ngms-navy focus:ring-1 focus:ring-ngms-navy transition-colors bg-surface-alt/20" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                        <div>
                                            <label className="block font-label text-[10px] tracking-widest uppercase text-on-surface-var mb-1.5 font-semibold">School Name *</label>
                                            <input required type="text" name="school" value={form.school} onChange={handleChange}
                                                className="w-full border border-outline-var rounded px-4 py-3 text-xs focus:outline-none focus:border-ngms-navy focus:ring-1 focus:ring-ngms-navy transition-colors bg-surface-alt/20" />
                                        </div>
                                        <div>
                                            <label className="block font-label text-[10px] tracking-widest uppercase text-on-surface-var mb-1.5 font-semibold">Phone Number *</label>
                                            <input required type="text" name="phone" value={form.phone} onChange={handleChange}
                                                className="w-full border border-outline-var rounded px-4 py-3 text-xs focus:outline-none focus:border-ngms-navy focus:ring-1 focus:ring-ngms-navy transition-colors bg-surface-alt/20" />
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <label className="block font-label text-[10px] tracking-widest uppercase text-on-surface-var mb-1.5 font-semibold">Interested Package</label>
                                        <select name="subject" value={form.subject} onChange={handleChange}
                                            className="w-full border border-outline-var rounded px-4 py-3 text-xs focus:outline-none focus:border-ngms-navy focus:ring-1 focus:ring-ngms-navy transition-colors bg-white">
                                            <option value="">Select a plan…</option>
                                            <option>Starter Plan Trial</option>
                                            <option>Standard Plan Trial</option>
                                            <option>Premium Plan Trial</option>
                                            <option>Custom Enterprise Integration</option>
                                            <option>Other Queries</option>
                                        </select>
                                    </div>
                                    <div className="mb-8">
                                        <label className="block font-label text-[10px] tracking-widest uppercase text-on-surface-var mb-1.5 font-semibold">Special Notes / Message</label>
                                        <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                                            className="w-full border border-outline-var rounded px-4 py-3 text-xs focus:outline-none focus:border-ngms-navy focus:ring-1 focus:ring-ngms-navy transition-colors resize-none bg-surface-alt/20" />
                                    </div>
                                    <button type="submit"
                                        className="w-full font-label text-[12px] tracking-widest uppercase bg-ngms-navy text-white py-4 rounded-full hover:bg-ngms-blue transition-colors font-bold">
                                        Request Callback Demo
                                        <span className="material-symbols-outlined text-base ml-2 align-middle">call</span>
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>
        </PublicSiteLayout>
    );
}
