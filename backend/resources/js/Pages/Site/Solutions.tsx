import PublicSiteLayout from '@/Layouts/PublicSiteLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
    return { ref, inView };
}

const SOLUTIONS = [
    {
        id: 'primary',
        title: 'Primary Schools',
        tagline: 'Simplify early education management and engage young families.',
        painPoints: [
            'Busy parents missing printed notes or flyers.',
            'Difficulty tracking basic vaccination and health records.',
            'Manual attendance registers consuming valuable lesson times.'
        ],
        highlightModules: ['Parent Portal app', 'Attendance SMS Alerts', 'Health Records tracking'],
        testimonial: '“Parents feel closer to our school than ever. The direct notification app means they see report cards and class events instantly.” — Headmistress, Blantyre Primary',
        icon: 'child_care'
    },
    {
        id: 'secondary',
        title: 'Secondary & High Schools',
        tagline: 'Streamline high-volume students, multiple streams, and board exams.',
        painPoints: [
            'Complex assessment structures (continuous assessments, term exams, finals).',
            'Manually calculating stream positions and ranking hundreds of students.',
            'Invoicing diverse boarding fees, transport, and tuition variations.'
        ],
        highlightModules: ['Digital Gradebooks & Exams', 'Finance Billing Engine', 'Automated Rankings & Transcripts'],
        testimonial: '“Calculating termly averages and stream rankings for 600 students used to take teachers three full days. NGMS does it in three minutes.” — Academic Director, Zomba High',
        icon: 'school'
    },
    {
        id: 'private',
        title: 'Private & International Academies',
        tagline: 'Deliver a premium, digital experience that aligns with high standards.',
        painPoints: [
            'Demanding parent communities expecting high-tech channels and instant feedback.',
            'Need for customizable grading scales (e.g. Cambridge, local curricula).',
            'Enforcing fee deadlines and tracking payment plans.'
        ],
        highlightModules: ['Cambridge & Custom Grading', 'Fee installment tracker', 'Role-Based security permissions'],
        testimonial: '“NGMS gives our academy the premium digital interface that matches our high educational standards. The multi-tenant setup is incredibly robust.” — Owner, Lilongwe International Academy',
        icon: 'workspace_premium'
    },
    {
        id: 'faith',
        title: 'Christian & Faith-Based Schools',
        tagline: 'Focus on character development, values, and community upliftment.',
        painPoints: [
            'Integrating student behaviour monitoring alongside academic results.',
            'Managing donor funds and scholarship allocations transparently.',
            'Communicating value-driven events and community outreach tasks.'
        ],
        highlightModules: ['Disciplinary & Behaviour Tracking', 'Merit Scholarship allocation', 'Broadcasting announcements boards'],
        testimonial: '“We can track disciplinary records, record character developments, and manage donor scholarship funds transparently in one place.” — Administrator, Saint Mary Boys School',
        icon: 'church'
    },
    {
        id: 'colleges',
        title: 'Colleges & Higher Education',
        tagline: 'Scale management for modular courses, departments, and semesters.',
        painPoints: [
            'Students registering for individual modular courses rather than fixed classes.',
            'Managing diverse academic departments, course allocations, and credit values.',
            'Tracking fees across varying semesters and modular registrations.'
        ],
        highlightModules: ['Modular Registration systems', 'Department hierarchies', 'Credit hours trackers'],
        testimonial: '“Higher education requires a flexible student information database. NGMS allowed us to structure courses modularly and track credit hours.” — Registrar, Capital City College',
        icon: 'account_balance'
    }
];

