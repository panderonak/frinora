'use client';

import { Modal } from '@/components/modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CATEGORY_NAME_VALIDATOR } from '@/lib/validators/category-validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const EVENT_CATEGORY_VALIDATOR = z.object({
  name: CATEGORY_NAME_VALIDATOR,
  color: z
    .string()
    .min(1, 'Color is required.')
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format.'),
  emoji: z.string().emoji('Invalid emoji.').optional(),
});

type EventCategoryForm = z.infer<typeof EVENT_CATEGORY_VALIDATOR>;

export const CreateEventCategoryModal = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventCategoryForm>({
    resolver: zodResolver(EVENT_CATEGORY_VALIDATOR),
  });

  const onSubmit = (data: EventCategoryForm) => {};

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

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
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. Sign Up"
                className="w-full"
                autoFocus
              />
              {errors.name ? (
                <p className="mt-1 text-red-500">{errors.name.message}</p>
              ) : null}
            </div>

            <div></div>
          </div>
        </form>
      </Modal>
    </>
  );
};
