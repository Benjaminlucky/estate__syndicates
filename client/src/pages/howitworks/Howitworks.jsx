import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaUserPlus,
  FaSearch,
  FaHandshake,
  FaChartLine,
  FaShieldAlt,
  FaFileContract,
  FaMoneyBillWave,
  FaRegLightbulb,
  FaCheckCircle,
} from "react-icons/fa";

/* ─── Step data ─────────────────────────────────────────────────── */
const steps = [
  {
    number: "01",
    icon: FaUserPlus,
    title: "Create Your Account",
    description:
      "Sign up in minutes. Provide your basic details and complete a simple verification process to unlock access to all available investment opportunities.",
    details: [
      "Fill in your personal details",
      "Verify your email address",
      "Complete your investor profile",
    ],
  },
  {
    number: "02",
    icon: FaSearch,
    title: "Explore Projects",
    description:
      "Browse our curated portfolio of premium real estate projects. Every listing includes full financial projections, location analysis, and development timelines.",
    details: [
      "View detailed project breakdowns",
      "Analyse ROI and IRR projections",
      "Review the development timeline",
    ],
  },
  {
    number: "03",
    icon: FaHandshake,
    title: "Invest Your Capital",
    description:
      "Choose the project that matches your goals and commit your investment. Select the number of units you want to own — minimum entry points start low.",
    details: [
      "Select your unit count",
      "Review your investment summary",
      "Confirm and fund securely",
    ],
  },
  {
    number: "04",
    icon: FaChartLine,
    title: "Track & Earn",
    description:
      "Monitor your portfolio in real time. Watch your investment grow as the project progresses, and receive your pro-rata returns when milestones are hit.",
    details: [
      "Live portfolio dashboard",
      "Expense and milestone updates",
      "Automatic payout distribution",
    ],
  },
];

/* ─── FAQ data ──────────────────────────────────────────────────── */
const faqs = [
  {
    q: "What is the minimum investment amount?",
    a: "Entry points vary per project and are clearly displayed on each listing. Our fractional ownership model is designed to make real estate accessible at every level.",
  },
  {
    q: "How are returns calculated?",
    a: "Returns are distributed pro-rata based on your ownership stake. The projected ROI and IRR for each project are shown upfront before you invest.",
  },
  {
    q: "How do I receive my payouts?",
    a: "Once a project reaches a payout milestone, your returns are deposited directly to your registered bank account. You can track all disbursements from your dashboard.",
  },
  {
    q: "Is my investment secure?",
    a: "Every project is legally structured with full documentation. All investments are backed by real physical assets — the land and buildings themselves — giving you tangible security.",
  },
  {
    q: "Can I withdraw early?",
    a: "Real estate is a medium-to-long-term investment. Early exit options depend on individual project terms and are outlined in the project documentation before you commit.",
  },
  {
    q: "Who manages the projects?",
    a: "Our founder is a practising civil engineer with years of hands-on development experience. Every project is managed directly by our in-house team, not outsourced.",
  },
];

/* ─── Trust indicators ──────────────────────────────────────────── */
const trustItems = [
  {
    icon: FaShieldAlt,
    label: "Legally Structured",
    sub: "Full documentation on every deal",
  },
  {
    icon: FaFileContract,
    label: "Transparent Reporting",
    sub: "Full expense visibility always",
  },
  {
    icon: FaMoneyBillWave,
    label: "Pro-rata Returns",
    sub: "Your stake, your earnings",
  },
  {
    icon: FaRegLightbulb,
    label: "Expert-led Projects",
    sub: "Civil engineer at the helm",
  },
];

