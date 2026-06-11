import { redirect } from 'next/navigation';

export default function CompareRootPage() {
  // Redirect to the financial calculators hub since we don't have a dedicated compare hub yet
  redirect('/financial-calculators');
}
