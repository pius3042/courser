export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 px-4 py-1 message-fade-in">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs shadow-md"
        style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)' }}
      >
        🎂
      </div>

      <div
        className="rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1 shadow-sm"
        style={{
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.6)',
        }}
      >
        <span className="typing-dot w-2 h-2 rounded-full bg-violet-400 block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-violet-400 block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-violet-400 block" />
      </div>
    </div>
  );
}
