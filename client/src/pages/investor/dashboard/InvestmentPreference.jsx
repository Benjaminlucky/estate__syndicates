import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const RISK_LEVELS = [
  {
    id: "conservative",
    label: "Conservative",
    desc: "Lower risk, steady returns. Prefer completed or near-completion projects.",
  },
  {
    id: "moderate",
    label: "Moderate",
    desc: "Balanced risk and reward. Open to active development projects.",
  },
  {
    id: "aggressive",
    label: "Aggressive",
    desc: "Higher risk tolerance. Early-stage projects with higher ROI potential.",
  },
];

const DEV_TYPES = [
  "Residential",
  "Commercial",
  "Mixed Use",
  "Industrial",
  "Hospitality",
];
const NOTIF_OPTIONS = [
  "Email notifications",
  "New project alerts",
  "Milestone updates",
  "Payout notifications",
  "Monthly statements",
];

export default function InvestmentPreference() {
  const [risk, setRisk] = useState("moderate");
  const [types, setTypes] = useState(["Residential"]);
  const [minTicket, setMinTicket] = useState("100000");
  const [maxTicket, setMaxTicket] = useState("5000000");
  const [notifs, setNotifs] = useState([
    "Email notifications",
    "Payout notifications",
  ]);
  const [saving, setSaving] = useState(false);

  const toggleType = (t) =>
    setTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  const toggleNotif = (n) =>
    setNotifs((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n],
    );

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    toast.success("Investment preferences saved successfully");
    setSaving(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold uppercase mb-1">
          Investment Preferences
        </h1>
        <p className="font-chivo text-black-400 text-sm">
          Customise how we match and notify you about investment opportunities
        </p>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Risk level */}
        <Section title="Risk Appetite">
          <div className="space-y-3">
            {RISK_LEVELS.map(({ id, label, desc }) => (
              <label
                key={id}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${risk === id ? "border-golden-500 bg-golden-900/20" : "border-black-700 hover:border-black-600"}`}
              >
                <div
                  className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${risk === id ? "border-golden-400" : "border-black-600"}`}
                >
                  {risk === id && (
                    <div className="w-2 h-2 rounded-full bg-golden-400" />
                  )}
                </div>
                <input
                  type="radio"
                  className="sr-only"
                  checked={risk === id}
                  onChange={() => setRisk(id)}
                />
                <div>
                  <p className="font-bold text-sm">{label}</p>
                  <p className="font-chivo text-black-400 text-xs mt-0.5">
                    {desc}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </Section>

        {/* Development types */}
        <Section title="Preferred Development Types">
          <div className="flex flex-wrap gap-2">
            {DEV_TYPES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => toggleType(t)}
                className={`px-4 py-2 rounded-lg font-chivo text-sm font-bold uppercase transition-colors ${types.includes(t) ? "bg-golden-500 text-white" : "bg-black-900 border border-black-700 text-black-300 hover:border-golden-600"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </Section>

        {/* Ticket size */}
        <Section title="Investment Ticket Size (₦)">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1.5">
                Minimum
              </p>
              <input
                type="number"
                min={0}
                className="w-full bg-black-900 border border-black-700 rounded-lg px-4 py-3 font-chivo text-sm focus:outline-none focus:border-golden-500 transition-colors"
                value={minTicket}
                onChange={(e) => setMinTicket(e.target.value)}
              />
            </label>
            <label className="block">
              <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1.5">
                Maximum
              </p>
              <input
                type="number"
                min={0}
                className="w-full bg-black-900 border border-black-700 rounded-lg px-4 py-3 font-chivo text-sm focus:outline-none focus:border-golden-500 transition-colors"
                value={maxTicket}
                onChange={(e) => setMaxTicket(e.target.value)}
              />
            </label>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notification Preferences">
          <div className="space-y-2">
            {NOTIF_OPTIONS.map((n) => (
              <label
                key={n}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${notifs.includes(n) ? "border-golden-600 bg-golden-900/10" : "border-black-700 hover:border-black-600"}`}
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${notifs.includes(n) ? "border-golden-400 bg-golden-400" : "border-black-600"}`}
                >
                  {notifs.includes(n) && (
                    <span className="text-black text-[10px] font-bold">✓</span>
                  )}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={notifs.includes(n)}
                  onChange={() => toggleNotif(n)}
                />
                <span className="font-chivo text-sm">{n}</span>
              </label>
            ))}
          </div>
        </Section>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase rounded-xl transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Preferences"}
        </button>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-black-800 border border-black-700 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-black-700">
        <p className="font-bold uppercase text-sm">{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
