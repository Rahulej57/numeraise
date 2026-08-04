import { PageSkeleton } from '@/components/layout/skeletons';

/**
 * Fallback for every route in the (main) group that has no closer loading.tsx —
 * blog, glossary, compare, author and the legal pages.
 */
export default function Loading() {
  return <PageSkeleton />;
}