export default function Solutions() {
    const solutionReveal = useReveal();

    return (
        <PublicSiteLayout activePage="SOLUTIONS">
            <Head>
                <title>SaaS Solutions for Schools — NextGen School Management System</title>
                <meta name="description" content="Discover school management solutions tailored for Primary, Secondary, Private, Faith-based, and Colleges in Malawi." />
            </Head>

            {/* ── Page Hero ── */}
            <div className="relative pt-48 pb-20 bg-ngms-navy overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/site/welcome-students.png" alt="" className="w-full h-full object-cover opacity-25" />
                    <div className="absolute inset-0 bg-gradient-to-br from-ngms-navy/95 to-ngms-blue/70" />
                </div>
                <div className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-16 text-white text-center">
                    <p className="font-label text-[11px] tracking-[0.22em] uppercase text-ngms-sky-light mb-3 flex items-center justify-center gap-2">
                        <span className="inline-block w-0.5 h-3.5 bg-ngms-gold rounded" />
                        Customized Workspaces
                    </p>
                    <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight mb-5">
                        Solutions Built for Your School
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                        Every institution operates differently. NGMS adjusts features to fit your structure, whether you run a small primary school or a multi-campus college.
                    </p>
                </div>
            </div>

            {/* ── Solutions Hub ── */}
            <section ref={solutionReveal.ref} className="py-24 px-5 lg:px-16 max-w-[1280px] mx-auto space-y-24">
                <div className="text-center">
                    <p className="font-label text-[12px] tracking-[0.22em] uppercase text-ngms-blue mb-2">School Segmentations</p>
                    <h2 className="font-serif text-4xl font-bold text-ngms-navy">Tailored Systems for Every Level</h2>
                </div>

                <div className="space-y-20">
                    {SOLUTIONS.map((sol, idx) => (
                        <motion.div
                            key={sol.id}
                            id={sol.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={solutionReveal.inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: idx * 0.05 }}
                            className="border border-surface-variant bg-white rounded-xl p-8 lg:p-12 hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24"
                        >
                            {/* Heading & Intro Column */}
                            <div className="lg:col-span-5 space-y-4">
                                <div className="inline-flex w-12 h-12 bg-ngms-teal/10 text-ngms-teal rounded-xl items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">{sol.icon}</span>
                                </div>
                                <h3 className="font-serif text-2xl lg:text-3xl font-bold text-ngms-navy">{sol.title}</h3>
                                <p className="text-sm text-ngms-sky font-semibold">{sol.tagline}</p>
                                
                                <div className="pt-4">
                                    <p className="text-xs text-on-surface-var/80 italic font-medium p-4 bg-surface rounded border border-surface-variant/40">
                                        {sol.testimonial}
                                    </p>
                                </div>
                            </div>

                            {/* Details Column */}
                            <div className="lg:col-span-7 space-y-6 lg:pl-6 border-t lg:border-t-0 lg:border-l border-surface-variant/60 pt-6 lg:pt-0">
                                <div>
                                    <span className="font-label text-[10px] tracking-widest text-on-surface-var/60 uppercase block mb-3">Key Challenges Solved</span>
                                    <ul className="space-y-3">
                                        {sol.painPoints.map((pp, ppIdx) => (
                                            <li key={ppIdx} className="flex items-start gap-2.5 text-xs text-on-surface-var">
                                                <span className="material-symbols-outlined text-red-500 text-base leading-none">remove_circle_outline</span>
                                                <span>{pp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <span className="font-label text-[10px] tracking-widest text-on-surface-var/60 uppercase block mb-3">Recommended Modules</span>
                                    <div className="flex flex-wrap gap-2">
                                        {sol.highlightModules.map((hm) => (
                                            <span key={hm} className="bg-ngms-teal/10 text-ngms-teal text-xs font-semibold px-3 py-1 rounded-full">
                                                {hm}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Call To Action ── */}
            <section className="bg-surface-low border-t border-surface-variant py-20 px-5 lg:px-16 text-center">
                <div className="max-w-[600px] mx-auto space-y-6">
                    <h2 className="font-serif text-3xl font-bold text-ngms-navy">Find the Right Plan for Your School</h2>
                    <p className="text-on-surface-var text-sm leading-relaxed">
                        Ready to digitize operations? View our subscription tiers, compare functional features, and claim your free trial setup.
                    </p>
                    <div className="pt-2 flex justify-center gap-4 flex-wrap">
                        <Link
                            href="/site/pricing"
                            className="font-label text-xs tracking-widest uppercase bg-ngms-navy text-white px-8 py-3.5 rounded-full hover:bg-ngms-sky transition-colors font-bold"
                        >
                            View Subscriptions
                        </Link>
                        <Link
                            href="/site/contact"
                            className="font-label text-xs tracking-widest uppercase border-2 border-surface-variant text-ngms-navy px-8 py-3.5 rounded-full hover:bg-ngms-navy hover:text-white transition-all font-bold"
                        >
                            Talk to Sales
                        </Link>
                    </div>
                </div>
            </section>
        </PublicSiteLayout>
    );
}
