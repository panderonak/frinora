import { Card } from '@/components/card';
import { CreateEventCategoryModal } from '@/components/create-event-category-modal';
import { Button } from '@/components/ui/button';
import { client } from '@/lib/client';
import { LightningBoltIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';

export const DashboardEmptyState = () => {
  const queryClient = useQueryClient();

  const { mutate: insertQuickStartCategories, isPending } = useMutation({
    mutationFn: async () => {
      await client.category.insertQuickStartCategories.$post();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-event-categories'] });
    },
  });

  return (
    <Card className="flex flex-col items-center justify-center rounded-2xl text-center flex-1 p-6">
      <div className="flex justify-center w-full">
        <img
          src="/brand-asset-wave.png"
          alt="No categories"
          className="size-48 -mt-24"
        />
      </div>

      <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">
        No event categories yet.
      </h1>

      <p className="text-sm/6 text-gray-600 max-w-prose mt-2 mb-8">
        Start tracking events by creating your first category.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button
          variant="outline"
          className="flex items-center space-x-2 w-full sm:w-auto"
          onClick={() => insertQuickStartCategories()}
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-x-1">
              <Loader className="size-4 animate-spin" />
              Creating...
            </span>
          ) : (
            <span className="flex items-center gap-x-1">
              <LightningBoltIcon className="size-4" />
              Quick Start
            </span>
          )}
        </Button>

        <CreateEventCategoryModal containerClassName="w-full sm:w-auto">
          <Button className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="flex items-center gap-x-1">
              <PlusCircledIcon className="size-4" />
              Add Category
            </span>
          </Button>
        </CreateEventCategoryModal>
      </div>
    </Card>
  );
};
