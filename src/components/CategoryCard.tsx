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

const getCategoryColor = (categoryName: string) => {
  switch (categoryName) {
    case 'Architecture':
      return 'from-blue-500 to-blue-600';
    case 'Development & Deployment':
      return 'from-green-500 to-green-600';
    case 'Scalability & Performance':
      return 'from-yellow-500 to-orange-500';
    case 'Data & Storage':
      return 'from-purple-500 to-purple-600';
    case 'Security & Compliance':
      return 'from-red-500 to-red-600';
    case 'User Experience':
      return 'from-pink-500 to-pink-600';
    case 'Observability & Monitoring':
      return 'from-indigo-500 to-indigo-600';
    case 'Technical Debt Management':
      return 'from-gray-500 to-gray-600';
    case 'Backward Compatibility & Lifecycle':
      return 'from-teal-500 to-teal-600';
    case 'Business Agility':
      return 'from-emerald-500 to-emerald-600';
    default:
      return 'from-blue-500 to-blue-600';
  }
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, completed, onClick }) => {
  const isCompleted = completed === category.questions.length;
  const progressPercentage = (completed / category.questions.length) * 100;

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
    </div>
  );
};