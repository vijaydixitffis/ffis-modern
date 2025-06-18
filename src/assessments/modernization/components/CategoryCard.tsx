import React from 'react';
import { 
  Layers, 
  Rocket, 
  Zap, 
  Database, 
  Shield, 
  Smartphone, 
  Activity, 
  Code, 
  RefreshCw, 
  TrendingUp,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { Category } from '../types/assessment';

interface CategoryCardProps {
  category: Category;
  completed: number;
  onClick: () => void;
  isLastCategory?: boolean;
  onClose?: () => void;
}

const getCategoryIcon = (categoryName: string) => {
  switch (categoryName) {
    case 'Architecture':
      return <Layers className="w-5 h-5" />;
    case 'Development & Deployment':
      return <Rocket className="w-5 h-5" />;
    case 'Scalability & Performance':
      return <Zap className="w-5 h-5" />;
    case 'Data & Storage':
      return <Database className="w-5 h-5" />;
    case 'Security & Compliance':
      return <Shield className="w-5 h-5" />;
    case 'User Experience':
      return <Smartphone className="w-5 h-5" />;
    case 'Observability & Monitoring':
      return <Activity className="w-5 h-5" />;
    case 'Technical Debt Management':
      return <Code className="w-5 h-5" />;
    case 'Backward Compatibility & Lifecycle':
      return <RefreshCw className="w-5 h-5" />;
    case 'Business Agility':
      return <TrendingUp className="w-5 h-5" />;
    default:
      return <Layers className="w-5 h-5" />;
  }
};

const getCategoryColor = (categoryName: string): string => {
  const colors = {
    'Architecture': 'from-blue-500 to-blue-600',
    'Development & Deployment': 'from-purple-500 to-purple-600',
    'Scalability & Performance': 'from-green-500 to-green-600',
    'Data & Storage': 'from-yellow-500 to-yellow-600',
    'Security & Compliance': 'from-red-500 to-red-600',
    'User Experience': 'from-indigo-500 to-indigo-600',
    'Observability & Monitoring': 'from-pink-500 to-pink-600',
    'Technical Debt Management': 'from-teal-500 to-teal-600',
    'Backward Compatibility & Lifecycle': 'from-orange-500 to-orange-600',
    'Business Agility': 'from-cyan-500 to-cyan-600'
  };
  return colors[categoryName as keyof typeof colors] || 'from-gray-500 to-gray-600';
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, completed, onClick, isLastCategory = false, onClose }) => {
  const isCompleted = completed === category.questions.length;
  const progressPercentage = (completed / category.questions.length) * 100;
  const canClose = isLastCategory && isCompleted;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-md border border-gray-100 p-3 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 group h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(category.name)} text-white`}>
          {getCategoryIcon(category.name)}
        </div>
        <div className="flex items-center gap-1">
          {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
      
      <h3 className="text-sm font-bold text-gray-800 mb-1 group-hover:text-gray-900 transition-colors leading-tight">
        {category.name}
      </h3>
      
      <p className="text-gray-600 text-xs mb-2 flex-1">
        {category.questions.length} questions
      </p>
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-gray-800">
            {completed}/{category.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full bg-gradient-to-r ${getCategoryColor(category.name)} transition-all duration-500`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Close button for last category */}
      {isLastCategory && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (canClose && onClose) {
              onClose();
            }
          }}
          disabled={!canClose}
          className={`mt-2 w-full py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${
            canClose
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Close & View Results
        </button>
      )}
    </div>
  );
};