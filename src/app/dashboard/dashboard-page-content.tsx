'use client';

import { LoadingSpinner } from '@/components/loading-spinner';
import { Modal } from '@/components/modal';
import { Button, buttonVariants } from '@/components/ui/button';
import { client } from '@/lib/client';
import { ArrowRightIcon, BarChartIcon, ClockIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import { DatabaseIcon, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const DashboardPageContent = () => {
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: categories, isPending } = useQuery({
    queryKey: ['user-event-categories'],
    queryFn: async () => {
      const res = await client.category.getEventCategories.$get();
      const { categories } = await res.json();
      return categories;
    },
  });

  const { mutate: deleteCategory, isPending: isDeletingCategory } = useMutation(
    {
      mutationFn: async (name: string) => {
        await client.category.deleteCategory.$post({ name });
      },

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user-event-categories'] });
        setDeletingCategory(null);
      },
    }
  );

  if (isPending) {
    return (
      <div className="flex items-center justify-center flex-1 h-full w-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (!categories || categories.length === 0) return <div>Empty</div>;

  return (
    <>
      <ul className="grid max-w-6xl grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((category) => (
          <li
            key={category.id}
            className="relative group z-10 transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="absolute z-0 inset-px rounded-md bg-[#fff]" />

            <div className="pointer-events-none z-0 absolute inset-px rounded-md shadow-sm transition-all duration-300 group-hover:shadow-md ring-1 ring-black/5" />
            <div className="relative p-6 z-10">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="size-12 rounded-full"
                  style={{
                    backgroundColor: category.color
                      ? `#${category.color.toString(16).padStart(6, '0')}`
                      : '#f3f4f6',
                  }}
                />

                <div>
                  <h3 className="text-lg/7 font-medium tracking-tight text-gray-950">
                    {category.emoji || '📁'}
                    {category.name}
                  </h3>

                  <p className="text-sm/6 text-gray-600">
                    {format(
                      category?.createdAt ? category?.createdAt : Date.now(),
                      'MMM d, yyyy'
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm/5 text-gray-600">
                  <ClockIcon className="size-4 mr-2 text-brand-blue" />
                  <span className="font-medium"> Last Ping</span>
                  <span className="ml-1">
                    {category.lastPing
                      ? formatDistanceToNow(category.lastPing) + ' ago'
                      : 'Never'}
                  </span>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm/5 text-gray-600">
                  <ClockIcon className="size-4 mr-2 text-brand-blue" />
                  <span className="font-medium">Last Ping</span>
                  <span className="ml-1">
                    {category.lastPing
                      ? formatDistanceToNow(category.lastPing) + ' ago'
                      : 'Never'}
                  </span>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm/5 text-gray-600">
                  <DatabaseIcon className="size-4 mr-2 text-brand-blue" />
                  <span className="font-medium">Unique Fields</span>
                  <span className="ml-1">{category.uniqueFieldCount || 0}</span>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm/5 text-gray-600">
                  <BarChartIcon className="size-4 mr-2 text-brand-blue" />
                  <span className="font-medium">Events this month:</span>
                  <span className="ml-1">{category.eventsCount || 0}</span>
                </div>
              </div>

              <div className="flex items-center justify-center mt-4">
                <Link
                  href={`/dashboard/category/${category.name}`}
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'sm',
                    className: 'flex items-center gap-2 text-sm',
                  })}
                >
                  View all <ArrowRightIcon className="size-4" />
                </Link>

                <Button
                  variant={'ghost'}
                  size="sm"
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  aria-label={`Delete ${category.name} category`}
                  onClick={() => setDeletingCategory(category.name)}
                >
                  <Trash2 className="size-5" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        showModal={!!deletingCategory}
        setShowModal={() => setDeletingCategory(null)}
        className="max-w-md p-8"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
              Delete Category
            </h2>
            <p className="text-sm/6 text-gray-600">
              Are you sure you want to delete the category &quot;
              {deletingCategory}&quot;? This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setDeletingCategory(null)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() =>
                deletingCategory && deleteCategory(deletingCategory)
              }
              disabled={isDeletingCategory}
            >
              {isDeletingCategory ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
