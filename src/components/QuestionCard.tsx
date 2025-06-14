import React, { useState, useEffect } from 'react';
import { Question, Answer } from '../types/assessment';

interface QuestionCardProps {
  question: Question;
  answer: Answer | undefined;
  onAnswerChange: (questionId: number, value: 'yes' | 'no') => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, answer, onAnswerChange }) => {
  const [sliderValue, setSliderValue] = useState<number>(answer?.value === 'yes' ? 100 : answer?.value === 'no' ? 0 : 50);

  useEffect(() => {
    setSliderValue(answer?.value === 'yes' ? 100 : answer?.value === 'no' ? 0 : 50);
  }, [answer]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    onAnswerChange(question.id, value >= 50 ? 'yes' : 'no');
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-3 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold flex-shrink-0 mt-0.5">
              {question.id}
            </span>
            <p className="text-gray-800 font-medium leading-relaxed text-sm">{question.text}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-1 lg:flex-shrink-0 min-w-[100px]">
          <div className="w-1/2 flex justify-between text-xs font-medium px-1">
            <span className="text-red-600">No</span>
            <span className="text-green-600">Yes</span>
          </div>
          <div className="w-1/2">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gradient"
              style={{
                background: `linear-gradient(to right, 
                  ${sliderValue <= 50 ? '#ef4444' : '#22c55e'} 
                  ${sliderValue}%, 
                  #e5e7eb ${sliderValue}%)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};