"use client"

import { motion } from "framer-motion"

interface ScoreBoardProps {
  score: number
  playerName: string
}

export default function ScoreBoard({ score, playerName }: ScoreBoardProps) {
  return (
    <div className="flex justify-between items-center mb-2 px-2">
      <div className="text-zinc-400 text-sm">{playerName}</div>
      <motion.div
        key={score}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        className="bg-zinc-800 px-3 py-1 rounded-full text-emerald-400 font-medium"
      >
        {score}
      </motion.div>
    </div>
  )
}

