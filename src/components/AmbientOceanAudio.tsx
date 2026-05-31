import { useEffect, useRef, useState } from "react"

type AmbientGraph = {
  context: AudioContext
  masterGain: GainNode
  deepNoise: AudioBufferSourceNode
  shimmerNoise: AudioBufferSourceNode
  swellLfo: OscillatorNode
}

const AMBIENT_ENABLED_KEY = "tanie:ambientOceanEnabled"
const AMBIENT_VOLUME = 0.14
const UNDERWATER_VOLUME = 0.24
const UNDERWATER_TRACK_SRC = "/Underwater.mp3"

type AmbientOceanAudioProps = {
  placement?: "floating" | "inline"
}

function createAudioContext(): AudioContext | null {
  const contextConstructor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

  if (!contextConstructor) {
    return null
  }

  return new contextConstructor()
}

function createNoiseBuffer(context: AudioContext, durationSeconds = 4): AudioBuffer {
  const sampleRate = context.sampleRate
  const frameCount = Math.floor(sampleRate * durationSeconds)
  const buffer = context.createBuffer(2, frameCount, sampleRate)

  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const channelData = buffer.getChannelData(channel)

    for (let index = 0; index < frameCount; index += 1) {
      channelData[index] = Math.random() * 2 - 1
    }
  }

  return buffer
}

