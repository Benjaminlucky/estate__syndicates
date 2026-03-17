import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useInView } from "framer-motion";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaCheckCircle,
} from "react-icons/fa";
import { api } from "../../lib/api.js";

/* ─── Office info ───────────────────────────────────────────────── */
const CONTACT_ITEMS = [
  {
    icon: FaEnvelope,
    label: "Email Us",
    value: "info@estatesindicates.com",
    href: "mailto:info@estatesindicates.com",
  },
  {
    icon: FaPhoneAlt,
    label: "Call Us",
    value: "+234 (0) 800 000 0000",
    href: "tel:+2348000000000",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Our Office",
    value: "Lagos, Nigeria",
    href: null,
  },
];

const SOCIALS = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaTwitter, href: "#", label: "Twitter / X" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
];

const SUBJECTS = [
  "General Enquiry",
  "Investment Question",
  "Partnership Opportunity",
  "Technical Support",
  "Media / Press",
  "Other",
];

/* ─── Form field wrapper ────────────────────────────────────────── */
function Field({ label, required, children }) {
  return (
    <label className="block">
      <p className="font-chivo text-black-300 text-sm mb-2">
        {label}
        {required && <span className="text-golden-400 ml-1">*</span>}
      </p>
      {children}
    </label>
  );
}

const inputCls =
  "w-full bg-black-800 border border-black-700 rounded-lg px-4 py-3 font-chivo text-white text-sm placeholder-black-600 focus:outline-none focus:border-golden-500 transition-colors duration-200";

/* ─── Page ──────────────────────────────────────────────────────── */
export default function Reachus() {
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const formInView = useInView(formRef, { once: true, amount: 0.15 });
  const infoInView = useInView(infoRef, { once: true, amount: 0.2 });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      /* ---------------------------------------------------------
         If you add a contact-form backend route later, call it here:
         await api.post("/api/contact", form);

         For now we simulate a short delay so the UI feels real.
         Replace this block when you wire up the email endpoint.
      --------------------------------------------------------- */
      await new Promise((res) => setTimeout(res, 1200));
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err?.response?.data?.message ||
          "Something went wrong. Please try again or email us directly.",
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Estate Syndicates</title>
        <meta
          name="description"
          content="Get in touch with the Estate Syndicates team. We are happy to answer questions about investing, partnerships, or anything else."
        />
        <meta
          name="keywords"
          content="contact Estate Syndicates, real estate investment enquiry, investor support Nigeria"
        />
        <meta property="og:title" content="Contact Us | Estate Syndicates" />
        <meta
          property="og:url"
          content="https://www.estatesindicates.com/reach-us"
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="w-full bg-black-900 text-white">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="w-full py-24 md:py-32">
          <div className="w-10/12 mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-chivo text-golden-300 uppercase tracking-widest text-sm mb-4"
            >
              Get in Touch
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-6xl font-bold uppercase leading-tight mb-5"
            >
              Reach Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-chivo text-black-300 text-lg max-w-2xl mx-auto"
            >
              Whether you have questions about a project, want to explore a
              partnership, or just need help getting started — we are here.
            </motion.p>
          </div>
        </section>

        {/* ── Main content ─────────────────────────────────── */}
        <section className="w-full pb-24">
          <div className="w-10/12 mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
            {/* Left: contact info + socials */}
            <div className="lg:col-span-2 space-y-10" ref={infoRef}>
              {/* Contact methods */}
              <div className="space-y-6">
                {CONTACT_ITEMS.map((item, i) => {
                  const ContactIcon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={infoInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-12 h-12 rounded-full border border-golden-700 flex items-center justify-center flex-shrink-0">
                        <ContactIcon className="text-golden-300" />
                      </div>
                      <div>
                        <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="font-bold text-base hover:text-golden-300 transition-colors duration-200"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-bold text-base">{item.value}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-black-800" />

              {/* Socials */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={infoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-4">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  {SOCIALS.map((s, i) => {
                    const SocialIcon = s.icon;
                    return (
                      <a
                        key={i}
                        href={s.href}
                        aria-label={s.label}
                        className="w-10 h-10 rounded-full bg-golden-900 border border-golden-700 flex items-center justify-center hover:bg-golden-600 transition-colors duration-200"
                      >
                        <SocialIcon className="text-golden-300 text-sm" />
                      </a>
                    );
                  })}
                </div>
              </motion.div>

              {/* Office hours */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={infoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="bg-black-800 border border-black-700 rounded-xl p-6"
              >
                <p className="font-bold uppercase text-sm mb-4">Office Hours</p>
                <div className="space-y-2 font-chivo text-sm">
                  <div className="flex justify-between">
                    <span className="text-black-400">Monday – Friday</span>
                    <span>9:00 AM – 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black-400">Saturday</span>
                    <span>10:00 AM – 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black-400">Sunday</span>
                    <span className="text-black-500">Closed</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: contact form */}
            <div className="lg:col-span-3" ref={formRef}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={formInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="bg-black-800 border border-black-700 rounded-2xl p-8"
              >
                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center text-center py-12 gap-4"
                  >
                    <FaCheckCircle className="text-green-400 text-5xl" />
                    <h2 className="font-bold text-2xl uppercase">
                      Message Sent!
                    </h2>
                    <p className="font-chivo text-black-300 max-w-sm">
                      Thank you for reaching out. A member of our team will get
                      back to you within one business day.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-4 font-bold uppercase text-sm border border-golden-500 text-golden-300 px-6 py-2 rounded-lg hover:bg-golden-500 hover:text-black-900 transition-colors duration-200"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="font-bold uppercase text-xl mb-6">
                      Send Us a Message
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Full Name" required>
                        <input
                          type="text"
                          className={inputCls}
                          placeholder="Chukwuma Nnebe"
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          required
                        />
                      </Field>
                      <Field label="Email Address" required>
                        <input
                          type="email"
                          className={inputCls}
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          required
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Phone Number">
                        <input
                          type="tel"
                          className={inputCls}
                          placeholder="+234 800 000 0000"
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                        />
                      </Field>
                      <Field label="Subject" required>
                        <select
                          className={inputCls}
                          value={form.subject}
                          onChange={(e) => update("subject", e.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Select a subject…
                          </option>
                          {SUBJECTS.map((s) => (
                            <option key={s} value={s} className="bg-black-800">
                              {s}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <Field label="Message" required>
                      <textarea
                        className={inputCls + " resize-none"}
                        rows={5}
                        placeholder="Tell us how we can help…"
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        required
                      />
                    </Field>

                    {status === "error" && (
                      <p className="text-red-400 text-sm font-chivo">
                        {errorMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full py-4 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === "sending" ? "Sending…" : "Send Message"}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
