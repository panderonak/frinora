'use client';

import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { client } from '@/lib/client';
import { cn } from '@/lib/utils';
import { CATEGORY_NAME_VALIDATOR } from '@/lib/validators/category-validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const EVENT_CATEGORY_VALIDATOR = z.object({
  name: CATEGORY_NAME_VALIDATOR,
  color: z
    .string()
    .min(1, 'Color is required.')
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format.'),
  emoji: z.string().emoji('Invalid emoji.').optional(),
});

type EventCategoryForm = z.infer<typeof EVENT_CATEGORY_VALIDATOR>;

const COLOR_OPTIONS = [
  '#FF6B6B', // bg-[#FF6B6B] ring-[#FF6B6B] Bright Red
  '#4ECDC4', // bg-[#4ECDC4] ring-[#4ECDC4] Teal
  '#45B7D1', // bg-[#45B7D1] ring-[#45B7D1] Sky Blue
  '#FFA07A', // bg-[#FFA07A] ring-[#FFA07A] Light Salmon
  '#98D8C8', // bg-[#98D8C8] ring-[#98D8C8] Seafoam Green
  '#FDCB6E', // bg-[#FDCB6E] ring-[#FDCB6E] Mustard Yellow
  '#6C5CE7', // bg-[#6C5CE7] ring-[#6C5CE7] Soft Purple
  '#FF85A2', // bg-[#FF85A2] ring-[#FF85A2] Pink
  '#2ECC71', // bg-[#2ECC71] ring-[#2ECC71] Emerald Green
  '#E17055', // bg-[#E17055] ring-[#E17055] Terracotta
];

const EMOJI_OPTIONS = [
  { emoji: '💰', label: 'Money (Sale)' },
  { emoji: '👤', label: 'User (Sign-up)' },
  { emoji: '🎉', label: 'Celebration' },
  { emoji: '📅', label: 'Calendar' },
  { emoji: '🚀', label: 'Launch' },
  { emoji: '📢', label: 'Announcement' },
  { emoji: '🎓', label: 'Graduation' },
  { emoji: '🏆', label: 'Achievement' },
  { emoji: '💡', label: 'Idea' },
  { emoji: '🔔', label: 'Notification' },
];

interface CreateEventCategoryModal extends PropsWithChildren {
  containerClassName?: string;
}

export const CreateEventCategoryModal = ({
  children,
  containerClassName,
}: CreateEventCategoryModal) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: createEventCategory, isPending } = useMutation({
    mutationFn: async (data: EventCategoryForm) => {
      await client.category.createEventCategory.$post(data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-event-categories'] });
      setIsOpen(false);
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<EventCategoryForm>({
    resolver: zodResolver(EVENT_CATEGORY_VALIDATOR),
  });

  const color = watch('color');

  const selectedEmoji = watch('emoji');

  const onSubmit = (data: EventCategoryForm) => createEventCategory(data);

  return (
    <>
      <div className={containerClassName} onClick={() => setIsOpen(true)}>
        {children}
      </div>

      <Modal
        showModal={isOpen}
        setShowModal={setIsOpen}
        className="max-w-xl p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
              New Event Category
            </h2>
            <p className="text-sm/6 text-gray-600">
              Create a new category to organise your events.
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g. Sign Up"
                className="w-full"
                autoFocus
              />
              {errors.name ? (
                <p className="mt-1 text-red-500">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-3">
                {COLOR_OPTIONS.map((premadeColor) => (
                  <button
                    key={premadeColor}
                    type="button"
                    className={cn(
                      `bg-[${premadeColor}]`,
                      'size-10 rounded-full ring-2 ring-offset-2 transition-all',
                      color === premadeColor
                        ? 'ring-brand-indigo scale-110'
                        : 'ring-transparent hover:scale-105'
                    )}
                    onClick={() => setValue('color', premadeColor)}
                  ></button>
                ))}
              </div>
              {errors.color ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.color.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>Emoji</Label>
              <div className="flex flex-wrap gap-3">
                {EMOJI_OPTIONS.map(({ emoji, label }) => (
                  <button
                    key={label}
                    type="button"
                    className={cn(
                      'size-10 flex items-center justify-center text-xl rounded-md transition-all',
                      selectedEmoji === emoji
                        ? 'bg-brand-frost ring-2 ring-brand-indigo scale-110'
                        : 'bg-brand-frost hover:bg-brand-mist hover:scale-105'
                    )}
                    onClick={() => setValue('emoji', emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {errors.color ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.color.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant={'outline'}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              type="submit"
              onClick={() => setIsOpen(false)}
            >
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
