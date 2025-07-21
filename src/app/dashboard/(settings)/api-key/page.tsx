import { APIKeySettings } from '@/app/dashboard/(settings)/api-key/api-key-settings';
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
    <DashboardPage title="API Key">
      <APIKeySettings apikey={user.apiKey ?? ''} />
    </DashboardPage>
  );
};

export default Page;
