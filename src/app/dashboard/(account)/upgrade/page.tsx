import { DashboardPage } from '@/components/dashboard-page';
import { db } from '@/server/db/db';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UpgradePageContent } from '@/app/dashboard/(account)/upgrade/upgrade-page-content';

const Page = async () => {
  const auth = await currentUser();

  if (!auth) return redirect('/sign-in');

  const user = await db.query.user.findFirst({
    where: ({ externalId }, { eq }) => eq(externalId, auth.id),
  });

  if (!user) redirect('/sign-in');

  return (
    <DashboardPage title="Pro Membership">
      <UpgradePageContent plan={user.plan} />
    </DashboardPage>
  );
};

export default Page;
