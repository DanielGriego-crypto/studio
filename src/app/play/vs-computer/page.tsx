
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Bot, Smile, Timer, Crown, Zap, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Particles from '@/components/caissa/particles';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const PlayerInfo = ({ name, avatar, balance, time, isComputer = false }: { name: string, avatar: string, balance?: number | null, time: number, isComputer?: boolean }) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    return (
        <div className="flex items-center gap-3 bg-black/40 p-2 rounded-lg border border-white/10 w-full max-w-xs">
             <Avatar className="h-10 w-10 border-2 border-primary/30">
                <AvatarImage src={avatar} />
                <AvatarFallback>{isComputer ? <Bot /> : name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="font-semibold text-white/90 truncate">{name}</p>
                {balance !== undefined && <p className="text-xs text-primary font-bold">{balance === null ? '...' : balance.toLocaleString('ru-RU')} $CAI</p>}
            </div>
            <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-md border border-white/10">
                <Timer className="w-4 h-4 text-white/70" />
                <span className="font-mono font-bold text-white/90 text-sm">{formatTime(time)}</span>
            </div>
        </div>
    )
};

const reactions = [
    { icon: ThumbsUp, label: 'Хороший ход!' },
    { icon: Zap, label: 'Шах!' },
    { icon: Crown, label: 'Мат!' },
];

