import SnakeGame from "@/components/snake-game"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-black p-4">
      <h1 className="text-3xl md:text-4xl font-light text-white mb-8 tracking-wider">SNAKE</h1>
      <SnakeGame />
    </main>
  )
}

