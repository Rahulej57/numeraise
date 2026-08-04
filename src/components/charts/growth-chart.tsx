'use client';

import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/layout/skeletons';

/**
 * Dynamic wrapper around the Recharts implementation.
 *
 * Recharts was imported eagerly by twelve calculator pages, so its bundle sat in
 * the critical path for the initial render even though the chart is below the
 * fold and the headline result number is not waiting on it. Deferring it lets
 * the inputs and results paint first, which is what the visitor actually came
 * for.
 *
 * `ssr: false` because Recharts measures the DOM to size itself; rendering it on
 * the server produces markup the client immediately discards. The skeleton
 * reserves the exact chart height, so nothing shifts when the real chart
 * arrives (no CLS penalty).
 *
 * The filename is unchanged deliberately — all twelve import sites keep working
 * without modification.
 */
export const GrowthChart = dynamic(
  () => import('./growth-chart-impl').then((m) => m.GrowthChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
