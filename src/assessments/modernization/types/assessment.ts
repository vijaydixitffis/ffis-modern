export interface Question {
  id: number;
  text: string;
  category: string;
}

export interface Answer {
  questionId: number;
  value: 'yes' | 'no' | null;
}

export interface AssessmentResult {
  score: number;
  percentage: number;
  status: string;
  statusColor: string;
  description: string;
}

export interface Category {
  name: string;
  questions: Question[];
}

export interface CategoryProgress {
  categoryName: string;
  completed: number;
  total: number;
}