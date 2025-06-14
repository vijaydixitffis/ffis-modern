import { Answer, AssessmentResult } from '../types/assessment';

export const calculateScore = (answers: Answer[]): AssessmentResult => {
  const totalQuestions = 34;
  const yesCount = answers.filter(answer => answer.value === 'yes').length;
  const percentage = Math.round((yesCount / totalQuestions) * 100);
  
  let status: string;
  let statusColor: string;
  let description: string;
  
  if (percentage >= 80) {
    status = "Fully Modern";
    statusColor = "text-green-600 bg-green-50 border-green-200";
    description = "Excellent! Your application demonstrates cutting-edge modern practices across all areas.";
  } else if (percentage >= 60) {
    status = "Moderately Modern";
    statusColor = "text-blue-600 bg-blue-50 border-blue-200";
    description = "Good progress! Your application has solid modern foundations with room for enhancement.";
  } else if (percentage >= 40) {
    status = "Needs Modernization";
    statusColor = "text-orange-600 bg-orange-50 border-orange-200";
    description = "Your application has some modern elements but requires significant modernization efforts.";
  } else {
    status = "Legacy System";
    statusColor = "text-red-600 bg-red-50 border-red-200";
    description = "Your application would benefit greatly from comprehensive modernization initiatives.";
  }
  
  return {
    score: yesCount,
    percentage,
    status,
    statusColor,
    description
  };
};