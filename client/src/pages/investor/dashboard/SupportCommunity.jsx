import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
  FaChevronDown,
} from "react-icons/fa";
import { toast } from "react-toastify";

const FAQS = [
  {
    q: "How do I invest in a project?",
    a: "Browse available projects from the Projects page or your dashboard. Click 'Invest' on any active project, select your unit count, review the summary, and confirm. Your investment is recorded immediately.",
  },
  {
    q: "When will I receive returns?",
    a: "Returns are distributed when a project hits payout milestones. These are communicated in advance via your notification center and email.",
  },
  {
    q: "How do I withdraw my returns?",
    a: "Go to Payouts & Withdrawals, click 'Request Withdrawal', enter your bank details and the amount. Our team processes withdrawals within 2 business days.",
  },
  {
    q: "Can I invest in multiple projects?",
    a: "Yes. There's no limit on the number of projects you can invest in. Diversifying across projects is recommended to spread risk.",
  },
  {
    q: "Is there a minimum investment amount?",
    a: "The minimum depends on the price per unit for each project. This is shown clearly on each project's detail page before you commit.",
  },
  {
    q: "How do I track project progress?",
    a: "Your dashboard shows live project status. Expense breakdowns, sold percentages, and milestones are updated in real time as the project progresses.",
  },
  {
    q: "What happens if a project is delayed?",
    a: "Our team sends updates for any delays. The completion date on the project page is updated accordingly. Your investment remains secure in all cases.",
  },
];

function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border border-black-700 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-black-800 transition-colors"
      >
        <span className="font-bold text-sm pr-4">{q}</span>
        <FaChevronDown
          className={`text-golden-400 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-48" : "max-h-0"}`}
      >
        <p className="px-5 pb-4 font-chivo text-black-300 text-sm leading-relaxed">
          {a}
        </p>
      </div>
    </motion.div>
  );
}

export default function SupportCommunity() {
  const [form, setForm] = useState({ subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Support ticket submitted. We'll respond within 24 hours.");
    setForm({ subject: "", message: "" });
    setSending(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold uppercase mb-1">
          Support & Community
        </h1>
        <p className="font-chivo text-black-400 text-sm">
          Get help, find answers, and connect with our team
        </p>
      </motion.div>

      {/* Contact channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: FaEnvelope,
            label: "Email Support",
            value: "info@estatesindicates.com",
            href: "mailto:info@estatesindicates.com",
            color: "text-golden-300",
          },
          {
            icon: FaPhoneAlt,
            label: "Phone",
            value: "+234 800 000 0000",
            href: "tel:+2348000000000",
            color: "text-blue-400",
          },
          {
            icon: FaWhatsapp,
            label: "WhatsApp",
            value: "Chat with us",
            href: "#",
            color: "text-green-400",
          },
        ].map(({ icon: Icon, label, value, href, color }) => (
          <a
            key={label}
            href={href}
            className="bg-black-800 border border-black-700 rounded-xl p-5 flex items-center gap-4 hover:border-golden-700 transition-colors"
          >
            <Icon className={`text-xl ${color}`} />
            <div>
              <p className="font-chivo text-black-400 text-xs uppercase">
                {label}
              </p>
              <p className="font-bold text-sm">{value}</p>
            </div>
          </a>
        ))}
      </div>

      {/* FAQ */}
      <div>
        <h2 className="font-bold uppercase text-sm tracking-wide mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>

      {/* Support form */}
      <div className="bg-black-800 border border-black-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-black-700">
          <p className="font-bold uppercase text-sm">Submit a Ticket</p>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <label className="block">
            <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1.5">
              Subject
            </p>
            <input
              className="w-full bg-black-900 border border-black-700 rounded-lg px-4 py-3 font-chivo text-sm focus:outline-none focus:border-golden-500 transition-colors"
              placeholder="e.g. Question about my investment"
              value={form.subject}
              onChange={(e) =>
                setForm((p) => ({ ...p, subject: e.target.value }))
              }
              required
            />
          </label>
          <label className="block">
            <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1.5">
              Message
            </p>
            <textarea
              rows={4}
              className="w-full bg-black-900 border border-black-700 rounded-lg px-4 py-3 font-chivo text-sm focus:outline-none focus:border-golden-500 transition-colors resize-none"
              placeholder="Describe your issue or question…"
              value={form.message}
              onChange={(e) =>
                setForm((p) => ({ ...p, message: e.target.value }))
              }
              required
            />
          </label>
          <button
            type="submit"
            disabled={sending}
            className="px-6 py-2.5 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