export default function AmbientOceanAudio({ placement = "floating" }: AmbientOceanAudioProps) {
  const [isEnabled, setIsEnabled] = useState(() => {
    try {
      const storedValue = window.localStorage.getItem(AMBIENT_ENABLED_KEY)
      return storedValue === null ? true : storedValue === "true"
    } catch {
      return true
    }
  })
  const [isAudioReady, setIsAudioReady] = useState(false)
  const [isUnderwaterSectionActive, setIsUnderwaterSectionActive] = useState(false)
  const graphRef = useRef<AmbientGraph | null>(null)
  const cleanupTimerRef = useRef<number | null>(null)
  const underwaterAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(AMBIENT_ENABLED_KEY, String(isEnabled))
    } catch {
      // Ignore storage failures in private browsing or locked-down contexts.
    }
  }, [isEnabled])

  useEffect(() => {
    let frame = 0

    const updateSectionMode = () => {
      frame = 0

      const aboutSection = document.getElementById("about")
      if (!aboutSection) {
        setIsUnderwaterSectionActive(false)
        return
      }

      // Start the underwater audio a little earlier so it lines up with the visual transition.
      // Increase threshold from 0.45 -> 0.65 to trigger near the section transition.
      const nextIsUnderwater = aboutSection.getBoundingClientRect().top < window.innerHeight * 0.85
      setIsUnderwaterSectionActive((current) => (current === nextIsUnderwater ? current : nextIsUnderwater))
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateSectionMode)
    }

    scheduleUpdate()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }

      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
    }
  }, [])

  useEffect(() => {
    const cleanupUnderwaterAudio = () => {
      const audio = underwaterAudioRef.current
      if (!audio) {
        return
      }

      audio.pause()
      audio.currentTime = 0
    }

    const cleanupGraph = () => {
      if (cleanupTimerRef.current !== null) {
        window.clearTimeout(cleanupTimerRef.current)
        cleanupTimerRef.current = null
      }

      const graph = graphRef.current
      if (!graph) {
        return
      }

      const now = graph.context.currentTime
      graph.masterGain.gain.cancelScheduledValues(now)
      graph.masterGain.gain.setTargetAtTime(0, now, 0.05)

      cleanupTimerRef.current = window.setTimeout(() => {
        try {
          graph.deepNoise.stop()
        } catch {
          // ignore double-stop cleanup errors
        }

        try {
          graph.shimmerNoise.stop()
        } catch {
          // ignore double-stop cleanup errors
        }

        try {
          graph.swellLfo.stop()
        } catch {
          // ignore double-stop cleanup errors
        }

        graph.deepNoise.disconnect()
        graph.shimmerNoise.disconnect()
        graph.swellLfo.disconnect()
        graph.masterGain.disconnect()

        void graph.context.close()
        graphRef.current = null
      }, 180)
    }

    const startShoreGraph = async () => {
      if (graphRef.current) {
        const existingGraph = graphRef.current
        const now = existingGraph.context.currentTime
        existingGraph.masterGain.gain.cancelScheduledValues(now)
        existingGraph.masterGain.gain.setTargetAtTime(AMBIENT_VOLUME, now, 0.08)
        setIsAudioReady(existingGraph.context.state === "running")
        return
      }

      const context = createAudioContext()
      if (!context) {
        setIsAudioReady(false)
        return
      }

      if (context.state === "suspended") {
        try {
          await context.resume()
        } catch {
          setIsAudioReady(false)
          return
        }
      }

      const noiseBuffer = createNoiseBuffer(context)
      const masterGain = context.createGain()
      const bodyFilter = context.createBiquadFilter()
      const deepFilter = context.createBiquadFilter()
      const shimmerFilter = context.createBiquadFilter()
      const swellLfo = context.createOscillator()
      const swellLfoGain = context.createGain()
      const deepNoise = context.createBufferSource()
      const shimmerNoise = context.createBufferSource()
      const outputCompressor = context.createDynamicsCompressor()

      deepNoise.buffer = noiseBuffer
      deepNoise.loop = true
      shimmerNoise.buffer = noiseBuffer
      shimmerNoise.loop = true

      bodyFilter.type = "lowpass"
      bodyFilter.frequency.value = 1100
      bodyFilter.Q.value = 0.7

      deepFilter.type = "lowpass"
      deepFilter.frequency.value = 140
      deepFilter.Q.value = 0.8

      shimmerFilter.type = "bandpass"
      shimmerFilter.frequency.value = 520
      shimmerFilter.Q.value = 0.5

      outputCompressor.threshold.value = -22
      outputCompressor.knee.value = 20
      outputCompressor.ratio.value = 4
      outputCompressor.attack.value = 0.01
      outputCompressor.release.value = 0.3

      masterGain.gain.value = 0
      swellLfo.frequency.value = 0.05
      swellLfoGain.gain.value = 0.045

      deepNoise.connect(deepFilter)
      deepFilter.connect(bodyFilter)
      shimmerNoise.connect(shimmerFilter)
      shimmerFilter.connect(bodyFilter)
      bodyFilter.connect(outputCompressor)
      outputCompressor.connect(masterGain)
      masterGain.connect(context.destination)

      swellLfo.connect(swellLfoGain)
      swellLfoGain.connect(masterGain.gain)

      deepNoise.start()
      shimmerNoise.start()
      swellLfo.start()

      masterGain.gain.setTargetAtTime(AMBIENT_VOLUME, context.currentTime, 0.12)

      graphRef.current = {
        context,
        masterGain,
        deepNoise,
        shimmerNoise,
        swellLfo,
      }
      setIsAudioReady(true)
    }

    const startUnderwaterTrack = async () => {
      cleanupGraph()

      const audio = underwaterAudioRef.current ?? new Audio(UNDERWATER_TRACK_SRC)
      if (!underwaterAudioRef.current) {
        underwaterAudioRef.current = audio
        audio.loop = true
        audio.preload = "auto"
        audio.volume = UNDERWATER_VOLUME
      }

      if (!audio.src.endsWith(UNDERWATER_TRACK_SRC)) {
        audio.src = UNDERWATER_TRACK_SRC
      }

      try {
        await audio.play()
        setIsAudioReady(true)
      } catch {
        setIsAudioReady(false)
      }
    }

    const syncAudioMode = async () => {
      if (!isEnabled) {
        cleanupGraph()
        cleanupUnderwaterAudio()
        setIsAudioReady(false)
        return
      }

      if (isUnderwaterSectionActive) {
        await startUnderwaterTrack()
        return
      }

      cleanupUnderwaterAudio()
      await startShoreGraph()
    }

    void syncAudioMode()

    const handleUnlockGesture = () => {
      if (!isEnabled) {
        return
      }

      if (isUnderwaterSectionActive) {
        void startUnderwaterTrack()
        return
      }

      const graph = graphRef.current
      if (graph && graph.context.state === "suspended") {
        void graph.context.resume().then(() => setIsAudioReady(true)).catch(() => undefined)
        return
      }

      if (!graph) {
        void startShoreGraph()
      }
    }

    window.addEventListener("pointerdown", handleUnlockGesture, { passive: true })
    window.addEventListener("keydown", handleUnlockGesture)

    return () => {
      window.removeEventListener("pointerdown", handleUnlockGesture)
      window.removeEventListener("keydown", handleUnlockGesture)
      cleanupGraph()
      cleanupUnderwaterAudio()
    }
  }, [isEnabled, isUnderwaterSectionActive])

  const isInline = placement === "inline"

  return (
    <div
      className={isInline ? "relative inline-flex" : "pointer-events-none fixed bottom-4 right-4 z-[60] flex max-w-[calc(100vw-1.5rem)] justify-end px-2 sm:bottom-5 sm:right-5 sm:px-0"}
    >
      <button
        type="button"
        className={`pointer-events-auto group flex items-center rounded-full border text-left shadow-[0_18px_45px_rgba(2,8,23,0.24)] backdrop-blur-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-200/70 ${
          isEnabled
            ? "border-cyan-100/20 bg-slate-950/72 text-sky-50 hover:border-cyan-100/34 hover:bg-slate-950/86"
            : "border-white/10 bg-slate-950/52 text-sky-100/72 hover:border-white/18 hover:bg-slate-950/70"
        } ${isInline ? "h-8 w-8 justify-center p-0" : "gap-3 px-4 py-2.5"}`}
        onClick={() => setIsEnabled((current) => !current)}
        aria-pressed={isEnabled}
        aria-label={isEnabled ? "Disable ocean ambient audio" : "Enable ocean ambient audio"}
      >
        <span
          className={`relative flex items-center justify-center rounded-full border transition ${isEnabled ? "border-cyan-100/18 bg-cyan-100/8" : "border-white/8 bg-white/5"} ${isInline ? "h-8 w-8" : "h-10 w-10"}`}
          aria-hidden="true"
        >
          <span className={`absolute inset-0 rounded-full ${isEnabled ? "animate-pulse bg-cyan-200/10" : "bg-transparent"}`} />
          {isEnabled ? (
            <svg viewBox="0 0 24 24" className={`relative ${isInline ? "h-4.5 w-4.5" : "h-5 w-5"} ${isEnabled ? "text-cyan-100" : "text-sky-100/70"}`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5.5 6.2 9.1H3.5v5.8h2.7L11 18.5z" />
              <path d="M15.2 8.1a3.9 3.9 0 0 1 0 7.8" />
              <path d="M17.9 5.4a7.6 7.6 0 0 1 0 13.2" opacity="0.85" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className={`relative ${isInline ? "h-4.5 w-4.5" : "h-5 w-5"} ${isEnabled ? "text-cyan-100" : "text-sky-100/70"}`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5.5 6.2 9.1H3.5v5.8h2.7L11 18.5z" />
              <path d="M14.8 9.2a4.1 4.1 0 0 1 .8 2.5c0 .9-.3 1.8-.8 2.5" />
              <path d="m17.5 6.5 4 4m0-4-4 4" />
            </svg>
          )}
        </span>

        <span className={`flex min-w-0 flex-col leading-tight ${isInline ? "hidden" : ""}`}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-100/46">Ambient</span>
          <span className="text-sm font-medium text-white/88">
            {isEnabled
              ? (isUnderwaterSectionActive
                ? (isAudioReady ? "Underwater sound on" : "Starting underwater track")
                : (isAudioReady ? "Sea shore audio on" : "Starting shore ambience"))
              : "Tap to enable sound"}
          </span>
        </span>
      </button>
    </div>
  )
}