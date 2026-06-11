import { notFound } from 'next/navigation';
import { getComparisonConfig } from '@/lib/comparison-engine';
import { ScenarioClient } from '@/components/compare/scenario-client';

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const config = getComparisonConfig(resolvedParams.slug);

  if (!config) {
    notFound();
  }

  return <ScenarioClient slug={resolvedParams.slug} />;
}
