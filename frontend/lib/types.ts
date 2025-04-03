export interface GameState {
  snake: { x: number; y: number }[]
  food: { x: number; y: number }
  score: number
  gameOver: boolean
  playerName: string
}

export enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

