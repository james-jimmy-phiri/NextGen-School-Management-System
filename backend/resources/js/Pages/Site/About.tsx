import PublicSiteLayout from '@/Layouts/PublicSiteLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
    return { ref, inView };
}

const VALUES = [
    { icon: 'payments', title: 'Affordability First', desc: 'SaaS licensing models structured per term around school sizes, ensuring school software is accessible to community schools.' },
    { icon: 'security', title: 'Data Security & Isolation', desc: 'Using secure multi-tenant databases, AES-256 cloud encryption, and hourly recovery backups to safeguard student records.' },
    { icon: 'support_agent', title: '24/7 Local Support', desc: 'Our dedicated implementation team is based in Lilongwe and Blantyre, providing on-site onboarding and live callbacks.' },
    { icon: 'wifi_off', title: 'Offline-Resilient Sync', desc: 'Understanding local connectivity challenges, our sync clients run locally and update records when networks restore.' },
    { icon: 'diversity_3', title: 'Ubuntu & Collaboration', desc: 'Rooted in the philosophy of Ubuntu, our system unifies parents, bursars, and teachers for student upliftment.' },
    { icon: 'trending_up', title: 'Empowering Future Leaders', desc: 'Building digital administration tracks that allow schools to focus on academic quality, nurturing Malawi\'s future.' }
];

const TIMELINE = [
    { year: '2022', event: 'NextGen School Management System founded in Lilongwe to solve paper record issues and fee leakages.' },
    { year: '2023', event: 'First beta deployment across 5 partner primary schools in Central Malawi. Launched SMS alerts.' },
    { year: '2024', event: 'NGMS v2 released with integrated fee ledger cash books and Airtel Money/Mpamba reconciliation.' },
    { year: '2025', event: 'Expanded to serve 25+ schools and 10,000+ students. Opened our second local office in Blantyre.' },
    { year: '2026', event: 'Currently serving 50+ schools, managing 20,000+ student profiles, and expanding across Sub-Saharan Africa.' }
];

const LEADERSHIP = [
    { name: 'Dr. Amara Osei', title: 'Founder & CEO', initials: 'AO', color: 'bg-ngms-navy', bio: 'EdTech innovator with 10+ years designing digital administration platforms across East Africa.' },
    { name: 'Ms. Thandiwe Phiri', title: 'Chief Product Officer', initials: 'TP', color: 'bg-ngms-blue', bio: 'Former high school principal, passionate about building interfaces teachers and parents love.' },
    { name: 'Mr. Kwame Asante', title: 'Chief Technology Officer', initials: 'KA', color: 'bg-ngms-sky', bio: 'Enterprise database architect specializing in secure multi-tenancy and local offline synchronization.' },
    { name: 'Mrs. Lindiwe Dube', title: 'Head of Customer Success', initials: 'LD', color: 'bg-ngms-teal', bio: 'Coordinates our local implementation specialists and handles direct onboarding and training support.' }
];

