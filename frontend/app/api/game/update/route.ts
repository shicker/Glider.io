import { type NextRequest, NextResponse } from "next/server"

// This would be replaced with actual C++ backend integration
// Accessing the gameState from the init route
declare const gameState: {
  snake: { x: number; y: number }[]
  food: { x: number; y: number }
  direction: string
  score: number
  gameOver: boolean
  playerName: string
}

const BOARD_WIDTH = 20
const BOARD_HEIGHT = 20

export async function POST(request: NextRequest) {
  try {
    if (gameState.gameOver) {
      // Format response to match C++ backend format
      const response = {
        snake: gameState.snake.map((s) => `${s.x},${s.y}`).join(";"),
        food: `${gameState.food.x},${gameState.food.y}`,
        score: gameState.score.toString(),
        gameOver: gameState.gameOver.toString(),
        playerName: gameState.playerName,
      }

      return NextResponse.json(response)
    }

    // Get head position
    const head = { ...gameState.snake[0] }

    // Calculate new head position based on direction
    switch (gameState.direction) {
      case "UP":
        head.y -= 1
        break
      case "DOWN":
        head.y += 1
        break
      case "LEFT":
        head.x -= 1
        break
      case "RIGHT":
        head.x += 1
        break
    }

    // Check for collisions with walls
    if (head.x < 0 || head.x >= BOARD_WIDTH || head.y < 0 || head.y >= BOARD_HEIGHT) {
      gameState.gameOver = true
    } else {
      // Check for collisions with self (except tail which will move)
      for (let i = 0; i < gameState.snake.length - 1; i++) {
        if (gameState.snake[i].x === head.x && gameState.snake[i].y === head.y) {
          gameState.gameOver = true
          break
        }
      }
    }

    if (!gameState.gameOver) {
      // Move snake
      gameState.snake.unshift(head)

      // Check if food was eaten
      if (head.x === gameState.food.x && head.y === gameState.food.y) {
        gameState.score += 10
        placeFood()
      } else {
        // Remove tail if no food was eaten
        gameState.snake.pop()
      }
    }

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
    console.error("Error updating game:", error)
    return NextResponse.json({ error: "Failed to update game" }, { status: 500 })
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

