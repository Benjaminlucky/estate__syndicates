"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatCard({ title, value, chart, className }) {
  return (
    <Card
      className={cn(
        "bg-[#F5F0E8] border-none rounded-2xl shadow-md p-0 overflow-hidden",
        className
      )}
    >
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-sm text-gray-700">{title}</CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <p className="text-2xl font-bold">{value}</p>

        {/* chart passed as JSX */}
        <div className="mt-3">{chart}</div>
      </CardContent>
    </Card>
  );
}
