"use client";

import { Button } from "@/components/ui/button";
import { CalendarPlus, ClipboardList, Clock, Users } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    label: "Log Hours",
    description: "Submit timesheet entry",
    icon: ClipboardList,
    href: "/staff/timesheets?action=new",
    color: "from-blue-500 to-indigo-600",
  },
  {
    label: "Browse Shifts",
    description: "Find available shifts",
    icon: CalendarPlus,
    href: "/staff/available-shifts",
    color: "from-emerald-500 to-teal-600",
  },
  {
    label: "My Schedule",
    description: "View your shifts",
    icon: Clock,
    href: "/staff/schedule",
    color: "from-violet-500 to-purple-600",
  },
  {
    label: "Participants",
    description: "View assigned clients",
    icon: Users,
    href: "/staff/participants",
    color: "from-amber-500 to-orange-600",
  },
];

export function QuickActions() {
  return (
    <div className="space-y-3">
      {actions.map((action) => (
        <Link key={action.label} href={action.href}>
          <Button
            variant="ghost"
            className="w-full justify-start h-auto p-3 hover:bg-muted/50 group"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} shadow-md mr-3 group-hover:scale-110 transition-transform`}
            >
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">{action.label}</p>
              <p className="text-xs text-muted-foreground">
                {action.description}
              </p>
            </div>
          </Button>
        </Link>
      ))}
    </div>
  );
}
