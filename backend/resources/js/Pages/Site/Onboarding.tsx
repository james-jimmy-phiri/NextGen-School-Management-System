import PublicSiteLayout from '@/Layouts/PublicSiteLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
    return { ref, inView };
}

const ONBOARDING_STEPS = [
    { number: '01', icon: 'app_registration', title: 'Sign Up', desc: 'Register your school on our main signup form and configure your unique sub-domain (e.g. yourschool.ngms.cloud).' },
    { number: '02', icon: 'settings', title: 'Configure Profile', desc: 'Log in as Administrator and define your streams, grade levels, departments, and grading scales parameters.' },
    { number: '03', icon: 'upload_file', title: 'Import Student & Staff Data', desc: 'Upload existing rosters using our pre-designed templates or request our team to migrate records for you.' },
    { number: '04', icon: 'calendar_month', title: 'Configure Fees & Calendar', desc: 'Create fee structures, set up academic calendars, design class timetables, and allocate course workloads.' },
    { number: '05', icon: 'cast_for_education', title: 'Staff Training', desc: 'Access video manuals, documentation articles, or book online training sessions to onboard your teaching staff.' },
    { number: '06', icon: 'campaign', title: 'Go Live', desc: 'Generate login credentials for parents, teachers, and students, and immediately begin managing operations digitally.' }
];

export default function Onboarding() {
    const stepsReveal = useReveal();
    const migrationReveal = useReveal();

    return (
        <PublicSiteLayout activePage="HOW IT WORKS">
            <Head>
                <title>How It Works & Onboarding — NextGen School Management System</title>
                <meta name="description" content="Discover how simple it is to set up NextGen. Six simple steps to configure profiles, import student rosters, and go live within one week." />
            </Head>

            {/* ── Page Hero ── */}
            <div className="relative pt-48 pb-20 bg-ngms-navy overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/site/welcome-students.png" alt="" className="w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-ngms-navy/95 to-ngms-teal/80" />
                </div>
                <div className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-16 text-white text-center">
                    <p className="font-label text-[11px] tracking-[0.22em] uppercase text-ngms-sky-light mb-3 flex items-center justify-center gap-2">
                        <span className="inline-block w-0.5 h-3.5 bg-ngms-gold rounded" />
                        Simple Transition
                    </p>
                    <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight mb-5">
                        Transition Your School<br />to Digital in One Week
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                        We understand changing systems can be daunting. NextGen provides assisted data migration, live webinars, and step-by-step setup guides to make onboarding painless.
                    </p>
                </div>
            </div>

            {/* ── Steps timeline ── */}
            <section ref={stepsReveal.ref} className="py-24 px-5 lg:px-16 max-w-[1280px] mx-auto">
                <div className="text-center mb-16">
                    <p className="font-label text-xs tracking-[0.22em] uppercase text-ngms-blue mb-2">Onboarding Steps</p>
                    <h2 className="font-serif text-3xl lg:text-4xl font-bold text-ngms-navy">Our 6-Step Implementation Roadmap</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ONBOARDING_STEPS.map((step, i) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 20 }}
                            animate={stepsReveal.inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="bg-white border border-surface-variant p-8 rounded-xl hover:border-ngms-sky hover:shadow-lg transition-all duration-300 group relative"
                        >
                            <span className="absolute top-6 right-6 font-serif text-4xl font-black text-on-surface-var/[0.06] group-hover:text-ngms-sky/10">
                                {step.number}
                            </span>
                            <div className="w-12 h-12 rounded-xl bg-ngms-teal/10 text-ngms-teal flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                            </div>
                            <h3 className="font-sans text-base font-bold text-ngms-navy mb-2">{step.title}</h3>
                            <p className="text-xs text-on-surface-var leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Data Migration Section ── */}
            <section ref={migrationReveal.ref} className="py-24 px-5 lg:px-16 bg-surface-low border-t border-surface-variant">
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={migrationReveal.inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7 space-y-6"
                    >
                        <span className="inline-block bg-ngms-gold/10 text-ngms-gold font-label text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded font-bold">
                            FREE ASSISTED MIGRATION
                        </span>
                        <h2 className="font-serif text-3xl font-bold text-ngms-navy">Switching from Paper or Spreadsheets?</h2>
                        <p className="text-sm text-on-surface-var leading-relaxed">
                            Don't worry about entering data manually. Our technical team handles data cleaning and migrations completely free for Standard and Premium customers.
                        </p>
                        <p className="text-sm text-on-surface-var leading-relaxed">
                            Simply email us your roster spreadsheets, student lists, parent contact logs, and outstanding balance charts. We structure the data and import it directly into your school workspace database.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={migrationReveal.inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:col-span-5 bg-white border border-surface-variant p-8 rounded-xl shadow-sm space-y-6"
                    >
                        <h3 className="font-serif text-lg font-bold text-ngms-navy">Onboarding Expectations</h3>
                        {[
                            { label: 'Setup Timeline', value: 'Most schools live in 5–7 days' },
                            { label: 'Data Cleaning', value: 'Handled by NGMS specialists' },
                            { label: 'Staff Training', value: 'Self-serve manuals & live webinars' },
                            { label: 'Trial Period', value: '30 days free, cancel anytime' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex justify-between py-2 border-b border-surface-low last:border-b-0">
                                <span className="text-xs font-semibold text-on-surface-var">{item.label}</span>
                                <span className="text-xs text-ngms-teal font-bold">{item.value}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Training & Resources Section ── */}
            <section className="py-24 px-5 lg:px-16 max-w-[1280px] mx-auto">
                <div className="text-center mb-16">
                    <p className="font-label text-xs tracking-[0.22em] uppercase text-ngms-blue mb-2">On-Demand Resources</p>
                    <h2 className="font-serif text-3xl font-bold text-ngms-navy">Training & Support Channels</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: 'Video Tutorials Library', desc: 'Short, task-focused video clips detailing how to log marks, customize billing registers, and add student records.', icon: 'video_library' },
                        { title: 'Documentation & Help Articles', desc: 'Step-by-step text guides and documentation search filters addressing setup configurations and workflows.', icon: 'article' },
                        { title: 'Live Implementation Webinars', desc: 'Schedule online coaching calls for your school staff to learn modules together under specialist guides.', icon: 'video_call' }
                    ].map((res, i) => (
                        <div key={i} className="border border-surface-variant p-8 rounded-xl hover:border-ngms-gold transition-colors duration-300 group">
                            <span className="material-symbols-outlined text-ngms-gold text-3xl mb-4 block group-hover:scale-105 transition-transform">{res.icon}</span>
                            <h3 className="font-sans text-sm font-bold text-ngms-navy mb-2">{res.title}</h3>
                            <p className="text-xs text-on-surface-var leading-relaxed">{res.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="bg-ngms-navy py-20 px-5 lg:px-16 text-white text-center">
                <div className="max-w-[600px] mx-auto space-y-6">
                    <h2 className="font-serif text-3xl font-bold">Get Started Today</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Ready to make the switch? Sign up for your 30-day trial and request data migration support to get your portal configured.
                    </p>
                    <div className="pt-2 flex justify-center gap-4">
                        <Link
                            href={route('register')}
                            className="font-label text-xs tracking-widest uppercase bg-ngms-gold text-ngms-navy px-8 py-4 rounded-full hover:bg-white transition-colors font-bold"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            href="/site/contact"
                            className="font-label text-xs tracking-widest uppercase border-2 border-white/20 text-white px-8 py-4 rounded-full hover:bg-white hover:text-ngms-navy transition-all font-bold"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>
        </PublicSiteLayout>
    );
}
