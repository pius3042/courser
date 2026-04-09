interface Props {
  replies: string[];
  onSelect: (reply: string) => void;
  disabled: boolean;
}

export default function QuickReplies({ replies, onSelect, disabled }: Props) {
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
    </div>
  );
}
