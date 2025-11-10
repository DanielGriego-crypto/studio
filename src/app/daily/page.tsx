
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DailyRewardCard, type DailyReward } from '@/components/caissa/daily-reward-card';
import Particles from '@/components/caissa/particles';

const dailyRewardsData: DailyReward[] = [
  {
    id: '1',
    title: 'Войти в игру',
    reward: 10,
    icon: Gift,
    claimed: true,
    progress: 100,
  },
  {
    id: '2',
    title: 'Выиграть 3 партии',
    reward: 50,
    icon: Gift,
    claimed: false,
    progress: 66,
  },
  {
    id: '3',
    title: 'Пригласить 1 друга',
    reward: 100,
    icon: Gift,
    claimed: false,
    progress: 0,
  },
  {
    id: '4',
    title: 'Сыграть в турнире',
    reward: 75,
    icon: Gift,
    claimed: false,
    progress: 0,
  },
  {
    id: '5',
    title: 'Достигнуть дивизиона "Knight"',
    reward: 150,
    icon: Gift,
    claimed: false,
    progress: 100,
  }
];

export default function DailyPage() {
  const [rewards, setRewards] = React.useState(dailyRewardsData);

  const handleClaim = (id: string) => {
    setRewards((prevRewards) =>
      prevRewards.map((reward) =>
        reward.id === id ? { ...reward, claimed: true } : reward
      )
    );
  };

  return (
    <main className="relative flex flex-col h-[100svh] w-full max-w-sm mx-auto bg-background overflow-hidden">
      <Particles quantity={30} />
      
      <header className="absolute top-0 left-0 right-0 p-4 z-20 flex items-center">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="font-headline text-2xl font-bold text-primary text-center flex-1">
          Ежедневные Награды
        </h1>
        <div className="w-10"></div> {/* Spacer to balance the header */}
      </header>

      <div className="flex-1 flex flex-col items-center justify-start pt-24 px-4 space-y-4 z-10 overflow-y-auto pb-4 no-scrollbar">
        {rewards.map((reward) => (
          <DailyRewardCard key={reward.id} reward={reward} onClaim={handleClaim} />
        ))}
      </div>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
