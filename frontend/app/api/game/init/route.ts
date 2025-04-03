import { type NextRequest, NextResponse } from "next/server"

// This would be replaced with actual C++ backend integration
let gameState = {
  snake: [],
  food: { x: 0, y: 0 },
  direction: "RIGHT",
  score: 0,
  gameOver: false,
  playerName: "Player",
}

const BOARD_WIDTH = 20
const BOARD_HEIGHT = 20
const INITIAL_SNAKE_LENGTH = 3

export async function POST(request: NextRequest) {
  try {
    const { playerName } = await request.json()

    // Reset game state
    gameState = {
      snake: [],
      food: { x: 0, y: 0 },
      direction: "RIGHT",
      score: 0,
      gameOver: false,
      playerName: playerName || "Player",
    }

    // Initialize snake in the center of the board
    const startX = Math.floor(BOARD_WIDTH / 2)
    const startY = Math.floor(BOARD_HEIGHT / 2)

    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      gameState.snake.push({ x: startX - i, y: startY })
    }

    // Place initial food
    placeFood()

    // Format response to match C++ backend format
    const response = {
      snake: gameState.snake.map((s) => `${s.x},${s.y}`).join(";"),
      food: `${gameState.food.x},${gameState.food.y}`,
      score: gameState.score.toString(),
      gameOver: gameState.gameOver.toString(),
      playerName: gameState.playerName,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error initializing game:", error)
    return NextResponse.json({ error: "Failed to initialize game" }, { status: 500 })
  }
}

// Helper function to place food
function placeFood() {
  let x, y
  let validPosition = false

  while (!validPosition) {
    x = Math.floor(Math.random() * BOARD_WIDTH)
    y = Math.floor(Math.random() * BOARD_HEIGHT)

    validPosition = true

    // Check if position is occupied by snake
    for (const segment of gameState.snake) {
      if (segment.x === x && segment.y === y) {
        validPosition = false
        break
      }
    }
  }

  gameState.food = { x, y }
}