export default function PlayVsComputerPage() {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');
  
  const [playerTime, setPlayerTime] = useState(600); // 10 minutes
  const [computerTime, setComputerTime] = useState(600);
  const [activeTimer, setActiveTimer] = useState<'player' | 'computer' | null>('player');
  
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [optionSquares, setOptionSquares] = useState({});

  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  const { data: userData } = useDoc(userDocRef);

  const balance = userData ? userData.caissaBalance : null;
  const username = user?.displayName || 'Игрок';

  const handleGameOver = useCallback((customMessage?: string) => {
    setActiveTimer(null);
    setIsGameOver(true);
    let message = customMessage || 'Игра окончена';
    if (!customMessage) {
        if(game.isCheckmate()){
            message = `Мат! ${game.turn() === 'w' ? 'Черные' : 'Белые'} победили.`;
        } else if (game.isDraw()){
            message = 'Ничья!';
        } else if (game.isStalemate()){
            message = 'Пат!';
        } else if (game.isThreefoldRepetition()){
            message = 'Ничья (троекратное повторение)!';
        } else if (game.isInsufficientMaterial()){
            message = 'Ничья (недостаточно материала)!';
        }
    }
    setGameOverMessage(message);
  }, [game]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTimer && !isGameOver) {
      timer = setInterval(() => {
        if (activeTimer === 'player') {
          setPlayerTime(t => {
            if (t <= 1) {
              handleGameOver('Время вышло! Черные победили.');
              return 0;
            }
            return t - 1;
          });
        } else {
          setComputerTime(t => {
            if (t <= 1) {
              handleGameOver('Время вышло! Белые победили.');
              return 0;
            }
            return t - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTimer, isGameOver, handleGameOver]);
  
  const makeComputerMove = useCallback(() => {
    if (game.isGameOver()) {
      handleGameOver();
      return;
    }
    
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) {
      handleGameOver();
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    const move = possibleMoves[randomIndex];
    game.move(move);

    setPosition(game.fen());
    setActiveTimer('player');
    
    if (game.isGameOver()) {
      handleGameOver();
    }
  }, [game, handleGameOver]);

  function onSquareClick(square: Square) {
    // from square is not set
    if (!moveFrom) {
      const moves = game.moves({ square, verbose: true });
      if (moves.length === 0) {
        return;
      }
      setMoveFrom(square);
      const newOptionSquares = moves.reduce((acc, move) => {
        acc[move.to] = {
          background: "rgba(255, 255, 0, 0.4)",
        };
        return acc;
      }, {});
      setOptionSquares(newOptionSquares);
      return;
    }

    // from square is set
    try {
      const move = game.move({
        from: moveFrom,
        to: square,
        promotion: 'q', // Always promote to queen for simplicity
      });

      // illegal move
      if (move === null) {
        // if user clicks on another of their pieces, select that piece
        const moves = game.moves({ square, verbose: true });
        if (moves.length > 0) {
            setMoveFrom(square);
            const newOptionSquares = moves.reduce((acc, move) => {
                acc[move.to] = {
                    background: "rgba(255, 255, 0, 0.4)",
                };
                return acc;
            }, {});
            setOptionSquares(newOptionSquares);
        } else {
            // otherwise, deselect
            setMoveFrom(null);
            setOptionSquares({});
        }
        return;
      }
      
      setPosition(game.fen());
      setMoveFrom(null);
      setOptionSquares({});

      if (game.isGameOver()) {
        handleGameOver();
      } else {
        setActiveTimer('computer');
        window.setTimeout(makeComputerMove, 700);
      }
    } catch (e) {
      console.log(e);
      setMoveFrom(null);
      setOptionSquares({});
      return;
    }
  }
  
  function resetGame() {
    const newGame = new Chess();
    setGame(newGame);
    setPosition(newGame.fen());
    setIsGameOver(false);
    setGameOverMessage('');
    setPlayerTime(600);
    setComputerTime(600);
    setActiveTimer('player');
    setMoveFrom(null);
    setOptionSquares({});
  }

  return (
    <main className="relative flex flex-col h-[100svh] w-full max-w-sm mx-auto bg-background overflow-hidden p-4">
      <Particles quantity={30} />
      
      <header className="absolute top-0 left-0 right-0 p-4 z-20 flex items-center">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="font-headline text-xl font-bold text-primary text-center flex-1">
          Игра с компьютером
        </h1>
        <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10" onClick={resetGame}>
            <RefreshCw className="h-5 w-5" />
        </Button>
      </header>
      
      <div className="flex flex-col justify-center items-center flex-1 pt-16 z-10">
        
        <PlayerInfo name="Caïssa Bot" avatar="https://i.pravatar.cc/150?u=caissa-bot" time={computerTime} isComputer />
        
        <div 
          className="w-full aspect-square my-4"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}
        >
          <Chessboard 
              position={position} 
              onSquareClick={onSquareClick}
              boardWidth={360} // Adjusted for a bit of padding within max-w-sm
              customBoardStyle={{
                  borderRadius: '0.5rem',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              }}
              customDarkSquareStyle={{ backgroundColor: 'hsl(var(--secondary))' }}
              customLightSquareStyle={{ backgroundColor: 'hsl(var(--accent))' }}
              customSquareStyles={{
                ...optionSquares,
              }}
              customPieces={{
                wP: ({ squareWidth }) => <div style={{width: squareWidth, height: squareWidth, backgroundImage: "url(/pieces/wP.png)", backgroundSize: '100%', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))'}} />,
                wN: ({ squareWidth }) => <div style={{width: squareWidth, height: squareWidth, backgroundImage: "url(/pieces/wN.png)", backgroundSize: '100%', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))'}} />,
                wB: ({ squareWidth }) => <div style={{width: squareWidth, height: squareWidth, backgroundImage: "url(/pieces/wB.png)", backgroundSize: '100%', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))'}} />,
                wR: ({ squareWidth }) => <div style={{width: squareWidth, height: squareWidth, backgroundImage: "url(/pieces/wR.png)", backgroundSize: '100%', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))'}} />,
                wQ: ({ squareWidth }) => <div style={{width: squareWidth, height: squareWidth, backgroundImage: "url(/pieces/wQ.png)", backgroundSize: '100%', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))'}} />,
                wK: ({ squareWidth }) => <div style={{width: squareWidth, height: squareWidth, backgroundImage: "url(/pieces/wK.png)", backgroundSize: '100%', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))'}} />,
                bP: ({ squareWidth }) => <div style={{width: squareWidth, height: squareWidth, backgroundImage: "url(/pieces/bP.png)", backgroundSize: '100%', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))'}} />,
                bN: ({ squareWidth }) => <div style={{width: squareWidth, height: squareWidth, backgroundImage: "url(/pieces/bN.png)", backgroundSize: '100%', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))'}} />,
                bB: ({ squareWidth }) => <div style={{width: squareWidth, height: squareWidth, backgroundImage: "url(/pieces/bB.png)", backgroundSize: '100%', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))'}} />,
                bR: ({ squareWidth }) => <div style={{width: squareWidth, height: squareWidth, backgroundImage: "url(/pieces/bR.png)", backgroundSize: '100%', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))'}} />,
                bQ: ({ squareWidth }) => <div style={{width: squareWidth, height: squareWidth, backgroundImage: "url(/pieces/bQ.png)", backgroundSize: '100%', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))'}} />,
                bK: ({ squareWidth }) => <div style={{width: squareWidth, height: squareWidth, backgroundImage: "url(/pieces/bK.png)", backgroundSize: '100%', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))'}} />,
              }}
          />
        </div>

        <div className="w-full flex flex-col items-center gap-2">
            <div className="text-center text-primary font-bold h-6">
                {game.isCheck() && !game.isGameOver() && 'Шах!'}
            </div>
            <div className="flex items-center justify-between w-full gap-2">
                <div className="flex-1">
                    <PlayerInfo name={username} avatar={user?.photoURL || `https://i.pravatar.cc/150?u=${user?.uid}`} balance={balance} time={playerTime} />
                </div>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="h-14 w-14 flex-shrink-0 border-primary/30 bg-primary/10">
                            <Smile className="w-6 h-6 text-primary" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-1 bg-black/70 border-primary/20">
                        <div className="flex gap-1">
                            {reactions.map(reaction => (
                                <Button key={reaction.label} variant="ghost" size="icon" className="h-12 w-12 hover:bg-primary/20" title={reaction.label}>
                                    <reaction.icon className="w-6 h-6 text-primary" />
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
      </div>

      <AlertDialog open={isGameOver} onOpenChange={(open) => { if(!open) resetGame() }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary font-headline text-2xl">Игра окончена</AlertDialogTitle>
            <AlertDialogDescription className="text-white/80">
              {gameOverMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={resetGame}>Новая игра</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

    