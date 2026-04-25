'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, Award } from 'lucide-react';

interface CourseCardProps {
  course: {
    code: string;
    title: string;
    units: number;
    compulsory: boolean;
    prerequisites?: string[];
  };
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function CourseCard({ course, selected, onToggle, disabled }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 ${
        selected
          ? 'border-blue-500 bg-blue-50/70 shadow-xl ring-2 ring-blue-200/50'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg hover:bg-blue-50/30'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && onToggle()}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Checkbox 
            checked={selected} 
            disabled={disabled} 
            onCheckedChange={onToggle}
            className="mt-1"
          />
          <div>
            <h3 className="font-bold text-lg text-gray-900">{course.code}</h3>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{course.title}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={course.compulsory ? 'destructive' : 'default'}>
            {course.compulsory ? 'Compulsory' : 'Elective'}
          </Badge>
          <div className="flex items-center gap-1 text-blue-600">
            <Award className="w-4 h-4" />
            <span className="font-semibold text-sm">{course.units} Units</span>
          </div>
        </div>
      </div>
      
      {course.prerequisites && course.prerequisites.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <BookOpen className="w-3 h-3" />
            <span>Prerequisites: {course.prerequisites.join(', ')}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
