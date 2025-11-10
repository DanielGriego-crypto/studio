
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Medal, ArrowUp, ArrowDown, ChevronDown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DIVISIONS, getDivision, Division } from '@/lib/caissa/divisions';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const DivisionCard = ({ division, isCurrent, onClick }: { division: Division, isCurrent: boolean, onClick: () => void }) => {
    const { Icon, name, minBalance, maxBalance } = division;
    const [clientReady, setClientReady] = React.useState(false);
    React.useEffect(() => {
        setClientReady(true);
    }, []);

    return (
        <button 
            onClick={onClick}
            className={cn(
                "w-full bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center gap-4 transition-all duration-300 text-left hover:border-primary/50",
                isCurrent && "border-primary/50 ring-2 ring-primary/50"
            )}
        >
            <div className={cn(
                "p-3 rounded-lg border",
                isCurrent ? "bg-gradient-to-br from-primary/30 to-primary/10 border-primary/20" : "bg-white/5 border-white/10"
            )}>
                <Icon className={cn("w-8 h-8", isCurrent ? "text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]" : "text-white/70")} />
            </div>
            <div className="flex-1">
                <p className={cn("font-headline text-lg", isCurrent ? "text-primary" : "text-white")}>{name}</p>
                <p className="text-sm text-white/60">
                    {clientReady ? `${minBalance.toLocaleString('ru-RU')} - ${maxBalance === Infinity ? '∞' : maxBalance.toLocaleString('ru-RU')} $CAI` : '...'}
                </p>
            </div>
        </button>
    );
};

