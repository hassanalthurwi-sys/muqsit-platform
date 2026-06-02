import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WhatsAppMessage } from "@/lib/mock/types";

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function WhatsAppBubble({ message }: { message: WhatsAppMessage }) {
  const isSystem = message.from === "system";
  return (
    <div className={cn("flex w-full", isSystem ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[78%] space-y-1 rounded-2xl px-4 py-2.5 text-sm leading-6 shadow-[var(--shadow-soft)]",
          isSystem
            ? "bg-card text-foreground rounded-ss-sm"
            : "bg-success-soft text-success-foreground rounded-se-sm",
        )}
      >
        {message.type === "image" ? (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 p-2">
            <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <ImageIcon className="size-4" />
            </span>
            <span className="num text-xs">{message.body}</span>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.body}</p>
        )}
        <p className="num text-end text-[10px] text-muted-foreground">{formatTime(message.ts)}</p>
      </div>
    </div>
  );
}