/* ─── FAQ Item ──────────────────────────────────────────────────── */
function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="border border-black-700 rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-black-800 transition-colors duration-200"
      >
        <span className="font-bold text-base md:text-lg pr-4">{q}</span>
        <span
          className={`text-golden-300 text-xl flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-48" : "max-h-0"
        }`}
      >
        <p className="px-6 pb-5 font-chivo text-black-300 leading-relaxed">
          {a}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function Howitworks() {
  const heroRef = useRef(null);
  const stepsRef = useRef(null);
  const trustRef = useRef(null);
  const faqRef = useRef(null);

  const stepsInView = useInView(stepsRef, { once: true, amount: 0.1 });
  const trustInView = useInView(trustRef, { once: true, amount: 0.2 });
  const faqInView = useInView(faqRef, { once: true, amount: 0.1 });

  return (
    <>
      <Helmet>
        <title>How It Works | Estate Syndicates</title>
        <meta
          name="description"
          content="Learn how to invest in premium Nigerian real estate with Estate Syndicates. Four simple steps from sign-up to earning returns on your portfolio."
        />
        <meta
          name="keywords"
          content="how to invest real estate Nigeria, fractional ownership, syndicate investment, Estate Syndicates process"
        />
        <meta property="og:title" content="How It Works | Estate Syndicates" />
        <meta
          property="og:description"
          content="Four simple steps to co-own premium real estate and earn pro-rata returns with Estate Syndicates."
        />
        <meta
          property="og:url"
          content="https://www.estatesindicates.com/how-it-works"
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="w-full bg-black-900 text-white">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="w-full py-24 md:py-36" ref={heroRef}>
          <div className="w-10/12 mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-chivo text-golden-300 uppercase tracking-widest text-sm mb-4"
            >
              The Process
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl md:text-6xl font-bold uppercase leading-tight mb-6"
            >
              Invest in 4 Simple Steps
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-chivo text-black-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              We have simplified real estate investment into a transparent,
              accessible process. From sign-up to earning returns — here is
              exactly how it works.
            </motion.p>
          </div>
        </section>

        {/* ── Steps ────────────────────────────────────────── */}
        <section className="w-full pb-24 md:pb-32" ref={stepsRef}>
          <div className="w-10/12 mx-auto">
            <div className="relative">
              {/* Vertical connector line — desktop only */}
              <div className="hidden md:block absolute left-[3.25rem] top-12 bottom-12 w-px bg-golden-800" />

              <div className="flex flex-col gap-12 md:gap-16">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -40 }}
                    animate={stepsInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    className="flex flex-col md:flex-row gap-6 md:gap-12 items-start"
                  >
                    {/* Icon circle — capitalize so React treats it as a component */}
                    {(() => {
                      const StepIcon = step.icon;
                      return (
                        <div className="flex-shrink-0 w-24 h-24 rounded-full border-2 border-golden-300 flex flex-col items-center justify-center bg-black-900 relative z-10">
                          <StepIcon className="text-golden-300 text-2xl mb-1" />
                          <span className="font-chivo text-xs text-black-400">
                            {step.number}
                          </span>
                        </div>
                      );
                    })()}

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <h2 className="text-xl md:text-3xl font-bold uppercase mb-3">
                        {step.title}
                      </h2>
                      <p className="font-chivo text-black-300 text-base md:text-lg leading-relaxed mb-5 max-w-2xl">
                        {step.description}
                      </p>
                      <ul className="flex flex-col gap-2">
                        {step.details.map((d, j) => (
                          <li
                            key={j}
                            className="flex items-center gap-3 font-chivo text-sm text-black-200"
                          >
                            <FaCheckCircle className="text-golden-400 flex-shrink-0 text-xs" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust indicators ─────────────────────────────── */}
        <section className="w-full bg-golden-900 py-16" ref={trustRef}>
          <div className="w-10/12 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={trustInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-4xl font-bold uppercase mb-3">
                Why Investors Trust Us
              </h2>
              <p className="font-chivo text-black-300">
                Every step of the process is designed around your security and
                transparency.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {trustItems.map((item, i) => {
                const TrustIcon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={trustInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex flex-col items-center text-center gap-3"
                  >
                    <div className="w-16 h-16 rounded-full border border-golden-500 flex items-center justify-center">
                      <TrustIcon className="text-golden-300 text-2xl" />
                    </div>
                    <p className="font-bold uppercase text-sm">{item.label}</p>
                    <p className="font-chivo text-black-400 text-sm">
                      {item.sub}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="w-full py-24" ref={faqRef}>
          <div className="w-10/12 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-4xl font-bold uppercase mb-3">
                Frequently Asked Questions
              </h2>
              <p className="font-chivo text-black-300 max-w-xl mx-auto">
                Everything you need to know before making your first investment.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="w-full pb-24">
          <div className="w-10/12 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl md:text-4xl font-bold uppercase mb-4">
                Ready to Get Started?
              </h2>
              <p className="font-chivo text-black-300 mb-8 max-w-xl mx-auto">
                Join thousands of investors already building wealth through
                fractional real estate ownership.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="py-4 px-10 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase rounded-lg transition-colors duration-200"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/projects"
                  className="py-4 px-10 border-2 border-golden-300 hover:bg-golden-300 hover:text-black-900 font-bold uppercase rounded-lg transition-colors duration-200"
                >
                  Browse Projects
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
