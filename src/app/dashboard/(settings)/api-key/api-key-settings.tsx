'use client';

import { Card } from '@/components/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClipboardCopyIcon } from '@radix-ui/react-icons';
import { CheckIcon } from 'lucide-react';
import { useState } from 'react';

export const APIKeySettings = ({ apikey }: { apikey: string }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyAPIKey = () => {
    navigator.clipboard.writeText(apikey);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <Card className="max-w-xl w-full">
      <div>
        <Label>Your API Key</Label>
        <div className="mt-1 relative">
          <Input type="password" value={apikey} readOnly />
          <div className="absolute space-x-0.5 inset-y-0 right-0 flex items-center">
            <Button
              variant={'ghost'}
              onClick={copyAPIKey}
              className="p-1 w-10 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {copySuccess ? (
                <CheckIcon className="size-4 text-accent-foreground" />
              ) : (
                <ClipboardCopyIcon className="size-4 text-accent-foreground" />
              )}
            </Button>
          </div>
        </div>

        <p className="mt-2 text-sm/6 text-gray-600">
          Keep your key secret and do not share it with others.
        </p>
      </div>
    </Card>
  );
};
