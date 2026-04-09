import type { Message } from '@/lib/types';

interface Props {
  message: Message;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function renderText(text: string) {
  return text.split('\n').map((line, lineIdx, lines) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const rendered = parts.map((part, partIdx) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={partIdx}>{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    );
    return (
      <span key={lineIdx}>
        {rendered}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-end gap-2 px-4 py-1 message-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Bot avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#0084FF] flex items-center justify-center flex-shrink-0 text-white text-xs shadow-sm">
          🎂
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'bg-[#0084FF] text-white rounded-br-sm'
              : 'bg-[#E4E6EB] text-gray-800 rounded-bl-sm'
          }`}
        >
          {renderText(message.content)}
        </div>

        {/* Timestamp */}
        <span className="text-[11px] text-gray-400 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
