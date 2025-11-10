
'use client';

import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"

export default function PlayVsComputerPage() {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');
  
  // Make a move for the computer
  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) {
        handleGameOver();
        return;
    }
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    const move = possibleMoves[randomIndex];
    game.move(move);
    setPosition(game.fen());
    if (game.isGameOver() || game.isDraw()){
        handleGameOver();
    }
  }

  function handleGameOver() {
    setIsGameOver(true);
    let message = 'Игра окончена';
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
    setGameOverMessage(message);
  }

  // Handle piece drop
  function onDrop(sourceSquare: string, targetSquare: string): boolean {
    if (game.isGameOver()) return false;

    let move = null;
    try {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Always promote to a queen for simplicity
      });
    } catch (e) {
        // illegal move
        return false;
    }
    
    // If move is illegal, chess.js returns null
    if (move === null) return false;

    setPosition(game.fen());
    
    if (game.isGameOver() || game.isDraw()){
        handleGameOver();
    } else {
        // If the game is not over, schedule the computer's move
        window.setTimeout(makeRandomMove, 500);
    }

    return true;
  }
  
  function resetGame() {
    const newGame = new Chess();
    setGame(newGame);
    setPosition(newGame.fen());
    setIsGameOver(false);
    setGameOverMessage('');
  }

  return (
    <main className="relative flex flex-col h-[100svh] w-full max-w-sm mx-auto bg-background overflow-hidden">
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
      
      <div className="flex-1 flex flex-col items-center justify-center pt-16 px-4 z-10">
        <div className="w-full aspect-square rounded-lg overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/10">
            <Chessboard 
                position={position} 
                onPieceDrop={onDrop}
                boardWidth={400} // This will be constrained by the container
                customBoardStyle={{
                    borderRadius: '0.5rem',
                    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                }}
                customDarkSquareStyle={{ backgroundColor: 'hsl(var(--secondary))' }}
                customLightSquareStyle={{ backgroundColor: 'hsl(var(--accent))' }}
                customDropSquareStyle={{ boxShadow: 'inset 0 0 1px 4px hsl(var(--primary))' }}
            />
        </div>
        <p className="text-center text-primary font-bold mt-4 h-6">
            {game.isCheck() && !game.isGameOver() ? 'Шах!' : ''}
        </p>
      </div>

      <AlertDialog open={isGameOver} onOpenChange={setIsGameOver}>
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
