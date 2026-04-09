interface Props {
  replies: string[];
  onSelect: (reply: string) => void;
  onReset?: () => void;
  disabled: boolean;
}

export default function QuickReplies({ replies, onSelect, onReset, disabled }: Props) {
  if (replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      {replies.map((reply) => (
        <button
          key={reply}
          onClick={() => onSelect(reply)}
          disabled={disabled}
          className="px-3 py-1.5 rounded-full border border-[#0084FF] text-[#0084FF] text-sm font-medium
                     hover:bg-[#0084FF] hover:text-white transition-colors duration-150
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {reply}
        </button>
      ))}
      {onReset && (
        <button
          onClick={onReset}
          disabled={disabled}
          className="px-3 py-1.5 rounded-full border border-gray-300 text-gray-400 text-sm font-medium
                     hover:border-gray-400 hover:text-gray-600 transition-colors duration-150
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← All options
        </button>
      )}
    </div>
  );
}
