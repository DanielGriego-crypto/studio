
'use client';

import type { LucideIcon } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface DailyReward {
  id: string;
  title: string;
  reward: number;
  icon: LucideIcon;
  claimed: boolean;
  progress: number; // 0-100
}

interface DailyRewardCardProps {
  reward: DailyReward;
  onClaim: (id: string) => void;
}

export function DailyRewardCard({ reward, onClaim }: DailyRewardCardProps) {
  const { id, title, reward: rewardAmount, icon: Icon, claimed, progress } = reward;
  const canClaim = progress >= 100 && !claimed;

  return (
    <div className={cn(
      "w-full bg-black/50 backdrop-blur-sm border border-primary/20 rounded-xl p-4 flex items-center gap-4 transition-all duration-300",
      claimed && "opacity-60 bg-primary/10",
      !canClaim && !claimed && "bg-black/40"
    )}>
      <div className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-lg border border-primary/20">
        <Icon className="w-8 h-8 text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-white">{title}</p>
        <p className="text-sm text-primary font-bold">+{rewardAmount} $CAI</p>
        {progress < 100 && !claimed && (
          <Progress value={progress} className="h-1.5 mt-2 bg-primary/20 [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-primary" />
        )}
      </div>
      <div>
        {claimed ? (
          <div className="flex items-center justify-center w-28 h-10 rounded-lg bg-transparent text-green-400/80 gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-bold">Получено</span>
          </div>
        ) : (
          <Button
            className="w-28 h-10 font-bold transition-all duration-300"
            onClick={() => onClaim(id)}
            disabled={!canClaim}
            size="sm"
          >
            {canClaim ? 'Забрать' : `${progress}%`}
          </Button>
        )}
      </div>
    </div>
  );
}
