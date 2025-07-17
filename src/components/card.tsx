import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  contentClassName?: string;
}

export const Card = ({
  className,
  contentClassName,
  children,
  ...props
}: CardProps) => {
  return (
    <div
      className={cn(
        className,
        'relative rounded-lg bg-gray-50 text-card-foreground'
      )}
      {...props}
    >
      <div className={cn(contentClassName, 'relative z-10 p-6')}>
        {children}
      </div>
      <div className="absolute z-0 inset-px rounded-lg bg-white" />
      <div className="pointer-events-none z-0 absolute rounded-lg inset-px shadow-sm ring-1 ring-accent-foreground/5" />
    </div>
  );
};
