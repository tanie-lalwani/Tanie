import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <h1 className="text-3xl font-bold">React + TypeScript + Tailwind</h1>
        <p className="mt-2 text-slate-300">You are ready to build 🚀</p>

        <div className="mt-6">
          <button
            className="rounded-lg bg-indigo-500 px-4 py-2 font-medium hover:bg-indigo-400"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Edit src/App.tsx and save to test HMR
        </p>
      </div>
    </main>
  )
}

export default App
