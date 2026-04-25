'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Warning {
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  courses?: string[];
}

interface SmartWarningsProps {
  warnings: Warning[];
  onDismiss?: (index: number) => void;
}

export default function SmartWarnings({ warnings, onDismiss }: SmartWarningsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <Info className="w-6 h-6 text-gray-600" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {warnings.map((warning, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`rounded-xl border-2 p-5 ${getColors(warning.type)} shadow-lg`}
          >
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex-shrink-0"
              >
                {getIcon(warning.type)}
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-2">{warning.title}</h3>
                <p className="text-sm mb-3 leading-relaxed">{warning.message}</p>
                
                {warning.courses && warning.courses.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {warning.courses.map((course, courseIndex) => (
                      <motion.span
                        key={course}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + courseIndex * 0.1 }}
                        className="px-3 py-1 bg-white/70 rounded-full text-xs font-medium border border-white/50 shadow-sm"
                      >
                        {course}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>

              {onDismiss && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismiss(index)}
                    className="p-2 h-auto hover:bg-white/50 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}