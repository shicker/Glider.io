"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import GameBoard from "./game-board"
import GameControls from "./game-controls"
import ScoreBoard from "./score-board"
import { type GameState, Direction } from "@/lib/types"

export default function SnakeGame() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [playerName, setPlayerName] = useState("Player")
  const [showStartDialog, setShowStartDialog] = useState(true)
  const [showGameOverDialog, setShowGameOverDialog] = useState(false)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const gameSpeedRef = useRef(150) // ms between updates

  // Initialize game
  const initGame = useCallback(() => {
    fetch("/api/game/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName }),
    })
      .then((res) => res.json())
      .then((data) => {
        setGameState(parseGameState(data))
        setShowStartDialog(false)
        setShowGameOverDialog(false)
      })
      .catch((err) => console.error("Error initializing game:", err))
  }, [playerName])

  // Update game state
  const updateGame = useCallback(() => {
    fetch("/api/game/update", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        const newState = parseGameState(data)
        setGameState(newState)

        if (newState.gameOver) {
          stopGameLoop()
          setShowGameOverDialog(true)
        }
      })
      .catch((err) => console.error("Error updating game:", err))
  }, [])

  // Parse game state from API response
  const parseGameState = (data: any): GameState => {
    return {
      snake: data.snake.split(";").map((pos: string) => {
        const [x, y] = pos.split(",").map(Number)
        return { x, y }
      }),
      food: {
        x: Number.parseInt(data.food.split(",")[0]),
        y: Number.parseInt(data.food.split(",")[1]),
      },
      score: Number.parseInt(data.score),
      gameOver: data.gameOver === "true",
      playerName: data.playerName,
    }
  }

  // Start game loop
  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    gameLoopRef.current = setInterval(updateGame, gameSpeedRef.current)
  }, [updateGame])

  // Stop game loop
  const stopGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
      gameLoopRef.current = null
    }
  }, [])

  // Handle direction change
  const changeDirection = useCallback((direction: Direction) => {
    fetch("/api/game/direction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    }).catch((err) => console.error("Error changing direction:", err))
  }, [])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState || gameState.gameOver) return

      switch (e.key) {
        case "ArrowUp":
          changeDirection(Direction.UP)
          break
        case "ArrowDown":
          changeDirection(Direction.DOWN)
          break
        case "ArrowLeft":
          changeDirection(Direction.LEFT)
          break
        case "ArrowRight":
          changeDirection(Direction.RIGHT)
          break
        case " ": // Space bar to pause/resume
          if (gameLoopRef.current) {
            stopGameLoop()
          } else {
            startGameLoop()
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState, changeDirection, startGameLoop, stopGameLoop])

  // Start game
  const handleStartGame = () => {
    initGame()
    setTimeout(startGameLoop, 500) // Small delay to ensure game is initialized
  }

  // Restart game
  const handleRestartGame = () => {
    initGame()
    setTimeout(startGameLoop, 500)
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-6">
      <AnimatePresence>
        {gameState && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <ScoreBoard score={gameState.score} playerName={gameState.playerName} />
            <GameBoard gameState={gameState} />
            <GameControls
              onDirectionChange={changeDirection}
              onPause={stopGameLoop}
              onResume={startGameLoop}
              isPaused={!gameLoopRef.current}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Game Dialog */}
      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-light tracking-wider">SNAKE</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm text-zinc-400 mb-2 block">Enter Your Name</label>
            <Input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              maxLength={15}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleStartGame} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Start Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Game Over Dialog */}
      <Dialog open={showGameOverDialog} onOpenChange={setShowGameOverDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-light tracking-wider">GAME OVER</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-zinc-400 mb-2">Your Score</p>
            <p className="text-3xl font-bold text-emerald-500">{gameState?.score || 0}</p>
          </div>
          <DialogFooter>
            <Button onClick={handleRestartGame} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Play Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

