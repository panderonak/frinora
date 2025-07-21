import { DashboardPageContent } from '@/app/dashboard/dashboard-page-content';
import { CreateEventCategoryModal } from '@/components/create-event-category-modal';
import { DashboardPage } from '@/components/dashboard-page';
import { PaymentSuccessModal } from '@/components/payment-success-modal';
import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '@/lib/stripe';
import { db } from '@/server/db/db';
import { currentUser } from '@clerk/nextjs/server';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { intent, success } = await searchParams;

  const auth = await currentUser();

  if (!auth) {
    redirect('/sign-in');
  }

  const user = await db.query.user.findFirst({
    where: ({ externalId }, { eq }) => eq(externalId, auth.id),
  });

  if (!user) {
    redirect('/welcome');
  }

  if (intent === 'upgrade') {
    const session = await createCheckoutSession({
      userEmail: user.email,
      userId: user.id,
    });

    if (session.url) redirect(session.url);
  }

  return (
    <>
      {success ? <PaymentSuccessModal /> : null}

      <DashboardPage
        title="Dashboard"
        cta={
          <CreateEventCategoryModal>
            <Button className="w-full sm:w-fit">
              <PlusCircledIcon className="size-4" />
              Add Category
            </Button>
          </CreateEventCategoryModal>
        }
      >
        <DashboardPageContent />
      </DashboardPage>
    </>
  );
};

export default Page;
