
'use client';

import * as React from 'react';
import { Copy, Check, Users, Gift, TrendingUp, X, History, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ReferralDialogContentProps {
    referralCode: string;
}

const mockReferrals = [
    { id: '1', name: 'Player123', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: '2', name: 'ChessMaster', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    { id: '3', name: 'Rook_ie', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
];

const mockEarnings = [
    { id: '1', name: 'Player123', amount: 0.8, date: '2024-07-21 14:30' },
    { id: '2', name: 'ChessMaster', amount: 1.2, date: '2024-07-21 13:05' },
    { id: '3', name: 'Player123', amount: 0.4, date: '2024-07-21 11:15' },
];


export function ReferralDialogContent({ referralCode }: ReferralDialogContentProps) {
    const { toast } = useToast();
    const [hasCopied, setHasCopied] = React.useState(false);
    const [activeView, setActiveView] = React.useState('main'); // 'main', 'referrals', 'earnings'
    const referralLink = `https://t.me/caisssachess_bot?start=${referralCode}`;
    const referralCount = mockReferrals.length;
    const totalEarnings = mockEarnings.reduce((acc, curr) => acc + curr.amount, 0);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink).then(() => {
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
            toast({
                title: "Скопировано!",
                description: "Реферальная ссылка скопирована.",
            });
        });
    };

    return (
        <DialogContent className="bg-background/80 border-primary/20 backdrop-blur-lg max-w-sm p-0 overflow-hidden h-[600px] sm:h-[550px]">
            <div className={cn("transition-opacity duration-300 w-full h-full flex flex-col", activeView !== 'main' ? 'opacity-0 pointer-events-none absolute' : 'opacity-100')}>
                <DialogHeader className="p-6 pb-2 shrink-0">
                    <DialogTitle className="font-headline text-2xl text-primary text-center">CAÏSSA FRIENDS</DialogTitle>
                    <DialogDescription className="text-center text-white/70 pt-2">
                        Приобщайте людей к интелектуальной борьбе и получайте награды вместе!
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 px-6 pb-6 pt-4 overflow-y-auto flex-1">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Ваша реферальная ссылка</label>
                        <div className="flex items-center space-x-2">
                            <Input
                                readOnly
                                value={referralLink}
                                className="bg-black/50 border-primary/30 text-white"
                            />
                            <Button size="icon" onClick={copyToClipboard} variant="outline" className="border-primary/30 bg-primary/10 hover:bg-primary/20">
                                {hasCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-primary" />}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                         <button onClick={() => setActiveView('referrals')} className="bg-black/40 p-4 rounded-lg border border-white/10 hover:border-primary/50 transition-colors">
                            <Users className="w-6 h-6 mx-auto text-primary mb-2" />
                            <p className="text-2xl font-bold text-white">{referralCount}</p>
                            <p className="text-xs text-white/60">Приглашено</p>
                        </button>
                        <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                            <Gift className="w-6 h-6 mx-auto text-primary mb-2" />
                            <p className="text-xl font-bold text-white">+50 <span className="text-sm">$CAI</span></p>
                            <p className="text-xs text-white/60">За друга</p>
                        </div>
                    </div>
                    
                    <button onClick={() => setActiveView('earnings')} className="w-full bg-black/40 p-4 rounded-lg border border-white/10 flex items-center gap-4 text-left hover:border-primary/50 transition-colors">
                        <TrendingUp className="w-8 h-8 text-primary" />
                        <div>
                            <p className="font-bold text-white">Пассивный доход</p>
                            <p className="text-sm text-white/70">Получайте <span className="font-bold text-primary">0.8%</span> с каждой победы ваших рефералов.</p>
                        </div>
                    </button>
                    
                    <div className="bg-black/40 p-4 rounded-lg border border-white/10 text-center">
                        <Wallet className="w-6 h-6 mx-auto text-primary mb-2" />
                        <p className="text-2xl font-bold text-white">{totalEarnings.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} <span className="text-sm">$CAI</span></p>
                        <p className="text-xs text-white/60">Всего заработано</p>
                    </div>

                </div>
            </div>
            
            <div className={cn(
                "absolute inset-0 bg-background/95 backdrop-blur-sm transition-opacity duration-300 flex flex-col p-6",
                activeView === 'referrals' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-headline text-xl text-primary">Ваши рефералы</h3>
                    <Button variant="ghost" size="icon" onClick={() => setActiveView('main')}>
                        <X className="w-5 h-5 text-primary" />
                    </Button>
                </div>
                <div className="space-y-3 overflow-y-auto flex-1">
                    {mockReferrals.map(ref => (
                        <div key={ref.id} className="flex items-center gap-3 bg-black/40 p-3 rounded-lg border border-white/10">
                            <Avatar>
                                <AvatarImage src={ref.avatar} />
                                <AvatarFallback>{ref.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold text-white/90">{ref.name}</p>
                        </div>
                    ))}
                    {mockReferrals.length === 0 && (
                        <p className="text-center text-white/60 pt-8">У вас пока нет рефералов.</p>
                    )}
                </div>
            </div>

            <div className={cn(
                "absolute inset-0 bg-background/95 backdrop-blur-sm transition-opacity duration-300 flex flex-col p-6",
                activeView === 'earnings' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-headline text-xl text-primary">История зачислений</h3>
                    <Button variant="ghost" size="icon" onClick={() => setActiveView('main')}>
                        <X className="w-5 h-5 text-primary" />
                    </Button>
                </div>
                <div className="space-y-3 overflow-y-auto flex-1">
                    {mockEarnings.map(earning => (
                        <div key={earning.id} className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/10">
                           <div className="flex items-center gap-3">
                                <History className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="font-semibold text-white/90">Победа <span className="text-primary">{earning.name}</span></p>
                                    <p className="text-xs text-white/60">{earning.date}</p>
                                </div>
                            </div>
                           <p className="font-bold text-green-400">
                                +{earning.amount.toLocaleString('ru-RU')} $CAI
                            </p>
                        </div>
                    ))}
                    {mockEarnings.length === 0 && (
                        <p className="text-center text-white/60 pt-8">История зачислений пуста.</p>
                    )}
                </div>
            </div>
        </DialogContent>
    );
}
