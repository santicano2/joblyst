"use client";

import { Application } from "@/types/applications";
import { isInterviewSoon } from "@/utils/interviewUtils";
import {
  Clipboard,
  CheckCircle,
  User,
  Bell,
  Star,
  Gift,
  XCircle,
  TrendingUp,
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "red";
}

const colorClasses = {
  blue: "bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200",
  green: "bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200",
  yellow:
    "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200",
  red: "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200",
};

function StatsCard({ title, value, icon, color }: StatsCardProps) {
  const iconColors = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    red: "text-red-600 dark:text-red-400",
  };

  return (
    <div
      className={`p-6 rounded-lg ${colorClasses[color]} border-2 ${
        {
          blue: "border-blue-300 dark:border-blue-700",
          green: "border-green-300 dark:border-green-700",
          yellow: "border-yellow-300 dark:border-yellow-700",
          red: "border-red-300 dark:border-red-700",
        }[color]
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={iconColors[color]}>{icon}</div>
      </div>
    </div>
  );
}

interface StatsOverviewProps {
  applications: Application[];
}

export default function StatsOverview({ applications }: StatsOverviewProps) {
  const total = applications.length;
  const applied = applications.filter((a) => a.status === "applied").length;
  const interviews = applications.filter(
    (a) => a.status === "interview"
  ).length;
  const offers = applications.filter((a) => a.status === "offer").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;

  const responseRate =
    total > 0
      ? Math.round(((interviews + offers + rejected) / total) * 100)
      : 0;

  const upcomingInterviews = applications.filter((a) =>
    isInterviewSoon(a.interviewDate)
  ).length;

  const favorites = applications.filter((a) => a.isFavorite).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard
        title="Total de postulaciones"
        value={total}
        icon={<Clipboard className="w-8 h-8" />}
        color="blue"
      />
      <StatsCard
        title="Aplicadas"
        value={applied}
        icon={<CheckCircle className="w-8 h-8" />}
        color="blue"
      />
      <StatsCard
        title="En entrevista"
        value={interviews}
        icon={<User className="w-8 h-8" />}
        color="yellow"
      />
      <StatsCard
        title="Próximas entrevistas"
        value={upcomingInterviews}
        icon={<Bell className="w-8 h-8" />}
        color={upcomingInterviews > 0 ? "red" : "blue"}
      />
      <StatsCard
        title="Favoritos"
        value={favorites}
        icon={<Star className="w-8 h-8" fill="currentColor" />}
        color={favorites > 0 ? "yellow" : "blue"}
      />
      <StatsCard
        title="Ofertas"
        value={offers}
        icon={<Gift className="w-8 h-8" />}
        color="green"
      />
      <StatsCard
        title="Rechazadas"
        value={rejected}
        icon={<XCircle className="w-8 h-8" />}
        color="red"
      />
      <StatsCard
        title="Tasa de respuesta"
        value={`${responseRate}%`}
        icon={<TrendingUp className="w-8 h-8" />}
        color="green"
      />
    </div>
  );
}
