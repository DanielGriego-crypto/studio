
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Crown, UserPlus, Swords, Users, Trophy, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DivisionIndicator } from '@/components/caissa/division-indicator';
import Particles from '@/components/caissa/particles';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useAuth } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';

export default function Home() {
  const [showGameOptions, setShowGameOptions] = React.useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  React.useEffect(() => {
    if (!user && !isUserLoading) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  React.useEffect(() => {
    if (user && firestore) {
      const userRef = doc(firestore, 'users', user.uid);
      getDoc(userRef).then(docSnap => {
        if (!docSnap.exists()) {
          const userData = {
            id: user.uid,
            telegramId: `telegram_${user.uid}`, // Placeholder
            caissaBalance: 1000,
            divisionId: 'Pawn', // Starting division
            elo: 1200, // Starting ELO
            referralCode: `ref_${user.uid.substring(0, 6)}`,
          };
          setDoc(userRef, userData).catch(error => {
            console.error("Failed to create user document:", error);
          });
        }
      });
    }
  }, [user, firestore]);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData } = useDoc(userDocRef);
  
  const balance = userData ? userData.caissaBalance : null;


  return (
    <main className="relative flex flex-col h-[100svh] w-full max-w-sm mx-auto bg-background overflow-hidden">
      <Particles quantity={50} />

      {/* Backdrop */}
      {showGameOptions && (
        <div
          className="absolute inset-0 bg-black/50 z-20"
          onClick={() => setShowGameOptions(false)}
        />
      )}

      {/* Header */}
      <header className="absolute top-0 right-0 p-6 z-20">
        <Link href="/wallet" passHref>
          <div className="bg-black/50 backdrop-blur-sm text-primary font-bold px-4 py-2 rounded-lg border border-primary/20 shadow-lg cursor-pointer hover:bg-primary/10 transition-colors">
            Баланс: {balance !== null ? balance.toLocaleString('ru-RU') : '...'} $CAI
          </div>
        </Link>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 z-10 transition-all duration-500" style={{ transform: showGameOptions ? 'translateY(-10%)' : 'translateY(0)' }}>
        <div className="flex flex-col items-center justify-center space-y-4">
            <Crown className="w-16 h-16 text-primary" style={{filter: 'drop-shadow(0 0 15px hsl(var(--primary)))'}}/>
            <h1 className="font-headline text-5xl tracking-wider font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary to-yellow-400" style={{ textShadow: '0 0 20px hsl(var(--primary) / 0.5)' }}>
                CAÏSSA CHESS
            </h1>
        </div>
        
        <p className="text-white/80 max-w-xs" style={{ textShadow: '0 0 5px hsl(var(--primary) / 0.3)'}}>
            Интеллект — валюта 21 века. Зарабатывай $CAI умом, стратегией и волей.
        </p>

        <div className="w-full pt-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-primary rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <Button 
                size="lg" 
                className="relative w-full h-16 text-lg font-bold rounded-full bg-gradient-to-br from-primary to-yellow-600 text-primary-foreground shadow-lg shadow-primary/20 ring-2 ring-primary/50 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 font-headline tracking-wider overflow-hidden group"
                onClick={() => setShowGameOptions(!showGameOptions)}
              >
                <span className="relative z-10">{showGameOptions ? 'Закрыть' : 'Заработать $CAI'}</span>
                <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <span className="absolute inset-0 scale-0 group-hover:scale-125 transition-transform duration-500 ease-out bg-white/30 rounded-full"></span>

              </Button>
            </div>
        </div>
      </div>

      {/* Game Options Panel */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-lg rounded-t-3xl p-6 pt-4 transition-transform duration-500 ease-in-out z-30',
          showGameOptions ? 'translate-y-0' : 'translate-y-full',
          'pb-[calc(env(safe-area-inset-bottom,0px)+120px)]'
        )}
      >
        <div className="w-full flex justify-center pb-2">
            <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
        </div>
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

      {balance !== null && <DivisionIndicator balance={balance} />}
      
    </main>
  );
}

const GameOptionButton = ({ icon: Icon, label, sublabel, bonus, className }: { icon: React.ElementType, label: string, sublabel?: string, bonus?: string, className?: string }) => (
    <Button variant="outline" className={cn("relative h-28 flex-col justify-center items-center gap-2 text-center border-primary/30 bg-primary/10 hover:bg-primary/20 text-white/90 rounded-xl transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10", className)}>
        <Icon className="w-8 h-8 text-primary" />
        <div className="flex flex-col">
          <span className="font-headline text-sm font-semibold">{label}</span>
          {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
        </div>
        {bonus && <span className="absolute top-2 right-2 text-xs font-bold text-primary bg-black/50 px-2 py-0.5 rounded-full">{bonus}</span>}
    </Button>
);
