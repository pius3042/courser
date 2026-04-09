export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 px-4 py-1 message-fade-in">
      {/* Bot avatar */}
      <div className="w-8 h-8 rounded-full bg-[#0084FF] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm">
        🎂
      </div>

      {/* Typing bubble */}
      <div className="bg-[#E4E6EB] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1 shadow-sm">
        <span className="typing-dot w-2 h-2 rounded-full bg-gray-500 block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-gray-500 block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-gray-500 block" />
      </div>
    </div>
  );
}
