'use client';

import * as React from 'react';
import { getDivision, getDivisionProgress, DIVISIONS } from '@/lib/caissa/divisions';
import { Progress } from '@/components/ui/progress';

interface DivisionIndicatorProps {
  balance: number;
}

export function DivisionIndicator({ balance }: DivisionIndicatorProps) {
  const division = getDivision(balance);
  const progress = getDivisionProgress(balance);
  const { Icon } = division;

  const nextDivision = DIVISIONS[DIVISIONS.indexOf(division) + 1];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm p-4 z-40">
      <div className="bg-black/70 backdrop-blur-md border border-primary/20 p-3 rounded-2xl shadow-lg shadow-primary/10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-lg border border-primary/20">
            <Icon className="w-8 h-8 text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-baseline mb-1">
              <p className="font-headline text-lg text-primary">{division.name}</p>
              {nextDivision && (
                 <p className="text-xs text-muted-foreground">Next: {nextDivision.name}</p>
              )}
            </div>
            <Progress value={progress} className="h-2 bg-primary/20 [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-primary" />
            <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                <span>{division.minBalance > 0 ? division.minBalance.toLocaleString() : 0} $CAI</span>
                {division.maxBalance !== Infinity && (
                    <span>{division.maxBalance.toLocaleString()} $CAI</span>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
