import { Card } from '@/components/ui/card';
import { Icons } from '@/components/icons';

export const Notification = () => {
  return (
    <Card
      role="alert"
      className="relative top-3 h-2 border-none bg-white/60 backdrop-blur-lg transition-all flex items-center justify-center px-2 cursor-pointer"
    >
      <div className="flex w-full items-center justify-start gap-x-2">
        <div className="flex items-center justify-center rounded bg-discord-brand p-1">
          <Icons.discord className="size-5 text-white" />
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-black">Frinora</p>
          <p className="text-xs font-normal">A new notification.</p>
        </div>

        <p className="text-xs text-gray-700">now</p>
      </div>
    </Card>
  );
};
