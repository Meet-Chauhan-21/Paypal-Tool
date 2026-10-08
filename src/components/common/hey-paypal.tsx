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
import { Mic, Send, X, Sparkles } from "lucide-react";
import { Orb } from "@/components/common/orb";
import { exampleCommands, routeForCommand } from "@/lib/intent";
import { cn, sleep } from "@/lib/utils";

interface HeyPayPalContextValue {
  open: (initialText?: string) => void;
  close: () => void;
}

const HeyPayPalContext = createContext<HeyPayPalContextValue | null>(null);

type Stage = "prompt" | "listening" | "understanding" | "thinking" | "routing";

const thinkingSteps = ["Searching suppliers", "Comparing prices", "Checking delivery", "Reviewing policy"];

export function HeyPayPalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("prompt");
  const [text, setText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [thinkIndex, setThinkIndex] = useState(0);
  const [isMicActive, setIsMicActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const router = useRouter();

  const open = useCallback((initialText?: string) => {
    setIsOpen(true);
    setStage("prompt");
    setText(initialText ?? "");
    setTranscript("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setStage("prompt");
    setIsMicActive(false);
    recognitionRef.current?.stop?.();
  }, []);

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

  const submit = useCallback(
    async (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      setIsMicActive(false);
      recognitionRef.current?.stop?.();
      setStage("understanding");
      await sleep(650);
      const target = routeForCommand(trimmed);
      if (target.isProcurement) {
        setStage("routing");
        await sleep(450);
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
      await sleep(400);
      close();
      router.push(target.path);
    },
    [close, router],
  );

  const toggleMic = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      inputRef.current?.focus();
      return;
    }
    if (isMicActive) {
      recognitionRef.current?.stop?.();
      setIsMicActive(false);
      return;
    }
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
    };
    recognition.onend = () => setIsMicActive(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsMicActive(true);
    setStage("listening");
  }, [isMicActive]);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <HeyPayPalContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-[#0a0c10]/55 px-4 pb-10 pt-[12vh] backdrop-blur-md sm:pt-[16vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative w-full max-w-xl rounded-3xl border border-subtle bg-surface p-8 shadow-elevated"
            >
              <button
                onClick={close}
                className="absolute right-5 top-5 rounded-full p-1.5 text-faint hover:bg-surface-2 hover:text-ink"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center">
                <Orb
                  size="lg"
                  state={
                    stage === "listening"
                      ? "listening"
                      : stage === "understanding"
                      ? "understanding"
                      : stage === "thinking" || stage === "routing"
                          ? "thinking"
                          : "idle"
                  }
                />
                <p className="mt-5 text-lg font-semibold text-ink">
                  {stage === "prompt" && "Hey PayPal"}
                  {stage === "listening" && "Listening…"}
                  {stage === "understanding" && "Understanding your request…"}
                  {stage === "thinking" && thinkingSteps[thinkIndex % thinkingSteps.length]}
                  {stage === "routing" && "On it…"}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {stage === "prompt" && "Ask me to buy, compare, negotiate, pay, or check anything."}
                  {stage === "listening" && "Speak naturally — I'll transcribe as you go."}
                </p>
              </div>

              <form
                className="mt-6 flex items-center gap-2 rounded-full border border-subtle bg-surface-2 px-2 py-1.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(text);
                }}
              >
                <Sparkles size={16} className="ml-2 shrink-0 text-brand" />
                <input
                  ref={inputRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Try: Buy 30 laptops under $30,000…"
                  className="h-10 flex-1 bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
                />
                <button
                  type="button"
                  onClick={toggleMic}
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
                    isMicActive ? "bg-danger text-white" : "bg-surface text-brand hover:bg-brand-soft",
                  )}
                  aria-label="Toggle microphone"
                >
                  <Mic size={16} />
                </button>
                <button
                  type="submit"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white hover:brightness-110"
                  aria-label="Send"
                >
                  <Send size={15} />
                </button>
              </form>

              {transcript && stage === "listening" && (
                <p className="mt-3 text-center text-sm italic text-muted">“{transcript}”</p>
              )}

              {stage === "prompt" && (
                <div className="mt-6">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-faint">Try saying</p>
                  <div className="flex flex-wrap gap-2">
                    {exampleCommands.map((cmd) => (
                      <button
                        key={cmd}
                        onClick={() => submit(cmd)}
                        className="rounded-full border border-subtle bg-surface px-3 py-1.5 text-left text-xs text-muted transition-colors hover:border-brand hover:text-brand"
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
