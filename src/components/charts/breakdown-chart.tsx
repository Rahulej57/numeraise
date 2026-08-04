'use client';

import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/layout/skeletons';

/**
 * Dynamic wrapper around the Recharts implementation. See growth-chart.tsx for
 * the full reasoning; same trade-off applies.
 */
export const BreakdownChart = dynamic(
  () => import('./breakdown-chart-impl').then((m) => m.BreakdownChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
