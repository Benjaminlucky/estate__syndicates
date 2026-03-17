import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LAST_UPDATED = "March 2026";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using the Estate Syndicates platform ("Platform"), creating an investor account, or investing in any project offered through our services, you agree to be bound by these Terms and Conditions ("Terms").

If you do not agree with any part of these Terms, you must not use our Platform. We reserve the right to update these Terms at any time. Continued use of the Platform after changes are posted constitutes acceptance of the revised Terms.`,
  },
  {
    title: "2. About Estate Syndicates",
    body: `Estate Syndicates is a real estate syndication platform that facilitates fractional co-investment in premium real estate development projects in Nigeria. We connect individual investors with curated projects managed by our in-house civil engineering and development team.

Estate Syndicates is not a bank, financial institution, or regulated investment firm. Investments made through our Platform are direct co-ownership arrangements in real estate assets.`,
  },
  {
    title: "3. Eligibility",
    body: `To use our Platform and invest, you must:

• Be at least 18 years of age
• Be a Nigerian resident or otherwise legally permitted to invest in Nigerian real estate
• Provide accurate, current, and complete registration information
• Maintain the security of your account credentials

We reserve the right to refuse service to any person or entity at our discretion.`,
  },
  {
    title: "4. Investment Risks",
    body: `IMPORTANT: Real estate investment involves risk. Before investing, you should carefully consider the following:

• The value of real estate investments can go down as well as up
• Past performance of any project is not indicative of future results
• Returns projected on the Platform are estimates and are not guaranteed
• Liquidity is limited — you may not be able to exit your investment early
• Delays in construction or development timelines may affect projected returns
• Market conditions, regulatory changes, and unforeseen events may impact outcomes

By investing through our Platform, you confirm that you understand and accept these risks. If you are unsure, consult an independent financial adviser before investing.`,
  },
  {
    title: "5. Account Registration",
    body: `When you create an account, you agree to:

• Provide accurate and truthful information
• Keep your account credentials confidential
• Notify us immediately of any unauthorised access to your account
• Be solely responsible for all activity that occurs under your account

We reserve the right to suspend or terminate accounts that provide false information or violate these Terms.`,
  },
  {
    title: "6. Investment Process",
    body: `When you commit to an investment:

• You acknowledge reviewing all project information, including financial projections and risk disclosures
• Your investment is subject to availability of units in the selected project
• Payment must be completed within the timeframe specified at the time of investment
• Ownership rights are established upon receipt of payment and issuance of documentation

Investment commitments become binding upon payment confirmation.`,
  },
  {
    title: "7. Returns and Payouts",
    body: `Returns are distributed on a pro-rata basis relative to your ownership stake in a project. The timing and amount of payouts depend on project performance and milestone completion.

Estate Syndicates will endeavour to communicate payout schedules in advance. However, we do not guarantee specific return amounts or payout dates. Delays may occur due to project timelines, market conditions, or regulatory requirements.`,
  },
  {
    title: "8. Fees",
    body: `Any applicable fees, including management fees or transaction charges, will be clearly disclosed on the relevant project page before you commit to an investment. By investing, you agree to any fees disclosed at the time of your commitment.`,
  },
  {
    title: "9. Intellectual Property",
    body: `All content on the Estate Syndicates Platform — including text, graphics, logos, images, and software — is the property of Estate Syndicates or its licensors and is protected by applicable intellectual property laws.

You may not reproduce, distribute, modify, or create derivative works from any content on our Platform without our prior written consent.`,
  },
  {
    title: "10. Prohibited Activities",
    body: `You agree not to:

• Use the Platform for any unlawful purpose
• Attempt to gain unauthorised access to any part of the Platform or our systems
• Post false, misleading, or fraudulent information
• Interfere with or disrupt the Platform's operation
• Use automated tools to scrape, extract, or collect Platform data
• Impersonate any person or entity`,
  },
  {
    title: "11. Limitation of Liability",
    body: `To the fullest extent permitted by law, Estate Syndicates and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform or any investment made through it.

Our total liability to you for any claim arising from these Terms shall not exceed the amount you paid to us in the three months preceding the claim.`,
  },
  {
    title: "12. Indemnification",
    body: `You agree to indemnify and hold harmless Estate Syndicates and its affiliates from any claims, losses, damages, liabilities, and expenses (including legal fees) arising from your use of the Platform, your investments, or your violation of these Terms.`,
  },
  {
    title: "13. Governing Law",
    body: `These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the Nigerian courts.`,
  },
  {
    title: "14. Contact",
    body: `For questions about these Terms, please contact us at:

Estate Syndicates
Email: info@estatesindicates.com
Website: https://www.estatesindicates.com/reach-us`,
  },
];

export default function TermsAndConditions() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | Estate Syndicates</title>
        <meta
          name="description"
          content="Read the Estate Syndicates Terms and Conditions governing your use of our real estate investment platform."
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
              Terms &amp; Conditions
            </h1>
            <p className="font-chivo text-black-400 text-sm">
              Last updated: {LAST_UPDATED}
            </p>
          </motion.div>

          {/* Risk warning callout */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-golden-900 border border-golden-800 rounded-xl p-6 mb-10 font-chivo text-sm text-black-200 leading-relaxed"
          >
            <span className="font-bold text-golden-300">
              Investment Risk Warning:{" "}
            </span>
            Real estate investment carries risk and the value of your investment
            can fall as well as rise. Returns shown on this platform are
            estimates and not guaranteed. Please read Section 4 carefully before
            investing.
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
              to="/privacy-policy"
              className="text-golden-300 hover:text-golden-200 underline underline-offset-2"
            >
              Privacy Policy
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
