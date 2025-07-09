import { DashboardPage } from '@/components/dashboard-page';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardPageContent } from '@/app/dashboard/dashboard-page-content';
import { CreateEventCategoryModal } from '@/components/create-event-category-modal';
import { Button } from '@/components/ui/button';
import { PlusCircledIcon } from '@radix-ui/react-icons';

const Page = async () => {
  const auth = await currentUser();

  if (!auth) {
    redirect('/sign-in');
  }

  // TODO: Check for user in database.

  return (
    <DashboardPage
      title="Dashboard"
      cta={
        <CreateEventCategoryModal>
          <Button>
            <PlusCircledIcon className="size-4 mr-2" />
            Add Category
          </Button>
        </CreateEventCategoryModal>
      }
    >
      <DashboardPageContent />
    </DashboardPage>
  );
};

export default Page;
