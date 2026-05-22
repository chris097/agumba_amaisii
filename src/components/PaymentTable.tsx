"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Member } from "@/lib/data";

interface PaymentTableProps {
  members: Member[];
  isPaid: boolean;
  title: string;
}

export default function PaymentTable({ members, isPaid, title }: PaymentTableProps) {
  if (members.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h3 className="text-xl font-bold text-black-900 mb-6 flex items-center">
        {isPaid ? (
          <CheckCircle2 className="w-6 h-6 text-green-500 mr-2" />
        ) : (
          <XCircle className="w-6 h-6 text-red-500 mr-2" />
        )}
        {title} ({members.length})
      </h3>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-black-100">Member Name</th>
                <th className="py-4 px-6 font-semibold text-black-100">Reg. Number</th>
                <th className="py-4 px-6 font-semibold text-black-100">Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-50 last:border-0 hover:bg-peach-100/20 transition-colors"
                >
                  <td className="py-4 px-6 font-medium text-black-900">
                    {member.name}
                  </td>
                  <td className="py-4 px-6 text-black-100/70 font-mono text-sm">
                    {member.regNumber}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isPaid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
