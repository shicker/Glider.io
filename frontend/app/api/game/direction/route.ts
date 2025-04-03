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

export async function POST(request: NextRequest) {
  try {
    const { direction } = await request.json()

    // Prevent 180-degree turns
    if (
      (gameState.direction === "UP" && direction !== "DOWN") ||
      (gameState.direction === "DOWN" && direction !== "UP") ||
      (gameState.direction === "LEFT" && direction !== "RIGHT") ||
      (gameState.direction === "RIGHT" && direction !== "LEFT")
    ) {
      gameState.direction = direction
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error changing direction:", error)
    return NextResponse.json({ error: "Failed to change direction" }, { status: 500 })
  }
}

