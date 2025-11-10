
'use client';

import * as React from 'react';
import { Copy, Check, Users, Gift, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ReferralDialogContentProps {
    referralCode: string;
}

export function ReferralDialogContent({ referralCode }: ReferralDialogContentProps) {
    const { toast } = useToast();
    const [hasCopied, setHasCopied] = React.useState(false);
    const referralLink = `https://t.me/caisssachess_bot?start=${referralCode}`;
    const referralCount = 0; // Mock data

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
        <DialogContent className="bg-background/80 border-primary/20 backdrop-blur-lg max-w-sm">
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl text-primary text-center">CAÏSSA FRIENDS</DialogTitle>
                <DialogDescription className="text-center text-white/70 pt-2">
                    Приглашайте друзей и получайте награды вместе!
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
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
                    <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                        <Users className="w-6 h-6 mx-auto text-primary mb-2" />
                        <p className="text-2xl font-bold text-white">{referralCount}</p>
                        <p className="text-xs text-white/60">Приглашено</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                        <Gift className="w-6 h-6 mx-auto text-primary mb-2" />
                        <p className="text-xl font-bold text-white">+30 <span className="text-sm">$CAI</span></p>
                        <p className="text-xs text-white/60">За друга</p>
                    </div>
                </div>

                <div className="bg-black/40 p-4 rounded-lg border border-white/10 flex items-center gap-4">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <div>
                        <p className="font-bold text-white">Пассивный доход</p>
                        <p className="text-sm text-white/70">Получайте <span className="font-bold text-primary">0.8%</span> с каждого пополнения ваших рефералов.</p>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}

    



