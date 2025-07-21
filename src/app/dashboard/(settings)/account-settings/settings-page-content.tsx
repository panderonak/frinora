'use client';

import { Card } from '@/components/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { client } from '@/lib/client';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

export const AccountSettings = ({
  discordId: initialDiscordId,
}: {
  discordId: string;
}) => {
  const [discordId, setDiscordId] = useState(initialDiscordId);

  const { mutate, isPending } = useMutation({
    mutationFn: async (discordId: string) => {
      const res = await client.project.setDiscordId.$post({ discordId });
      return await res.json();
    },
  });

  return (
    <Card className="max-w-xl w-full space-y-4">
      <div>
        <Label>Discord ID</Label>
        <Input
          className="mt-1"
          value={discordId}
          onChange={(evt) => setDiscordId(evt.target.value)}
          placeholder="Enter your Discord ID"
        ></Input>
      </div>

      <p className="mt-2 text-sm/6 text-gray-600">
        Don&apos;t know how to find your Discord ID?{' '}
        <Link href={'#'} className="text-brand-deep hover:text-brand-blue">
          Learn how to obtain it here.
        </Link>
      </p>

      <div className="pt-4">
        <Button onClick={() => mutate(discordId)} disabled={isPending}>
          {isPending ? 'Updating' : 'Update'}
        </Button>
      </div>
    </Card>
  );
};
