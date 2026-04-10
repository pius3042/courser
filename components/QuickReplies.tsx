interface Props {
  replies: string[];
  onSelect: (reply: string) => void;
  onReset?: () => void;
  disabled: boolean;
}

export default function QuickReplies({ replies, onSelect, onReset, disabled }: Props) {
  if (replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2.5">
      {replies.map((reply) => (
        <button
          key={reply}
          onClick={() => onSelect(reply)}
          disabled={disabled}
          className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(167,139,250,0.5)',
            color: '#7c3aed',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, #a78bfa, #7c3aed)';
            (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
            (e.currentTarget as HTMLButtonElement).style.border = '1px solid transparent';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.6)';
            (e.currentTarget as HTMLButtonElement).style.color = '#7c3aed';
            (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(167,139,250,0.5)';
          }}
        >
          {reply}
        </button>
      ))}
      {onReset && (
        <button
          onClick={onReset}
          disabled={disabled}
          className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: 'rgba(255,255,255,0.4)',
            border: '1px solid rgba(209,213,219,0.6)',
            color: '#9ca3af',
            backdropFilter: 'blur(8px)',
          }}
        >
          ← All options
        </button>
      )}
    </div>
  );
}
