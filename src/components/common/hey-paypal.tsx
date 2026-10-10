"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Send, X, Sparkles, Volume2, ArrowRight } from "lucide-react";
import { VoiceAssistantOrb } from "@/components/common/voice-assistant-orb";
import { exampleCommands, routeForCommand } from "@/lib/intent";
import { cn, sleep } from "@/lib/utils";

interface HeyPayPalContextValue {
  open: (initialText?: string, startListening?: boolean) => void;
  close: () => void;
}

const HeyPayPalContext = createContext<HeyPayPalContextValue | null>(null);

type Stage = "prompt" | "listening" | "understanding" | "thinking" | "routing";

const thinkingSteps = [
  "Analyzing requirements...",
  "Searching verified suppliers...",
  "Negotiating commercial pricing...",
  "Validating corporate policy...",
];

export function HeyPayPalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("prompt");
  const [text, setText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [thinkIndex, setThinkIndex] = useState(0);
  const [isMicActive, setIsMicActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const autoFollowTimeoutRef = useRef<any>(null);
  const router = useRouter();

  const stopMic = useCallback(() => {
    if (autoFollowTimeoutRef.current) clearTimeout(autoFollowTimeoutRef.current);
    try {
      recognitionRef.current?.stop?.();
    } catch {
      // ignore
    }
    setIsMicActive(false);
  }, []);

  const close = useCallback(() => {
    stopMic();
    setIsOpen(false);
    setStage("prompt");
  }, [stopMic]);

  const submit = useCallback(
    async (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;

      stopMic();
      setStage("understanding");
      await sleep(600);

      const target = routeForCommand(trimmed);
      if (target.isProcurement) {
        setStage("routing");
        await sleep(400);
        close();
        router.push(`/procure?autorun=1&q=${encodeURIComponent(trimmed)}`);
        return;
      }

      setStage("thinking");
      for (let i = 0; i < 2; i++) {
        setThinkIndex(i);
        await sleep(450);
      }

      setStage("routing");
      await sleep(350);
      close();
      router.push(target.path);
    },
    [close, router, stopMic],
  );

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      inputRef.current?.focus();
      return;
    }

    try {
      recognitionRef.current?.stop?.();
    } catch {
      // ignore
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let combined = "";
        for (let i = 0; i < event.results.length; i++) {
          combined += event.results[i][0].transcript;
        }
        setTranscript(combined);
        setText(combined);

        // Auto-follow: When speech finishes, automatically follow through with the action
        if (autoFollowTimeoutRef.current) clearTimeout(autoFollowTimeoutRef.current);
        if (combined.trim().length > 3) {
          autoFollowTimeoutRef.current = setTimeout(() => {
            void submit(combined);
          }, 1400);
        }
      };

      recognition.onerror = () => {
        setIsMicActive(false);
      };

      recognition.onend = () => {
        setIsMicActive(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsMicActive(true);
      setStage("listening");
    } catch {
      setIsMicActive(false);
    }
  }, [submit]);

  const toggleMic = useCallback(() => {
    if (isMicActive) {
      stopMic();
      setStage("prompt");
    } else {
      startListening();
    }
  }, [isMicActive, startListening, stopMic]);

  const open = useCallback(
    (initialText?: string, autoListen = false) => {
      setIsOpen(true);
      setStage(autoListen ? "listening" : "prompt");
      setText(initialText ?? "");
      setTranscript("");

      if (autoListen) {
        setTimeout(() => startListening(), 200);
      } else {
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    },
    [startListening],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        isOpen ? close() : open();
      }
      if (e.key === "Escape" && isOpen) close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, open, close]);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <HeyPayPalContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className="relative w-full max-w-lg rounded-3xl border border-slate-200/90 bg-white/95 p-7 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 sm:p-9"
            >
              {/* Close Button */}
              <button
                onClick={close}
                className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Animated Central Assistant Visualizer */}
              <div className="flex flex-col items-center text-center">
                <VoiceAssistantOrb
                  size="md"
                  isListening={stage === "listening" || isMicActive}
                  onClick={toggleMic}
                />

                <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {stage === "prompt" && "How can I help your business?"}
                  {stage === "listening" && "Listening... Speak naturally"}
                  {stage === "understanding" && "Understanding intent..."}
                  {stage === "thinking" && thinkingSteps[thinkIndex % thinkingSteps.length]}
                  {stage === "routing" && "Executing action..."}
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  {stage === "prompt" &&
                    "Speak or type to research suppliers, negotiate discounts, or verify orders."}
                  {stage === "listening" &&
                    "Your speech is transcribed live. Actions follow automatically when you finish speaking."}
                  {stage === "understanding" && "Formulating agent parameters..."}
                  {stage === "thinking" && "Applying policy guardrails..."}
                  {stage === "routing" && "Opening targeted workspace..."}
                </p>
              </div>

              {/* Live Transcript Bubble */}
              {transcript && (
                <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-center text-xs font-medium text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-200 animate-fade-up">
                  <span className="opacity-70">Transcribed:</span> “{transcript}”
                  {isMicActive && (
                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                  )}
                </div>
              )}

              {/* Input & Action Bar */}
              <form
                className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 dark:border-slate-800 dark:bg-slate-800/80 dark:focus-within:border-blue-500 dark:focus-within:bg-slate-900"
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit(text);
                }}
              >
                <input
                  ref={inputRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or speak: 'Buy 30 laptops under $30,000'..."
                  className="h-10 flex-1 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
                />

                <button
                  type="button"
                  onClick={toggleMic}
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all shadow-2xs",
                    isMicActive
                      ? "bg-emerald-600 text-white animate-pulse"
                      : "bg-white border border-slate-200 text-slate-700 hover:text-blue-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300",
                  )}
                  title={isMicActive ? "Stop listening" : "Start speaking"}
                >
                  <Mic size={16} />
                </button>

                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
                >
                  <span>Action</span>
                  <ArrowRight size={13} />
                </button>
              </form>

              {/* Quick Action Suggestion Chips */}
              <div className="mt-5">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Quick Examples
                </p>
                <div className="flex flex-wrap gap-2">
                  {exampleCommands.map((cmd) => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => void submit(cmd)}
                      className="rounded-lg border border-slate-200/80 bg-white px-2.5 py-1 text-left text-xs text-slate-600 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </HeyPayPalContext.Provider>
  );
}

export function useHeyPayPal() {
  const ctx = useContext(HeyPayPalContext);
  if (!ctx) throw new Error("useHeyPayPal must be used within HeyPayPalProvider");
  return ctx;
}
