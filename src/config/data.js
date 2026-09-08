import { Droplet, Zap } from "lucide-react";

// Client references per utility. Wire these to Firebase later if they vary per user.
export const BILLS = {
  water: { key: "water", ref: "25021561246" },
  electricity: { key: "electricity", ref: "25021550900" },
};

// Meaningful accent per utility: water = cyan, electricity = amber.
export const THEME = {
  water: {
    icon: Droplet,
    grad: "from-cyan-500 to-blue-600",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    btn: "bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/30",
    glow: "rgba(6,182,212,0.20)",
  },
  electricity: {
    icon: Zap,
    grad: "from-amber-500 to-orange-600",
    text: "text-amber-400",
    border: "border-amber-500/30",
    btn: "bg-amber-500 hover:bg-amber-400 shadow-amber-500/30",
    glow: "rgba(245,158,11,0.20)",
  },
};

// The number JIRAMA subscribers call to declare their meter index.
export const INDEX_CALL_NUMBER = "547";
