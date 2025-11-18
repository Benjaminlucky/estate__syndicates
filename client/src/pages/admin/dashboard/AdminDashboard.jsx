// src/pages/Dashboard.jsx

import DashboardLayout from "./DashboardLayout";
import ReportCard from "./ReportCard";
import StatCard from "./StatCard";

export default function AdminDashboard() {
  return (
    <>
      {/* Top report cards (3 across on md+) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ReportCard
          title="Total Amount Invested"
          value="₦3,755,000"
          className="min-h-56"
        >
          <div className="text-xs text-gray-500 mt-2">
            Sum of all investments made
          </div>
        </ReportCard>

        <ReportCard
          title="Current Portfolio Value"
          value="₦60,768,990"
          className="min-h-56"
        >
          <div className="text-xs text-gray-500 mt-2">
            Realtime value of investment
          </div>
        </ReportCard>

        <ReportCard
          title="Pending Returns / Payouts"
          value="₦8,129,900 (12% ROI)"
          className="min-h-56"
        >
          <div className="text-xs text-gray-500 mt-2">Upcoming ROI</div>
        </ReportCard>
      </div>

      {/* Stat card row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Projects & Investment"
          value="8"
          className="min-h-56"
        />
        <StatCard
          title="Projects Updates & Reports"
          value="—"
          className="bg-[#D8A23A] min-h-56"
        />
        <StatCard
          title="Monthly/Quarterly Financial Statements"
          value="—"
          className="bg-[#C98F18] min-h-56"
        />
        <StatCard
          title="Constructions / Development Milestones"
          value="—"
          className="bg-[#8C6A00] min-h-56"
        />
      </div>

      {/* Bottom brown boxes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-[#4C2600] p-6 min-h-56 text-black font-semibold">
          Operational Expense
        </div>
        <div className="rounded-2xl bg-[#4C2600] p-6 min-h-56 text-black font-semibold">
          Maintenance Cost
        </div>
        <div className="rounded-2xl bg-[#4C2600] p-6 min-h-56 text-black font-semibold">
          Taxes / Legal Fees
        </div>
        <div className="rounded-2xl bg-[#4C2600] p-6 min-h-56 text-black font-semibold">
          Revenue Details
        </div>
      </div>
    </>
  );
}
