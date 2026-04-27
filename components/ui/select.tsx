'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps {
  value: string | number;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const SelectContext = React.createContext<{
  value: string | number;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function Select({ value, onValueChange, children, placeholder, className }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Find the label of the selected item
  const selectedLabel = React.useMemo(() => {
    let label = '';
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === SelectItem) {
        const p = child.props as SelectItemProps;
        if (String(p.value) === String(value)) {
          label = String(p.children);
        }
      }
    });
    return label;
  }, [children, value]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div ref={ref} className={cn('relative', className)}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            'flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50',
            'hover:border-white/20 transition-colors',
            !value && 'text-white/30'
          )}
        >
          <span>{selectedLabel || placeholder || 'Select...'}</span>
          <ChevronDown className={cn('w-4 h-4 text-white/30 transition-transform', open && 'rotate-180')} />
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-white/10 bg-[#0d1530] shadow-2xl shadow-black/40">
            <div className="max-h-60 overflow-auto py-1">
              {children}
            </div>
          </div>
        )}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectItem({ value, children }: SelectItemProps) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) return null;
  const isSelected = String(ctx.value) === String(value);

  return (
    <button
      type="button"
      onClick={() => { ctx.onValueChange(value); ctx.setOpen(false); }}
      className={cn(
        'flex w-full items-center px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors text-left',
        isSelected && 'bg-blue-500/15 text-blue-400 font-medium'
      )}
    >
      {children}
    </button>
  );
}
