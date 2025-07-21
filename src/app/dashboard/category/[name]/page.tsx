import { DashboardPage } from '@/components/dashboard-page';
import { db } from '@/server/db/db';
import { event } from '@/server/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { CategoryPageContent } from '@/app/dashboard/category/[name]/category-page-content';

interface PageProps {
  params: Promise<{
    name: string | string[] | undefined;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { name } = await params;

  if (typeof name !== 'string') return notFound();
  const auth = await currentUser();

  if (!auth) {
    return notFound();
  }

  const user = await db.query.user.findFirst({
    where: ({ externalId }, { eq }) => eq(externalId, auth.id),
  });

  if (!user) return notFound();

  const category = await db.query.eventCategory.findFirst({
    where: ({ name: categoryName, userId }, { eq, and }) =>
      and(eq(categoryName, name), eq(userId, user.id)),
  });

  if (!category) notFound();

  const count = await db.$count(
    event,
    and(eq(event.eventCategoryId, category.id), eq(event.userId, user.id))
  );

  const hasEvents = count > 0;

  return (
    <DashboardPage title={`${category.emoji} ${category.name} events`}>
      <CategoryPageContent category={category.name} hasEvents={hasEvents} />
    </DashboardPage>
  );
};

export default Page;
