// src/components/dashboard/ReportCard.jsx

import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { cn } from "../../../lib/utils";

export default function ReportCard({ title, value, children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Card
        className={cn("bg-white text-black rounded-2xl shadow p-0", className)}
      >
        <CardHeader className="p-4">
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-2xl font-bold">{value}</p>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
