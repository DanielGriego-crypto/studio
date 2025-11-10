
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUp, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Particles from '@/components/caissa/particles';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'reward' | 'game_win' | 'game_loss';
  amount: number;
  date: Date;
  description: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'reward', amount: 150, date: new Date('2024-07-20T10:00:00Z'), description: 'Награда за дивизион "Knight"' },
  { id: '2', type: 'game_win', amount: 25, date: new Date('2024-07-20T09:30:00Z'), description: 'Победа в рейтинговой игре' },
  { id: '3', type: 'game_loss', amount: -10, date: new Date('2024-07-20T09:15:00Z'), description: 'Поражение в рейтинговой игре' },
  { id: '4', type: 'reward', amount: 50, date: new Date('2024-07-19T18:00:00Z'), description: 'Ежедневная награда: 3 победы' },
  { id: '5', type: 'reward', amount: 10, date: new Date('2024-07-19T11:00:00Z'), description: 'Ежедневная награда: Вход' },
];

const TransactionIcon = ({ type }: { type: Transaction['type'] }) => {
  switch (type) {
    case 'deposit':
    case 'reward':
    case 'game_win':
      return <ArrowUp className="h-5 w-5 text-green-400" />;
    case 'withdrawal':
    case 'game_loss':
      return <ArrowDown className="h-5 w-5 text-red-400" />;
    default:
      return <ArrowRight className="h-5 w-5 text-gray-400" />;
  }
};

const ArrowDown = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14"/>
        <path d="m19 12-7 7-7-7"/>
    </svg>
);


export default function WalletPage() {
    const [balance] = React.useState(7500);
    const [clientReady, setClientReady] = React.useState(false);

    React.useEffect(() => {
        setClientReady(true);
    }, []);

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
          Кошелек
        </h1>
        <div className="w-10"></div> {/* Spacer to balance the header */}
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-start pt-20 px-4 z-10 overflow-y-auto no-scrollbar pb-4">
        <Card className="w-full bg-black/50 backdrop-blur-sm border border-primary/20 text-center">
          <CardHeader>
            <CardDescription className="text-white/70">Текущий баланс</CardDescription>
            <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary to-yellow-400" style={{ textShadow: '0 0 10px hsl(var(--primary) / 0.5)' }}>
              {clientReady ? balance.toLocaleString('ru-RU') : '...'} $CAI
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
             <Button className="w-full font-bold">
                <Upload className="mr-2 h-4 w-4" /> Вывести на TON
             </Button>
             <Button variant="secondary" className="w-full font-bold">
                <Download className="mr-2 h-4 w-4" /> Пополнить
             </Button>
          </CardContent>
        </Card>
        
        <div className="w-full mt-6">
            <h2 className="text-lg font-bold text-white/90 mb-4">История транзакций</h2>
            <div className="space-y-3">
            {clientReady && mockTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-full", tx.amount > 0 ? "bg-green-500/10" : "bg-red-500/10")}>
                    <TransactionIcon type={tx.type} />
                  </div>
                  <div>
                    <p className="font-semibold text-white/90">{tx.description}</p>
                    <p className="text-xs text-white/60">{tx.date.toLocaleString('ru-RU')}</p>
                  </div>
                </div>
                <p className={cn("font-bold", tx.amount > 0 ? "text-green-400" : "text-red-400")}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('ru-RU')} $CAI
                </p>
              </div>
            ))}
            </div>
        </div>
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
