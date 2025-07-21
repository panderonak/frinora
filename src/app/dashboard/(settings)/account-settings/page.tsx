import { AccountSettings } from '@/app/dashboard/(settings)/account-settings/settings-page-content';
import { DashboardPage } from '@/components/dashboard-page';
import { db } from '@/server/db/db';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const Page = async () => {
  const auth = await currentUser();

  if (!auth) return redirect('/sign-in');

  const user = await db.query.user.findFirst({
    where: ({ externalId }, { eq }) => eq(externalId, auth.id),
  });

  if (!user) redirect('/sign-in');

  return (
    <DashboardPage title="Account Settings">
      <AccountSettings discordId={user.discordId ?? ''} />
    </DashboardPage>
  );
};

export default Page;
