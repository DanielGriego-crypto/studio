'use client';

import * as React from 'react';
import Link from 'next/link';
import { getDivision, getDivisionProgress, DIVISIONS } from '@/lib/caissa/divisions';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface DivisionIndicatorProps {
  balance: number;
}

export function DivisionIndicator({ balance }: DivisionIndicatorProps) {
  const division = getDivision(balance);
  const progress = getDivisionProgress(balance);
  const { Icon } = division;

  const nextDivision = DIVISIONS[DIVISIONS.indexOf(division) + 1];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm p-4 z-40 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]">
      <Link href="/league" passHref>
        <div className={cn(
          "bg-black/70 backdrop-blur-md border border-primary/20 p-2 rounded-xl shadow-lg shadow-primary/10",
          "transition-all duration-300 hover:border-primary/40 hover:shadow-primary/20 cursor-pointer"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary/30 to-primary/10 rounded-md border border-primary/20">
              <Icon className="w-6 h-6 text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline mb-0.5">
                <p className="font-headline text-base text-primary">{division.name}</p>
                {nextDivision && (
                   <p className="text-[10px] text-muted-foreground">Next: {nextDivision.name}</p>
                )}
              </div>
              <Progress value={progress} className="h-1.5 bg-primary/20 [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-primary" />
              <div className="flex justify-between items-center mt-0.5 text-[10px] text-muted-foreground">
                  <span>{division.minBalance > 0 ? division.minBalance.toLocaleString() : 0}</span>
                  {division.maxBalance !== Infinity && (
                      <span>{division.maxBalance.toLocaleString()}</span>
                  )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
