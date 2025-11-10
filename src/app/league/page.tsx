
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Crown, Users, BarChart } from 'lucide-react';
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
import { DIVISIONS, getDivision, Division } from '@/lib/caissa/divisions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DivisionCard = ({ division, isCurrent }: { division: Division, isCurrent: boolean }) => {
    const { Icon, name, minBalance, maxBalance } = division;
    return (
        <div className={cn(
            "w-full bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center gap-4 transition-all duration-300",
            isCurrent && "border-primary/50 ring-2 ring-primary/50"
        )}>
            <div className={cn(
                "p-3 rounded-lg border",
                isCurrent ? "bg-gradient-to-br from-primary/30 to-primary/10 border-primary/20" : "bg-white/5 border-white/10"
            )}>
                <Icon className={cn("w-8 h-8", isCurrent ? "text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]" : "text-white/70")} />
            </div>
            <div className="flex-1">
                <p className={cn("font-headline text-lg", isCurrent ? "text-primary" : "text-white")}>{name}</p>
                <p className="text-sm text-white/60">
                    {minBalance.toLocaleString()} - {maxBalance === Infinity ? '∞' : maxBalance.toLocaleString()} $CAI
                </p>
            </div>
        </div>
    );
};

export default function LeaguePage() {
    const [balance] = React.useState(7500); // Mock balance
    const currentDivision = getDivision(balance);

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
          Лиги и Лидеры
        </h1>
        <div className="w-10"></div> {/* Spacer to balance the header */}
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-start pt-20 px-4 z-10 overflow-y-auto no-scrollbar pb-4">
        <Card className="w-full bg-black/50 backdrop-blur-sm border-none text-center mb-6">
            <CardHeader>
                <CardDescription className="text-white/70">Ваш текущий дивизион</CardDescription>
                <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary to-yellow-400 flex items-center justify-center gap-2" style={{ textShadow: '0 0 10px hsl(var(--primary) / 0.5)' }}>
                    <currentDivision.Icon className="w-8 h-8" />
                    {currentDivision.name}
                </CardTitle>
            </CardHeader>
        </Card>

        <Tabs defaultValue="divisions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-primary/20">
                <TabsTrigger value="divisions"><Crown className="w-4 h-4 mr-2"/>Дивизионы</TabsTrigger>
                <TabsTrigger value="players" disabled><Users className="w-4 h-4 mr-2"/>Игроки</TabsTrigger>
                <TabsTrigger value="holders" disabled><BarChart className="w-4 h-4 mr-2"/>Владельцы</TabsTrigger>
            </TabsList>
            <TabsContent value="divisions" className="mt-4 space-y-3">
                {DIVISIONS.map((division) => (
                    <DivisionCard key={division.name} division={division} isCurrent={division.name === currentDivision.name} />
                ))}
            </TabsContent>
            <TabsContent value="players">
                <p className="text-center text-muted-foreground mt-8">Скоро здесь появятся лучшие игроки.</p>
            </TabsContent>
            <TabsContent value="holders">
                <p className="text-center text-muted-foreground mt-8">Скоро здесь появятся крупнейшие владельцы $CAI.</p>
            </TabsContent>
        </Tabs>
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