export default function About() {
    const missionReveal = useReveal();
    const historyReveal = useReveal();
    const leadershipReveal = useReveal();

    return (
        <PublicSiteLayout activePage="ABOUT US">
            <Head>
                <title>About Us — NextGen School Management System</title>
                <meta name="description" content="Learn the story of NextGen - how we are digitizing school administration, billing, and parent messaging across Malawi." />
            </Head>

            {/* ── Page Hero ── */}
            <div className="relative pt-48 pb-20 bg-ngms-navy overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/site/welcome-students.png" alt="" className="w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-ngms-navy/95 to-ngms-teal/80" />
                </div>
                <div className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-16 text-white">
                    <p className="font-label text-[11px] tracking-[0.22em] uppercase text-ngms-sky-light mb-3 flex items-center gap-2">
                        <span className="inline-block w-0.5 h-3.5 bg-ngms-gold rounded" />
                        Our Vision
                    </p>
                    <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight mb-5">
                        Transforming Education<br />Through Modern Software
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
                        NextGen (NGMS) was born out of a simple mission: to eliminate the administrative burden on African educators, allowing them to focus on what matters most — teaching.
                    </p>
                </div>
            </div>

            {/* ── Company Story ── */}
            <section id="story" className="py-24 px-5 lg:px-16 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                    <p className="font-label text-[12px] tracking-[0.22em] uppercase text-ngms-blue mb-3">Our Roots</p>
                    <h2 className="font-serif text-3xl lg:text-4xl font-bold text-ngms-navy">Why NextGen Was Built</h2>
                    <p className="text-sm leading-relaxed text-on-surface-var">
                        School administrators in Malawi spend up to 40% of their operational hours sorting through spreadsheets, checking manual cash registers, and writing out report cards. This paper-heavy approach leaks tuition revenues and leaves parents in the dark.
                    </p>
                    <p className="text-sm leading-relaxed text-on-surface-var">
                        We developed NextGen to solve these specific regional pain points. By building a cloud platform that integrates seamlessly with TNM Mpamba and Airtel Money, operates reliably under inconsistent electricity patterns, and remains pricing-aligned with local budgets, we have made enterprise-tier school software available to every institution.
                    </p>
                </div>
                <div className="lg:col-span-5 border border-surface-variant bg-surface rounded-xl p-4">
                    <img
                        src="/images/site/news-academics.png"
                        alt="Our development work"
                        className="w-full h-72 object-cover rounded shadow-inner"
                    />
                </div>
            </section>

            {/* ── Mission & Values ── */}
            <section id="mission" ref={missionReveal.ref} className="py-24 px-5 lg:px-16 bg-surface-low border-y border-surface-variant">
                <div className="max-w-[1280px] mx-auto space-y-16">
                    <div className="text-center max-w-2xl mx-auto space-y-4">
                        <p className="font-label text-[12px] tracking-[0.22em] uppercase text-ngms-blue">Core Pillars</p>
                        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-ngms-navy">Mission & Core Values</h2>
                        <p className="text-xs text-on-surface-var leading-relaxed">
                            Our mission is to democratize world-class school software, making modern registers, automated billing, and gradebooks simple and accessible.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {VALUES.map((val, i) => (
                            <motion.div
                                key={val.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={missionReveal.inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                className="bg-white border border-surface-variant p-8 hover:border-ngms-sky hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-ngms-sky/8 flex items-center justify-center mb-5 group-hover:bg-ngms-sky/15 transition-colors">
                                    <span className="material-symbols-outlined text-ngms-sky text-2xl">{val.icon}</span>
                                </div>
                                <h3 className="font-serif text-lg font-semibold text-ngms-navy mb-2">{val.title}</h3>
                                <p className="text-xs leading-relaxed text-on-surface-var">{val.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── History Timeline ── */}
            <section id="history" ref={historyReveal.ref} className="py-24 px-5 lg:px-16 bg-ngms-navy text-white">
                <div className="max-w-[1280px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={historyReveal.inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <p className="font-label text-[12px] tracking-[0.22em] uppercase text-ngms-sky-light mb-2">Our Journey</p>
                        <h2 className="font-serif text-4xl font-bold">Key Milestones</h2>
                    </motion.div>

                    <div className="relative max-w-3xl mx-auto">
                        <div className="absolute left-16 top-0 bottom-0 w-px bg-white/15" />
                        {TIMELINE.map((item, i) => (
                            <motion.div
                                key={item.year}
                                initial={{ opacity: 0, x: -20 }}
                                animate={historyReveal.inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="flex gap-8 mb-10 last:mb-0"
                            >
                                <div className="w-16 shrink-0 flex flex-col items-end pt-1">
                                    <span className="font-label text-ngms-gold font-bold text-sm">{item.year}</span>
                                </div>
                                <div className="relative pl-8 pb-2">
                                    <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-ngms-gold border-2 border-ngms-navy -translate-x-1.5" />
                                    <p className="text-white/70 text-sm leading-relaxed">{item.event}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Leadership ── */}
            <section id="leadership" ref={leadershipReveal.ref} className="py-24 px-5 lg:px-16 max-w-[1280px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={leadershipReveal.inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <p className="font-label text-[12px] tracking-[0.22em] uppercase text-ngms-blue mb-2">Our Team</p>
                    <h2 className="font-serif text-4xl font-bold text-ngms-navy">Core Leadership</h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {LEADERSHIP.map((person, i) => (
                        <motion.div
                            key={person.name}
                            initial={{ opacity: 0, y: 24 }}
                            animate={leadershipReveal.inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="text-center group border border-surface-variant p-6 bg-surface-alt rounded-lg"
                        >
                            <div className={`w-20 h-20 ${person.color} rounded-full mx-auto mb-5 flex items-center justify-center text-white font-serif text-xl font-bold group-hover:scale-105 transition-transform duration-300`}>
                                {person.initials}
                            </div>
                            <h3 className="font-serif text-base font-bold text-ngms-navy">{person.name}</h3>
                            <p className="font-label text-[10px] tracking-widest uppercase text-ngms-blue mt-1 mb-4">{person.title}</p>
                            <p className="text-xs text-on-surface-var leading-relaxed">{person.bio}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Final Join CTA ── */}
            <section className="bg-surface-low border-t border-surface-variant py-20 px-5 lg:px-16 text-center">
                <div className="max-w-[600px] mx-auto space-y-6">
                    <h2 className="font-serif text-3xl font-bold text-ngms-navy">Join Us in Transforming Education</h2>
                    <p className="text-on-surface-var text-sm leading-relaxed">
                        We are looking for motivated schools, pilot partners, and local representatives to grow the NextGen network. Let's digitize African school administration together.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/site/contact"
                            className="inline-flex items-center gap-2 font-label text-xs tracking-widest uppercase bg-ngms-navy text-white px-8 py-3.5 rounded-full hover:bg-ngms-sky transition-colors font-bold"
                        >
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>
        </PublicSiteLayout>
    );
}
