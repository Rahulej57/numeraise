import { CalculatorSkeleton } from '@/components/layout/skeletons';

/**
 * Shown while any /calculators route resolves, including nested ones.
 *
 * A loading.tsx wraps its segment and everything nested beneath it in a
 * Suspense boundary, so this covers /calculators, /calculators/[slug] and
 * /calculators/category/[category] without needing a file in each.
 */
export default function Loading() {
  return <CalculatorSkeleton />;
}
