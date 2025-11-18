import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function StatCard({ title, value, chartData, buttonText, roi }) {
  return (
    <Card className="bg-white watch:w-full dark:bg-black text-black dark:text-white">
      <CardContent className="p-4 space-y-4">
        {/* Title and Button */}
        <div className="flex  justify-between items-center">
          <p className=" font-medium ">{title}</p>
          {buttonText && (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-amber-600"
            >
              {buttonText}
            </Button>
          )}
        </div>

        {/* Value and ROI */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl  font-bold">{value}</h2>
          {roi && (
            <span className="text-sm font-semibold text-amber-600">{roi}</span>
          )}
        </div>

        {/* Chart */}
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  borderRadius: "0.5rem",
                  border: "none",
                  color: "white",
                  fontSize: "0.8rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#lineColor)"
                strokeWidth={2.5}
                dot={{ r: 3, stroke: "#f59e0b", strokeWidth: 1.5 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
