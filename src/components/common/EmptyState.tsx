"use client";

import { InboxIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="mb-6 text-slate-300 dark:text-slate-600">
        <InboxIcon className="w-16 h-16" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-8">
        {description}
      </p>
      {actionLabel &&
        (onAction || actionHref) &&
        (onAction ? (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {actionLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            href={actionHref!}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {actionLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        ))}
    </div>
  );
}