const initialMockPlayers = [
    { id: '1', name: 'You', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026703d', cai: 1350, rankChange: 35, isCurrentUser: true, gamesPlayed: 5 },
    { id: '2', name: 'Grandmaster_G', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', cai: 1420, rankChange: -12, gamesPlayed: 8 },
    { id: '3', name: 'ChessQueen', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', cai: 1380, rankChange: 5, gamesPlayed: 2 },
    { id: '4', name: 'Rook_Star', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', cai: 1320, rankChange: 78, gamesPlayed: 10 },
    { id: '5', name: 'Bishop_Bob', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d', cai: 1290, rankChange: -20, gamesPlayed: 4 },
    { id: '6', name: 'PawnMaster', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d', cai: 1250, rankChange: 0, gamesPlayed: 0 },
    { id: '7', name: 'Checkmate_Champ', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026709d', cai: 1220, rankChange: 42, gamesPlayed: 6 },
    { id: '8', name: 'Knight_Rider', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026710d', cai: 1180, rankChange: -8, gamesPlayed: 3 },
    { id: '9', name: 'Player9', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026701d', cai: 1150, rankChange: 15, gamesPlayed: 1 },
    { id: '10', name: 'Player10', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026702d', cai: 1120, rankChange: -5, gamesPlayed: 2 },
    { id: '11', name: 'Player11', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026711d', cai: 1100, rankChange: 22, gamesPlayed: 4 },
    { id: '12', name: 'Player12', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026712d', cai: 1080, rankChange: -3, gamesPlayed: 1 },
];

const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-slate-300";
    if (rank === 3) return "text-yellow-600";
    return "text-white/70";
}

const PlayerRow = ({ player, rank }: { player: typeof initialMockPlayers[0], rank: number }) => (
    <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
            "flex items-center gap-3 bg-black/40 p-2 rounded-lg border",
            player.isCurrentUser ? "border-primary/50" : "border-white/10"
    )}>
        <span className={cn("font-bold text-base w-6 text-center", player.isCurrentUser ? "text-primary": getRankColor(rank))}>
            {rank}
        </span>
        <div className="w-5 h-5 flex items-center justify-center">
            {rank <= 3 && <Medal className={cn("w-5 h-5", getRankColor(rank))} />}
        </div>
        <Avatar className="h-8 w-8 border-2 border-primary/30">
            <AvatarImage src={player.avatar} />
            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
            <p className={cn("font-semibold text-sm", player.isCurrentUser ? "text-primary": "text-white/90")}>{player.name}</p>
            <p className="text-xs text-white/60 font-bold">{player.cai.toLocaleString('ru-RU')} $CAI</p>
        </div>
         <Tooltip>
            <TooltipTrigger>
                <div className={cn(
                    "flex items-center font-bold text-xs",
                    player.rankChange > 0 && "text-green-400",
                    player.rankChange < 0 && "text-red-400",
                    player.rankChange === 0 && "text-gray-500",
                )}>
                    {player.rankChange > 0 && <ArrowUp className="w-3 h-3 mr-1" />}
                    {player.rankChange < 0 && <ArrowDown className="w-3 h-3 mr-1" />}
                    {player.rankChange !== 0 ? Math.abs(player.rankChange) : '-'}
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Изменение за 2 часа ({player.gamesPlayed} игр)</p>
            </TooltipContent>
        </Tooltip>
    </motion.div>
);


export default function LeaguePage() {
    const [balance] = React.useState(1350); // Mock balance
    const [players, setPlayers] = React.useState(initialMockPlayers);
    const [selectedDivision, setSelectedDivision] = React.useState<Division | null>(null);
    const [view, setView] = React.useState<'leaderboard' | 'all_divisions'>('leaderboard');
    const [visiblePlayersCount, setVisiblePlayersCount] = React.useState(5);
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const currentDivision = getDivision(balance);
    
    const sortedPlayers = React.useMemo(() => [...players].sort((a, b) => b.cai - a.cai), [players]);
    const currentUserRank = sortedPlayers.findIndex(p => p.isCurrentUser) + 1;
    
    const divisionToShow = selectedDivision || currentDivision;
    
    const currentDivisionIndex = DIVISIONS.findIndex(d => d.name === currentDivision.name);
    const nextDivision = currentDivisionIndex !== -1 && currentDivisionIndex < DIVISIONS.length - 1 ? DIVISIONS[currentDivisionIndex + 1] : null;
    const neededForNext = nextDivision ? nextDivision.minBalance - balance : 0;


    const handleBack = () => {
        if (view === 'leaderboard' && selectedDivision && selectedDivision.name !== currentDivision.name) {
            setSelectedDivision(null);
            setVisiblePlayersCount(5);
        } else if (view === 'all_divisions') {
            setView('leaderboard');
        }
    };
    
    const handleDivisionClick = (division: Division) => {
        setSelectedDivision(division);
        setView('leaderboard');
        setVisiblePlayersCount(5);
    };

    const getPageTitle = () => {
        if (view === 'all_divisions') return 'Дивизионы';
        return 'Лиги';
    }

    const [clientReady, setClientReady] = React.useState(false);
    React.useEffect(() => {
        setClientReady(true);
    }, []);
    
    const playersToShow = sortedPlayers.slice(0, visiblePlayersCount);
    const canLoadMore = visiblePlayersCount < sortedPlayers.length;

    const handleLoadMore = () => {
        setVisiblePlayersCount(prevCount => Math.min(prevCount + 5, sortedPlayers.length));
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate data refresh
        setTimeout(() => {
            setPlayers(prevPlayers => {
                return prevPlayers.map(p => {
                    const change = Math.floor(Math.random() * 51) - 25; // -25 to +25
                    return {
                        ...p,
                        cai: Math.max(0, p.cai + change),
                        rankChange: change,
                        gamesPlayed: p.gamesPlayed + Math.round(Math.random())
                    };
                });
            });
            setIsRefreshing(false);
        }, 500);
    };

  return (
    <TooltipProvider>
    <main className="relative flex flex-col h-[100svh] w-full max-w-sm mx-auto bg-background overflow-hidden">
      <Particles quantity={30} />
      
      <header className="absolute top-0 left-0 right-0 p-4 z-20 flex items-center">
        {(view === 'all_divisions' || (selectedDivision && selectedDivision.name !== currentDivision.name)) ? (
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 w-10" onClick={handleBack}>
                <ArrowLeft className="h-6 w-6" />
            </Button>
        ) : (
            <Link href="/" passHref>
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 w-10">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
        )}
        <h1 className="font-headline text-xl font-bold text-primary text-center flex-1 uppercase">
          {getPageTitle()}
        </h1>
        <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 w-10" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("h-5 w-5", isRefreshing && "animate-spin")} />
        </Button>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-start pt-20 px-4 z-10 overflow-y-auto no-scrollbar pb-4">
        {view === 'leaderboard' ? (
            <>
                 <Card className="w-full bg-black/50 backdrop-blur-sm border-none text-center mb-4">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-white/70">Текущая лига</CardDescription>
                        <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary to-yellow-400 flex items-center justify-center gap-2 uppercase" style={{ textShadow: '0 0 10px hsl(var(--primary) / 0.5)' }}>
                            <divisionToShow.Icon className="w-7 h-7 text-primary" />
                            {divisionToShow.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-white/70">Место в дивизионе: <span className="font-bold text-primary">{currentUserRank}</span></p>
                        {clientReady && nextDivision && neededForNext > 0 && (
                            <p className="text-xs text-white/60 mt-1">
                                Еще {neededForNext.toLocaleString('ru-RU')} $CAI до <span className="font-bold text-primary">{nextDivision.name}</span>
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Tabs defaultValue="players" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-primary/20">
                        <TabsTrigger value="players">Игроки</TabsTrigger>
                        <TabsTrigger value="owners">Владельцы</TabsTrigger>
                    </TabsList>
                    <TabsContent value="players" className="mt-4 space-y-2">
                        <AnimatePresence>
                            {clientReady && playersToShow.map((player, index) => (
                                <PlayerRow key={player.id} player={player} rank={index + 1} />
                            ))}
                        </AnimatePresence>
                         {canLoadMore && (
                            <Button variant="link" className="w-full text-primary" onClick={handleLoadMore}>
                                Показать больше
                                <ChevronDown className="w-4 h-4 ml-1" />
                            </Button>
                        )}
                    </TabsContent>
                    <TabsContent value="owners" className="mt-4 text-center text-white/70 p-4 bg-black/30 rounded-lg">
                        <p>Здесь будут показаны владельцы $CAI, которые поддерживают дивизион, но не участвуют в играх.</p>
                    </TabsContent>
                </Tabs>
                
                <Button variant="outline" className="w-full mt-6 bg-black/50 border-primary/30" onClick={() => setView('all_divisions')}>
                    <Users className="mr-2 h-4 w-4" /> Посмотреть все дивизионы
                </Button>
            </>
        ) : (
            <div className="w-full mt-4 space-y-3">
                {DIVISIONS.map((division) => (
                    <DivisionCard 
                        key={division.name} 
                        division={division} 
                        isCurrent={division.name === currentDivision.name}
                        onClick={() => handleDivisionClick(division)}
                    />
                ))}
            </div>
        )}
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
    </TooltipProvider>
  );
}
