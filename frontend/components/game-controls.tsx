"use client"

import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Pause, Play } from "lucide-react"
import { Direction } from "@/lib/types"

interface GameControlsProps {
  onDirectionChange: (direction: Direction) => void
  onPause: () => void
  onResume: () => void
  isPaused: boolean
}

export default function GameControls({ onDirectionChange, onPause, onResume, isPaused }: GameControlsProps) {
  return (
    <div className="w-full mt-4">
      {/* Pause/Resume Button */}
      <div className="flex justify-center mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={isPaused ? onResume : onPause}
          className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
        </Button>
      </div>

      {/* Direction Controls */}
      <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto">
        <div className="col-start-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDirectionChange(Direction.UP)}
            className="w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
          >
            <ArrowUp size={20} />
          </Button>
        </div>
        <div className="col-start-1 row-start-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDirectionChange(Direction.LEFT)}
            className="w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
          >
            <ArrowLeft size={20} />
          </Button>
        </div>
        <div className="col-start-2 row-start-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDirectionChange(Direction.DOWN)}
            className="w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
          >
            <ArrowDown size={20} />
          </Button>
        </div>
        <div className="col-start-3 row-start-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDirectionChange(Direction.RIGHT)}
            className="w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
          >
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>

      <div className="text-center mt-4 text-xs text-zinc-500">Use arrow keys to move, space to pause/resume</div>
    </div>
  )
}

