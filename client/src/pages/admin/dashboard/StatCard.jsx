// src/components/dashboard/StatCard.jsx
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { cn } from "../../../lib/utils";

export default function StatCard({ title, value, className, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={cn("w-full")}
    >
      <Card
        className={cn(
          "bg-[#F7B500] border-none rounded-2xl shadow-md overflow-hidden",
          className
        )}
      >
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-black text-xl">{title}</CardTitle>
        </CardHeader>

        <CardContent className="p-6 pt-2">
          <p className="text-4xl font-extrabold text-black">{value}</p>
          {children && <div className="mt-4">{children}</div>}
        </CardContent>
      </Card>
    </motion.div>
  );
}
