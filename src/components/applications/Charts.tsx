"use client";

import { Application } from "@/types/applications";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface ChartsProps {
  applications: Application[];
}

export default function Charts({ applications }: ChartsProps) {
  // Status distribution
  const statusCounts = {
    applied: applications.filter((a) => a.status === "applied").length,
    interview: applications.filter((a) => a.status === "interview").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    offer: applications.filter((a) => a.status === "offer").length,
  };

  const statusData = [
    { name: "Aplicadas", value: statusCounts.applied, fill: "#3b82f6" },
    { name: "Entrevistas", value: statusCounts.interview, fill: "#f59e0b" },
    { name: "Rechazadas", value: statusCounts.rejected, fill: "#ef4444" },
    { name: "Ofertas", value: statusCounts.offer, fill: "#10b981" },
  ].filter((item) => item.value > 0);

  // Job type distribution
  const jobTypeCounts = {
    "full-time": applications.filter((a) => a.jobType === "full-time").length,
    "part-time": applications.filter((a) => a.jobType === "part-time").length,
    contract: applications.filter((a) => a.jobType === "contract").length,
    freelance: applications.filter((a) => a.jobType === "freelance").length,
  };

  const jobTypeData = [
    { name: "Full-time", value: jobTypeCounts["full-time"] },
    { name: "Part-time", value: jobTypeCounts["part-time"] },
    { name: "Contract", value: jobTypeCounts.contract },
    { name: "Freelance", value: jobTypeCounts.freelance },
  ];

  // Timeline data (by month)
  const timelineData: Record<
    string,
    { applied: number; interview: number; offer: number; rejected: number }
  > = {};

  applications.forEach((app) => {
    const date = new Date(app.dateApplied);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!timelineData[monthKey]) {
      timelineData[monthKey] = {
        applied: 0,
        interview: 0,
        offer: 0,
        rejected: 0,
      };
    }

    if (app.status === "applied") timelineData[monthKey].applied++;
    else if (app.status === "interview") timelineData[monthKey].interview++;
    else if (app.status === "offer") timelineData[monthKey].offer++;
    else if (app.status === "rejected") timelineData[monthKey].rejected++;
  });

  const timelineChartData = Object.entries(timelineData)
    .sort()
    .slice(-6)
    .map(([month, data]) => ({
      month: month.split("-")[1],
      ...data,
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Status Distribution Pie Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg animate-slideInLeft">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          Distribución por Estado
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Job Type Distribution Bar Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg animate-slideInRight">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          Distribución por Tipo de Trabajo
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={jobTypeData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              style={{ fontSize: "0.875rem" }}
            />
            <YAxis stroke="#64748b" style={{ fontSize: "0.875rem" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "#f1f5f9" }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline Chart */}
      {timelineChartData.length > 0 && (
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg animate-slideInUp">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Postulaciones por Mes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={timelineChartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                style={{ fontSize: "0.875rem" }}
              />
              <YAxis stroke="#64748b" style={{ fontSize: "0.875rem" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "0.5rem",
                }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="applied"
                stroke="#3b82f6"
                name="Aplicadas"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="interview"
                stroke="#f59e0b"
                name="Entrevistas"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="offer"
                stroke="#10b981"
                name="Ofertas"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="rejected"
                stroke="#ef4444"
                name="Rechazadas"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
