'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  target?: string;
}

interface TourGuideProps {
  steps: TourStep[];
  tourKey: string; // Unique key for localStorage
  onComplete?: () => void;
}

export default function TourGuide({ steps, tourKey, onComplete }: TourGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem(`tour_${tourKey}`);
    if (!hasSeenTour) {
      // Show tour after a short delay
      setTimeout(() => setIsOpen(true), 500);
    } else {
      setShowButton(true);
    }
  }, [tourKey]);

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep(0);
    localStorage.setItem(`tour_${tourKey}`, 'true');
    setShowButton(true);
    onComplete?.();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  return (
    <>
      {/* Help Button - Shows after tour is completed */}
      {showButton && !isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRestart}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60"
          title="Show Guide"
        >
          <HelpCircle className="w-6 h-6" />
        </motion.button>
      )}

      {/* Tour Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
              onClick={handleClose}
            />

            {/* Tour Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-lg mx-4"
            >
              <div className="glass-effect rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Progress Indicator */}
                <div className="flex gap-2 mb-6">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        index <= currentStep ? 'bg-blue-500' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      {steps[currentStep].title}
                    </h2>
                    <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8">
                      {steps[currentStep].description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="text-sm text-white/40">
                    {currentStep + 1} / {steps.length}
                  </div>

                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all"
                  >
                    <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                    {currentStep < steps.length - 1 && <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>

                {/* Skip Button */}
                <button
                  onClick={handleClose}
                  className="w-full mt-4 text-sm text-white/40 hover:text-white/60 transition-colors"
                >
                  Skip tour
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
