"use client";

import { Application } from "@/types/applications";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: "blue" | "green" | "yellow" | "red";
}

const colorClasses = {
  blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  yellow:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
  red: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
};

function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div
      className={`p-6 rounded-lg ${colorClasses[color]} border-2 ${
        {
          blue: "border-blue-200 dark:border-blue-700",
          green: "border-green-200 dark:border-green-700",
          yellow: "border-yellow-200 dark:border-yellow-700",
          red: "border-red-200 dark:border-red-700",
        }[color]
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <StatsCard
        title="Total de postulaciones"
        value={total}
        icon="📋"
        color="blue"
      />
      <StatsCard title="Aplicadas" value={applied} icon="✅" color="blue" />
      <StatsCard
        title="En entrevista"
        value={interviews}
        icon="👤"
        color="yellow"
      />
      <StatsCard title="Ofertas" value={offers} icon="🎉" color="green" />
      <StatsCard title="Rechazadas" value={rejected} icon="❌" color="red" />
      <StatsCard
        title="Tasa de respuesta"
        value={`${responseRate}%`}
        icon="📊"
        color="green"
      />
    </div>
  );
}
