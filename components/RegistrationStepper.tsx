'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface Step {
  title: string;
  description: string;
}

interface RegistrationStepperProps {
  steps: Step[];
  currentStep: number;
}

export default function RegistrationStepper({ steps, currentStep }: RegistrationStepperProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative flex items-center justify-between">
        {/* Background line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/10 z-0" />
        
        {/* Progress line */}
        <div 
          className="absolute top-6 left-0 h-0.5 bg-blue-500 z-10 transition-all duration-500 ease-in-out"
          style={{ 
            width: `${(currentStep / (steps.length - 1)) * 100}%` 
          }}
        />

        {steps.map((step, index) => (
          <div key={index} className="relative z-20 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: index <= currentStep ? 1 : 0.9,
              }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              {/* Step circle */}
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                ${index < currentStep 
                  ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30' 
                  : index === currentStep 
                  ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/5 border-white/20 text-white/40'
                }
              `}>
                {index < currentStep ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="font-bold text-lg">{index + 1}</span>
                )}
              </div>
              
              {/* Step content */}
              <div className="mt-3 text-center max-w-32">
                <p className={`text-sm font-semibold transition-colors duration-300 ${
                  index <= currentStep ? 'text-white' : 'text-white/40'
                }`}>
                  {step.title}
                </p>
                <p className={`text-xs mt-1 leading-tight transition-colors duration-300 ${
                  index <= currentStep ? 'text-white/60' : 'text-white/30'
                }`}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}