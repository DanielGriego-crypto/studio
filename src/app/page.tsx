
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Crown, UserPlus, Swords, Users, Trophy, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DivisionIndicator } from '@/components/caissa/division-indicator';
import Particles from '@/components/caissa/particles';
import { cn } from '@/lib/utils';

export default function Home() {
  const [balance, setBalance] = React.useState(7500); // Mock balance for demo
  const [showGameOptions, setShowGameOptions] = React.useState(false);

  const [clientBalance, setClientBalance] = React.useState<number | null>(null);
  React.useEffect(() => {
    setClientBalance(balance);
  }, [balance]);

  return (
    <main className="relative flex flex-col h-[100svh] w-full max-w-sm mx-auto bg-background overflow-hidden">
      <Particles quantity={50} />

      {/* Header */}
      <header className="absolute top-0 right-0 p-6 z-10">
        <div className="bg-black/50 backdrop-blur-sm text-primary font-bold px-4 py-2 rounded-lg border border-primary/20 shadow-lg">
          Баланс: {clientBalance !== null ? clientBalance.toLocaleString() : '...'} $CAI
        </div>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 z-10 transition-all duration-500" style={{ transform: showGameOptions ? 'translateY(-10%)' : 'translateY(0)' }}>
        <div className="flex flex-col items-center justify-center space-y-4">
            <Crown className="w-16 h-16 text-primary animate-spin-slow" style={{filter: 'drop-shadow(0 0 15px hsl(var(--primary)))'}}/>
            <h1 className="font-headline text-5xl tracking-wider font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary to-yellow-400" style={{ textShadow: '0 0 20px hsl(var(--primary) / 0.5)' }}>
                CAÏSSA CHESS
            </h1>
        </div>
        
        <p className="text-white/80 max-w-xs" style={{ textShadow: '0 0 5px hsl(var(--primary) / 0.3)'}}>
            Интеллект — валюта 21 века. Зарабатывай $CAI умом, стратегией и волей.
        </p>

        <div className="w-full pt-8">
            <Button 
              size="lg" 
              className="w-full h-16 text-lg font-bold rounded-xl bg-gradient-to-br from-primary to-yellow-600 text-primary-foreground shadow-lg shadow-primary/20 animate-pulse-slow ring-2 ring-primary/50 hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
              onClick={() => setShowGameOptions(!showGameOptions)}
            >
              Заработать $CAI
            </Button>
        </div>
      </div>

      {/* Game Options Panel */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-lg rounded-t-3xl p-6 pt-8 transition-transform duration-500 ease-in-out z-30',
          showGameOptions ? 'translate-y-0' : 'translate-y-full',
          'pb-[140px]' // Padding to not cover division indicator
        )}
      >
        <div className="grid grid-cols-2 gap-4">
            <GameOptionButton icon={UserPlus} label="Пригласить друга" bonus="+50 $CAI" />
            <GameOptionButton icon={Swords} label="Подбор игры" sublabel="(Дивизион)" />
            <GameOptionButton icon={Users} label="Частный матч" />
            <GameOptionButton icon={Trophy} label="Турнир" />
            <Link href="/daily" className="col-span-2">
              <GameOptionButton icon={Gift} label="Ежедневные задания" className="!h-20 !flex-row w-full" />
            </Link>
        </div>
      </div>

      {clientBalance !== null && <DivisionIndicator balance={clientBalance} />}
    </main>
  );
}

const GameOptionButton = ({ icon: Icon, label, sublabel, bonus, className }: { icon: React.ElementType, label: string, sublabel?: string, bonus?: string, className?: string }) => (
    <Button variant="outline" className={cn("relative h-28 flex-col justify-center items-center gap-2 text-center border-primary/30 bg-primary/10 hover:bg-primary/20 text-white/90 rounded-xl transition-all duration-300 hover:scale-105 hover:border-primary/50", className)}>
        <Icon className="w-8 h-8 text-primary" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{label}</span>
          {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
        </div>
        {bonus && <span className="absolute top-2 right-2 text-xs font-bold text-primary bg-black/50 px-2 py-0.5 rounded-full">{bonus}</span>}
    </Button>
);
