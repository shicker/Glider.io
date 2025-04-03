"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import type { GameState } from "@/lib/types"

interface GameBoardProps {
  gameState: GameState
}

export default function GameBoard({ gameState }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { snake, food } = gameState

  // Constants
  const BOARD_WIDTH = 20
  const BOARD_HEIGHT = 20
  const CELL_SIZE = 16 // pixels
  const BOARD_PADDING = 2 // pixels

  // Colors
  const BOARD_COLOR = "#18181b" // zinc-900
  const GRID_COLOR = "#27272a" // zinc-800
  const SNAKE_COLOR = "#10b981" // emerald-500
  const SNAKE_HEAD_COLOR = "#34d399" // emerald-400
  const FOOD_COLOR = "#ec4899" // pink-500

  // Draw the game board
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const canvasWidth = BOARD_WIDTH * CELL_SIZE + BOARD_PADDING * 2
    const canvasHeight = BOARD_HEIGHT * CELL_SIZE + BOARD_PADDING * 2

    // Set canvas size
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Clear canvas
    ctx.fillStyle = BOARD_COLOR
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Draw grid
    ctx.strokeStyle = GRID_COLOR
    ctx.lineWidth = 0.5

    // Draw vertical grid lines
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath()
      ctx.moveTo(x * CELL_SIZE + BOARD_PADDING, BOARD_PADDING)
      ctx.lineTo(x * CELL_SIZE + BOARD_PADDING, BOARD_HEIGHT * CELL_SIZE + BOARD_PADDING)
      ctx.stroke()
    }

    // Draw horizontal grid lines
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath()
      ctx.moveTo(BOARD_PADDING, y * CELL_SIZE + BOARD_PADDING)
      ctx.lineTo(BOARD_WIDTH * CELL_SIZE + BOARD_PADDING, y * CELL_SIZE + BOARD_PADDING)
      ctx.stroke()
    }

    // Draw food
    ctx.fillStyle = FOOD_COLOR
    ctx.beginPath()
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2 + BOARD_PADDING,
      food.y * CELL_SIZE + CELL_SIZE / 2 + BOARD_PADDING,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2,
    )
    ctx.fill()

    // Draw snake
    snake.forEach((segment, index) => {
      // Use different color for head
      ctx.fillStyle = index === 0 ? SNAKE_HEAD_COLOR : SNAKE_COLOR

      // Draw rounded rectangle for each segment
      const x = segment.x * CELL_SIZE + BOARD_PADDING + 1
      const y = segment.y * CELL_SIZE + BOARD_PADDING + 1
      const width = CELL_SIZE - 2
      const height = CELL_SIZE - 2
      const radius = 4

      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
      ctx.fill()
    })
  }, [snake, food])

  return (
    <motion.div
      className="relative mx-auto my-4 rounded-lg overflow-hidden shadow-lg"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <canvas
        ref={canvasRef}
        width={BOARD_WIDTH * CELL_SIZE + BOARD_PADDING * 2}
        height={BOARD_HEIGHT * CELL_SIZE + BOARD_PADDING * 2}
        className="block"
      />
    </motion.div>
  )
}

