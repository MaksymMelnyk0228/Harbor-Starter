import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import { Button } from "../../components/Button";
import { Spinner } from "../../components/States";

interface Board {
  highlights: string[];
  suggestedQuestions: string[];
}

interface ChatTurn {
  role: "merchant" | "assistant";
  text: string;
}

export function AdminInsightsPage() {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([
    {
      role: "assistant",
      text: "Ask about sales, promotions, reordering, conversion, or your highest-value customers.",
    },
  ]);

  const board = useQuery({
    queryKey: ["admin-insights"],
    queryFn: () => api<Board>("/api/admin/insights"),
  });

  const chat = useMutation({
    mutationFn: (next: string) =>
      api<{ question: string; answer: string }>("/api/admin/insights/chat", {
        method: "POST",
        body: JSON.stringify({ question: next }),
      }),
    onSuccess: (result) => {
      setTurns((current) => [...current, { role: "assistant", text: result.answer }]);
    },
  });

  function ask(next: string) {
    setTurns((current) => [...current, { role: "merchant", text: next }]);
    chat.mutate(next);
    setQuestion("");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (question.trim()) ask(question.trim());
  }

  if (board.isLoading || !board.data) return <Spinner />;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <section>
        <h1 className="font-serif text-4xl">AI Insights</h1>
        <p className="mt-2 text-sm text-ink-500">Merchant assistant based on your live catalog, orders, and inventory.</p>
        <div className="surface mt-6 space-y-4 p-5">
          {turns.map((turn, index) => (
            <article
              key={`${turn.role}-${index}`}
              className={turn.role === "assistant" ? "rounded-2xl bg-paper-50 p-4" : "text-right"}
            >
              <p className="text-xs uppercase tracking-[0.16em] text-ink-500">{turn.role}</p>
              <p className="mt-1 leading-relaxed">{turn.text}</p>
            </article>
          ))}
          <form onSubmit={onSubmit} className="flex gap-2">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="h-11 flex-1 rounded-full border border-paper-200 px-4"
              placeholder="Ask a question"
            />
            <Button type="submit" disabled={chat.isPending}>
              Send
            </Button>
          </form>
        </div>
      </section>
      <aside className="space-y-4">
        <section className="surface p-5">
          <h2 className="font-medium">Highlights</h2>
          <ul className="mt-3 space-y-3 text-sm text-ink-700">
            {board.data.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="surface p-5">
          <h2 className="font-medium">Suggested questions</h2>
          <div className="mt-3 flex flex-col gap-2">
            {board.data.suggestedQuestions.map((item) => (
              <button
                key={item}
                className="rounded-xl bg-paper-50 px-3 py-2 text-left text-sm hover:bg-paper-100"
                onClick={() => ask(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
