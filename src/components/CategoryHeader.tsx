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
  TrendingUp 
} from 'lucide-react';

interface CategoryHeaderProps {
  categoryName: string;
  questionCount: number;
}

const getCategoryIcon = (categoryName: string) => {
  switch (categoryName) {
    case 'Architecture':
      return <Layers className="w-6 h-6" />;
    case 'Development & Deployment':
      return <Rocket className="w-6 h-6" />;
    case 'Scalability & Performance':
      return <Zap className="w-6 h-6" />;
    case 'Data & Storage':
      return <Database className="w-6 h-6" />;
    case 'Security & Compliance':
      return <Shield className="w-6 h-6" />;
    case 'User Experience':
      return <Smartphone className="w-6 h-6" />;
    case 'Observability & Monitoring':
      return <Activity className="w-6 h-6" />;
    case 'Technical Debt Management':
      return <Code className="w-6 h-6" />;
    case 'Backward Compatibility & Lifecycle':
      return <RefreshCw className="w-6 h-6" />;
    case 'Business Agility':
      return <TrendingUp className="w-6 h-6" />;
    default:
      return <Layers className="w-6 h-6" />;
  }
};

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ categoryName, questionCount }) => {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="text-blue-600">
          {getCategoryIcon(categoryName)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{categoryName}</h2>
          <p className="text-gray-600 text-sm">{questionCount} questions in this category</p>
        </div>
      </div>
    </div>
  );
};