import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const token = (await supabase.auth.getSession()).data.session?.access_token ?? '';

  // Show onboarding wizard for first-time users
  const onboardingCompleted = user.user_metadata?.onboarding_completed === true;

  return (
    <DashboardClient
      token={token}
      userEmail={user.email ?? ''}
      userId={user.id}
      showOnboarding={!onboardingCompleted}
    />
  );
}
