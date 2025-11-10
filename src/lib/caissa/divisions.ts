import type { LucideIcon } from 'lucide-react';
import { Castle, Crown, Trophy, ShieldQuestion } from 'lucide-react';
import { PawnIcon, BishopIcon, KnightIcon } from '@/components/caissa/icons';

export interface Division {
  name: string;
  minBalance: number;
  maxBalance: number;
  Icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
}

export const DIVISIONS: Division[] = [
  { name: 'Pawn', minBalance: 0, maxBalance: 1000, Icon: PawnIcon },
  { name: 'Knight', minBalance: 1001, maxBalance: 2500, Icon: KnightIcon },
  { name: 'Bishop', minBalance: 2501, maxBalance: 5000, Icon: BishopIcon },
  { name: 'Rook', minBalance: 5001, maxBalance: 10000, Icon: Castle },
  { name: 'Queen', minBalance: 10001, maxBalance: 50000, Icon: Crown },
  { name: 'King', minBalance: 50001, maxBalance: 200000, Icon: Crown },
  { name: 'Grandmaster', minBalance: 200001, maxBalance: Infinity, Icon: Trophy },
];

export const getDivision = (balance: number): Division => {
  const foundDivision = DIVISIONS.find(d => balance >= d.minBalance && balance <= d.maxBalance);
  return foundDivision || { name: 'Unranked', minBalance: 0, maxBalance: 0, Icon: ShieldQuestion };
};


export const getDivisionProgress = (balance: number): number => {
  const division = getDivision(balance);
  if (division.maxBalance === Infinity || division.name === 'Unranked') {
    return 100;
  }
  const range = division.maxBalance - (division.minBalance > 0 ? division.minBalance : 0);
  const progressInRange = balance - (division.minBalance > 0 ? division.minBalance : 0);
  if (range === 0) return 100;
  return Math.max(0, Math.min(100, (progressInRange / range) * 100));
};
