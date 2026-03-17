import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LAST_UPDATED = "March 2026";

const sections = [
  {
    title: "1. Introduction",
    body: `Estate Syndicates ("we", "us", or "our") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at estatesindicates.com and our associated services.

Please read this policy carefully. If you disagree with its terms, please discontinue use of our platform.`,
  },
  {
    title: "2. Information We Collect",
    body: `We collect information you provide directly when you:

• Create an account (name, email address, phone number, password)
• Complete your investor profile
• Make or discuss an investment (financial preferences, investment history)
• Contact us via the contact form
• Correspond with our team

We also collect certain information automatically when you use our platform, including your IP address, browser type, pages visited, and access times. We use cookies and similar tracking technologies to improve your experience.`,
  },
  {
    title: "3. How We Use Your Information",
    body: `We use the information we collect to:

• Create and manage your investor account
• Process investment transactions and distribute returns
• Send you project updates, statements, and payout notifications
• Respond to your enquiries and provide customer support
• Comply with legal and regulatory obligations
• Prevent fraudulent activity and protect platform security
• Improve our platform and develop new features

We do not sell, rent, or trade your personal information to third parties for marketing purposes.`,
  },
  {
    title: "4. Sharing Your Information",
    body: `We may share your information with:

• Our team members who need it to provide services (under strict confidentiality)
• Payment processors to facilitate transactions
• Professional advisers (lawyers, accountants) as necessary
• Regulatory and government authorities when required by law
• Service providers who help us operate our platform (hosting, email, analytics) — only to the extent necessary

Any third party we share data with is required to handle it securely and in accordance with applicable law.`,
  },
  {
    title: "5. Data Security",
    body: `We implement industry-standard security measures to protect your personal information, including encrypted storage, secure HTTPS connections, and access controls. Passwords are hashed and never stored in plain text.

However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure. While we take every reasonable precaution, we cannot guarantee absolute security.`,
  },
  {
    title: "6. Data Retention",
    body: `We retain your personal information for as long as your account is active or as needed to provide services. We may also retain certain information as required by law or for legitimate business purposes, such as resolving disputes and enforcing agreements.

You may request deletion of your account and associated data at any time by contacting us at info@estatesindicates.com.`,
  },
  {
    title: "7. Your Rights",
    body: `Subject to applicable law, you have the right to:

• Access the personal information we hold about you
• Correct inaccurate or incomplete information
• Request deletion of your personal data
• Object to or restrict processing of your data
• Receive your data in a portable format
• Withdraw consent where processing is based on consent

To exercise any of these rights, please contact us at info@estatesindicates.com.`,
  },
  {
    title: "8. Cookies",
    body: `We use cookies and similar technologies to maintain your session, remember your preferences, and understand how our platform is used. You can control cookie settings through your browser, but disabling certain cookies may affect platform functionality.`,
  },
  {
    title: "9. Third-Party Links",
    body: `Our platform may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies before sharing any personal information.`,
  },
  {
    title: "10. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on this page with a revised date. Continued use of our platform after changes constitutes your acceptance of the updated policy.`,
  },
  {
    title: "11. Contact Us",
    body: `If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:

Estate Syndicates
Email: info@estatesindicates.com
Website: https://www.estatesindicates.com/reach-us`,
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Estate Syndicates</title>
        <meta
          name="description"
          content="Read the Estate Syndicates Privacy Policy to understand how we collect, use, and protect your personal information."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <main className="w-full bg-black-900 text-white min-h-screen">
        <div className="w-10/12 md:w-7/12 mx-auto py-20 md:py-28">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="font-chivo text-golden-300 uppercase tracking-widest text-sm mb-3">
              Legal
            </p>
            <h1 className="text-3xl md:text-5xl font-bold uppercase mb-4">
              Privacy Policy
            </h1>
            <p className="font-chivo text-black-400 text-sm">
              Last updated: {LAST_UPDATED}
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-golden-900 border border-golden-800 rounded-xl p-6 mb-10 font-chivo text-sm text-black-200 leading-relaxed"
          >
            This policy applies to all users of the Estate Syndicates platform.
            By creating an account or using our services, you acknowledge that
            you have read and understood this Privacy Policy.
          </motion.div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
              >
                <h2 className="font-bold text-lg uppercase mb-3 text-golden-200">
                  {section.title}
                </h2>
                <div className="font-chivo text-black-300 text-sm leading-relaxed whitespace-pre-line">
                  {section.body}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer nav */}
          <div className="mt-16 pt-8 border-t border-black-800 flex flex-wrap gap-4 font-chivo text-sm">
            <Link
              to="/terms"
              className="text-golden-300 hover:text-golden-200 underline underline-offset-2"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              to="/reach-us"
              className="text-golden-300 hover:text-golden-200 underline underline-offset-2"
            >
              Contact Us
            </Link>
            <Link to="/" className="text-black-400 hover:text-white">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
