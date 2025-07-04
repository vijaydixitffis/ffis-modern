import React, { useState, useMemo } from 'react';
import { Brain, CheckCircle, ChevronRight, ChevronLeft, X, BarChart2, Database, Settings, Users, DollarSign, Shield, Building2, Check } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface Question {
  id: number;
  text: string;
  category: string;
}

interface Answer {
  questionId: number;
  value: number;
}

interface CategoryProgress {
  category: string;
  completed: number;
  total: number;
}

interface AssessmentResult {
  score: number;
  level: string;
  message: string;
  recommendations: string[];
}

interface BasicInfo {
  companyName: string;
  contactName: string;
  designation: string;
  email: string;
  phone: string;
}

interface AIReadinessAssessmentProps {
  onComplete: () => void;
}

const categories = [
  {
    name: "Business Strategy and Objectives",
    questions: [
      { id: 1, text: "Our organization has clearly defined AI objectives aligned with business goals.", category: "Business Strategy and Objectives" },
      { id: 2, text: "Executive leadership actively supports and sponsors AI initiatives.", category: "Business Strategy and Objectives" },
      { id: 3, text: "We have identified and prioritized AI use cases across business units.", category: "Business Strategy and Objectives" },
      { id: 4, text: "Success metrics for AI projects are well-defined and measurable.", category: "Business Strategy and Objectives" },
      { id: 5, text: "There is a clear roadmap for AI adoption and scaling.", category: "Business Strategy and Objectives" }
    ]
  },
  {
    name: "Technological Infrastructure",
    questions: [
      { id: 6, text: "Our IT infrastructure can support AI workloads (e.g., GPUs, scalable storage).", category: "Technological Infrastructure" },
      { id: 7, text: "We have reliable cloud or on-premises resources for AI development.", category: "Technological Infrastructure" },
      { id: 8, text: "Integration between existing systems and new AI applications is seamless.", category: "Technological Infrastructure" },
      { id: 9, text: "We use modern tools for deploying and managing AI models.", category: "Technological Infrastructure" },
      { id: 10, text: "Our technology stack can scale with increased AI adoption.", category: "Technological Infrastructure" }
    ]
  },
  {
    name: "Data Infrastructure and Quality",
    questions: [
      { id: 11, text: "We have a comprehensive inventory of all data sources.", category: "Data Infrastructure and Quality" },
      { id: 12, text: "Data required for AI is easily accessible to relevant teams.", category: "Data Infrastructure and Quality" },
      { id: 13, text: "Our data is accurate, complete, and up to date.", category: "Data Infrastructure and Quality" },
      { id: 14, text: "Data governance policies (access, privacy, retention) are well established.", category: "Data Infrastructure and Quality" },
      { id: 15, text: "Data pipelines are automated and robust for AI needs.", category: "Data Infrastructure and Quality" },
      { id: 16, text: "Data labeling and preparation processes are mature.", category: "Data Infrastructure and Quality" },
      { id: 17, text: "We regularly monitor and improve data quality.", category: "Data Infrastructure and Quality" },
      { id: 18, text: "There are clear data ownership and stewardship roles.", category: "Data Infrastructure and Quality" },
      { id: 19, text: "Our data infrastructure supports real-time and batch processing.", category: "Data Infrastructure and Quality" },
      { id: 20, text: "Data security and compliance requirements are consistently met.", category: "Data Infrastructure and Quality" }
    ]
  },
  {
    name: "Operations and Process Efficiency",
    questions: [
      { id: 21, text: "Key business processes are mapped and documented.", category: "Operations and Process Efficiency" },
      { id: 22, text: "We have identified opportunities to automate repetitive tasks with AI.", category: "Operations and Process Efficiency" },
      { id: 23, text: "Operational workflows support rapid experimentation and deployment.", category: "Operations and Process Efficiency" },
      { id: 24, text: "Incident response plans exist for AI system failures.", category: "Operations and Process Efficiency" },
      { id: 25, text: "There is a feedback loop from operations to improve AI models.", category: "Operations and Process Efficiency" }
    ]
  },
  {
    name: "Talent and Skills",
    questions: [
      { id: 26, text: "We have sufficient in-house AI and data science expertise.", category: "Talent and Skills" },
      { id: 27, text: "Training programs exist to upskill employees in AI-related areas.", category: "Talent and Skills" },
      { id: 28, text: "Our hiring strategy addresses gaps in AI talent.", category: "Talent and Skills" },
      { id: 29, text: "Employees are receptive to AI-driven change.", category: "Talent and Skills" },
      { id: 30, text: "Cross-functional teams collaborate effectively on AI projects.", category: "Talent and Skills" }
    ]
  },
  {
    name: "Financial Preparedness and ROI",
    questions: [
      { id: 31, text: "Budgets for AI projects are clearly allocated and managed.", category: "Financial Preparedness and ROI" },
      { id: 32, text: "We have a cost model for AI initiatives (hardware, software, talent).", category: "Financial Preparedness and ROI" },
      { id: 33, text: "ROI metrics are tracked for AI investments.", category: "Financial Preparedness and ROI" },
      { id: 34, text: "Financial controls are in place for AI-related spending.", category: "Financial Preparedness and ROI" },
      { id: 35, text: "There is a process to reassess AI investments based on results.", category: "Financial Preparedness and ROI" }
    ]
  },
  {
    name: "Governance, Compliance, and Ethics",
    questions: [
      { id: 36, text: "Data privacy and security policies are enforced for AI projects.", category: "Governance, Compliance, and Ethics" },
      { id: 37, text: "AI ethics guidelines (fairness, transparency) are documented and followed.", category: "Governance, Compliance, and Ethics" },
      { id: 38, text: "Regulatory compliance for AI systems is regularly reviewed.", category: "Governance, Compliance, and Ethics" },
      { id: 39, text: "There is a governance board overseeing AI initiatives.", category: "Governance, Compliance, and Ethics" },
      { id: 40, text: "Regular audits are conducted on AI models and data usage.", category: "Governance, Compliance, and Ethics" }
    ]
  },
  {
    name: "Department-Specific Readiness",
    questions: [
      { id: 41, text: "AI opportunities in core business processes are well understood.", category: "Department-Specific Readiness" },
      { id: 42, text: "Business units collaborate with IT on AI projects.", category: "Department-Specific Readiness" },
      { id: 43, text: "IT can support, monitor, and maintain AI systems reliably.", category: "Department-Specific Readiness" },
      { id: 44, text: "IT security is adapted to AI-specific risks.", category: "Department-Specific Readiness" },
      { id: 45, text: "Operations staff are trained to work with AI-enabled tools.", category: "Department-Specific Readiness" },
      { id: 46, text: "AI is used to optimize operational efficiency.", category: "Department-Specific Readiness" },
      { id: 47, text: "HR uses AI for talent management, recruitment, or workforce planning.", category: "Department-Specific Readiness" },
      { id: 48, text: "Change management processes are in place for AI adoption.", category: "Department-Specific Readiness" },
      { id: 49, text: "Finance uses AI for forecasting, risk, or fraud detection.", category: "Department-Specific Readiness" },
      { id: 50, text: "Admin processes are being automated or improved with AI.", category: "Department-Specific Readiness" }
    ]
  }
];

const getCategoryColor = (categoryName: string): string => {
  const colors = {
    'Business Strategy and Objectives': 'from-blue-500 to-blue-600',
    'Technological Infrastructure': 'from-purple-500 to-purple-600',
    'Data Infrastructure and Quality': 'from-green-500 to-green-600',
    'Operations and Process Efficiency': 'from-yellow-500 to-yellow-600',
    'Talent and Skills': 'from-red-500 to-red-600',
    'Financial Preparedness and ROI': 'from-indigo-500 to-indigo-600',
    'Governance, Compliance, and Ethics': 'from-pink-500 to-pink-600',
    'Department-Specific Readiness': 'from-teal-500 to-teal-600'
  };
  return colors[categoryName as keyof typeof colors] || 'from-gray-500 to-gray-600';
};

const getCategoryIcon = (categoryName: string) => {
  switch (categoryName) {
    case "Business Strategy and Objectives":
      return <Brain className="w-5 h-5" />;
    case "Technological Infrastructure":
      return <Settings className="w-5 h-5" />;
    case "Data Infrastructure and Quality":
      return <Database className="w-5 h-5" />;
    case "Operations and Process Efficiency":
      return <BarChart2 className="w-5 h-5" />;
    case "Talent and Skills":
      return <Users className="w-5 h-5" />;
    case "Financial Preparedness and ROI":
      return <DollarSign className="w-5 h-5" />;
    case "Governance, Compliance, and Ethics":
      return <Shield className="w-5 h-5" />;
    case "Department-Specific Readiness":
      return <Building2 className="w-5 h-5" />;
    default:
      return <Brain className="w-5 h-5" />;
  }
};

interface CategoryCardProps {
  category: {
    name: string;
    questions: Question[];
  };
  completed: number;
  onClick: () => void;
  disabled?: boolean;
  isLastCategory?: boolean;
  onClose?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, completed, onClick, disabled, isLastCategory = false, onClose }) => {
  const total = category.questions.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const isCompleted = completed === total;
  const canClose = isLastCategory && isCompleted;

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`bg-white rounded-xl shadow-md border border-gray-100 p-4 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 group h-full flex flex-col ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(category.name)} text-white`}>
          {getCategoryIcon(category.name)}
        </div>
        <div className="flex items-center gap-1">
          {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
      
      <h3 className="text-sm font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors leading-tight">
        {category.name}
      </h3>
      
      <p className="text-gray-600 text-xs mb-3 flex-1">
        {category.questions.length} questions
      </p>
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-gray-800">
            {completed}/{total}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full bg-gradient-to-r ${getCategoryColor(category.name)} transition-all duration-500`}
            style={{ width: `${progress}%` }}
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
          className={`mt-3 w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
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

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  questions: Question[];
  answers: Record<number, number>;
  onAnswerChange: (questionId: number, value: number) => void;
  onNavigateCategory: (categoryIndex: number) => void;
  onCloseAndShowResults?: () => void;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({ 
  isOpen, 
  onClose, 
  category, 
  questions, 
  answers, 
  onAnswerChange,
  onNavigateCategory,
  onCloseAndShowResults
}) => {
  const currentCategoryIndex = categories.findIndex(c => c.name === category);
  const isLastCategory = currentCategoryIndex === categories.length - 1;
  
  // Check if all questions in current category are answered
  const answeredQuestions = questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== null).length;
  const allQuestionsAnswered = answeredQuestions === questions.length;

  const handleSliderChange = (questionId: number, value: number) => {
    onAnswerChange(questionId, value);
  };

  const handleNextCategory = () => {
    if (currentCategoryIndex < categories.length - 1) {
      onClose();
      setTimeout(() => {
        onNavigateCategory(currentCategoryIndex + 1);
      }, 100);
    }
  };

  const handlePreviousCategory = () => {
    if (currentCategoryIndex > 0) {
      onClose();
      setTimeout(() => {
        onNavigateCategory(currentCategoryIndex - 1);
      }, 100);
    }
  };

  const handleCloseAndShowResults = () => {
    if (onCloseAndShowResults) {
      onCloseAndShowResults();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">{category}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Questions */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {questions.map((question) => (
              <div 
                key={question.id} 
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex items-center gap-4">
                  <p className="text-gray-800 flex-1">{question.text}</p>
                  <div className="flex items-center gap-2 w-[20%]">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={answers[question.id] || 3}
                      onChange={(e) => handleSliderChange(question.id, parseInt(e.target.value))}
                      className="w-full h-1.5 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-700 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-300 [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-lg [&::-webkit-slider-runnable-track]:bg-gradient-to-r [&::-webkit-slider-runnable-track]:from-red-500 [&::-webkit-slider-runnable-track]:via-orange-500 [&::-webkit-slider-runnable-track]:via-blue-500 [&::-webkit-slider-runnable-track]:via-green-300 [&::-webkit-slider-runnable-track]:to-green-700 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-700 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-300 [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-lg [&::-moz-range-track]:bg-gradient-to-r [&::-moz-range-track]:from-red-500 [&::-moz-range-track]:via-orange-500 [&::-moz-range-track]:via-blue-500 [&::-moz-range-track]:via-green-300 [&::-moz-range-track]:to-green-700"
                      style={{
                        background: 'transparent',
                      } as React.CSSProperties}
                    />
                    <span className="text-sm font-medium text-gray-700 min-w-[2rem] text-center">
                      {answers[question.id] || '-'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePreviousCategory}
              disabled={currentCategoryIndex === 0}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                currentCategoryIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Category {currentCategoryIndex + 1} of {categories.length}
            </span>
            {isLastCategory ? (
              <button
                onClick={handleCloseAndShowResults}
                disabled={!allQuestionsAnswered}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  allQuestionsAnswered
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Close
                <CheckCircle className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleNextCategory}
                className="px-4 py-2 rounded-lg flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OverallProgress: React.FC<{
  totalQuestions: number;
  answeredQuestions: number;
}> = ({ totalQuestions, answeredQuestions }) => {
  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Overall Progress</h3>
        <span className="text-sm text-gray-600">
          {answeredQuestions} of {totalQuestions} questions answered
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const ResultsModal: React.FC<{
  result: AssessmentResult;
  onClose: () => void;
}> = ({ result, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Assessment Results</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {result.score.toFixed(1)}%
            </p>
            <p className="text-xl font-semibold text-gray-800 mb-1">
              {result.level}
            </p>
            <p className="text-gray-600 mb-4">{result.message}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <span className="text-blue-500">•</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const BasicInfoDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (info: BasicInfo) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<BasicInfo>({
    companyName: '',
    contactName: '',
    designation: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              id="companyName"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person Name *
            </label>
            <input
              type="text"
              id="contactName"
              required
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
              Designation *
            </label>
            <input
              type="text"
              id="designation"
              required
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AIReadinessAssessment: React.FC<AIReadinessAssessmentProps> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);
  const [showBasicInfo, setShowBasicInfo] = useState(false);
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const totalQuestions = 50; // Fixed total questions
  const answeredQuestions = answers.filter(answer => answer.value !== null).length;
  const allQuestionsAnswered = answeredQuestions === totalQuestions;

  const categoryProgress: CategoryProgress[] = useMemo(() => {
    return categories.map(category => {
      const completed = category.questions.filter(question => {
        const answer = answers.find(a => a.questionId === question.id);
        return answer && answer.value !== null;
      }).length;
      
      return {
        category: category.name,
        completed,
        total: category.questions.length
      };
    });
  }, [answers]);

  const assessmentResult = useMemo(() => {
    if (allQuestionsAnswered) {
      const totalScore = answers.reduce((sum, answer) => sum + (answer.value || 0), 0);
      const maxPossibleScore = totalQuestions * 5;
      const percentage = (totalScore / maxPossibleScore) * 100;

      let level = '';
      let message = '';
      let recommendations: string[] = [];

      if (percentage >= 80) {
        level = 'Advanced';
        message = 'Your organization demonstrates exceptional readiness for AI adoption';
        recommendations = [
          'Focus on scaling AI initiatives across the organization',
          'Develop advanced AI capabilities and innovation centers',
          'Establish AI leadership in your industry',
          'Create AI-driven competitive advantages',
          'Implement continuous AI improvement programs'
        ];
      } else if (percentage >= 60) {
        level = 'Mature';
        message = 'Your organization shows strong readiness for AI implementation';
        recommendations = [
          'Address remaining gaps in AI infrastructure',
          'Expand AI use cases to more business units',
          'Strengthen AI governance and compliance',
          'Enhance AI talent development programs',
          'Optimize AI operational processes'
        ];
      } else if (percentage >= 40) {
        level = 'Developing';
        message = 'Your organization has moderate readiness for AI adoption';
        recommendations = [
          'Develop a comprehensive AI strategy and roadmap',
          'Invest in core AI infrastructure and capabilities',
          'Build essential AI skills and expertise',
          'Establish basic AI governance frameworks',
          'Start with pilot AI projects in key areas'
        ];
      } else if (percentage >= 20) {
        level = 'Early Stage';
        message = 'Your organization is in the initial stages of AI readiness';
        recommendations = [
          'Create awareness and education about AI benefits',
          'Assess current technology infrastructure gaps',
          'Develop basic data management capabilities',
          'Identify quick-win AI opportunities',
          'Build foundational AI skills and knowledge'
        ];
      } else {
        level = 'Not Ready';
        message = 'Your organization needs significant preparation for AI adoption';
        recommendations = [
          'Develop a clear vision for AI adoption',
          'Address fundamental technology infrastructure needs',
          'Establish basic data management practices',
          'Create awareness about AI importance',
          'Build essential technical capabilities'
        ];
      }

      return {
        score: percentage,
        level,
        message,
        recommendations
      };
    }
    return null;
  }, [answers, allQuestionsAnswered, totalQuestions]);

  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(answer => answer.questionId === questionId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { questionId, value };
        return updated;
      } else {
        return [...prev, { questionId, value }];
      }
    });
  };

  const handleCategoryClick = (categoryIndex: number) => {
    setSelectedCategoryIndex(categoryIndex);
  };

  const handleNavigateCategory = (categoryIndex: number) => {
    setSelectedCategoryIndex(categoryIndex);
  };

  const handleCloseDialog = () => {
    setSelectedCategoryIndex(null);
  };

  const handleCloseAndShowResults = () => {
    setSelectedCategoryIndex(null);
    setShowResults(true);
  };

  const handleStartAssessment = () => {
    setShowBasicInfo(true);
  };

  const handleBasicInfoSubmit = (info: BasicInfo) => {
    setBasicInfo(info);
    setShowBasicInfo(false);
    setIsAssessmentStarted(true);
  };

  const handleSubmitAssessment = async () => {
    if (allQuestionsAnswered && basicInfo) {
      // Construct responses string: '1-2,2-5,...,50-3'
      const responses = answers
        .sort((a, b) => a.questionId - b.questionId)
        .map(a => `${a.questionId}-${a.value}`)
        .join(',');

      // Insert into Supabase
      await supabase.from('ai_response').insert([
        {
          company_name: basicInfo.companyName,
          contact_name: basicInfo.contactName,
          designation: basicInfo.designation,
          email: basicInfo.email,
          phone: basicInfo.phone,
          responses,
        }
      ]);

      setShowSuccessMessage(true);
    }
  };

  const handleResetAssessment = () => {
    setAnswers([]);
    setIsAssessmentStarted(false);
    setShowResults(false);
  };

  const getCompletedCount = (categoryName: string): number => {
    const category = categories.find(c => c.name === categoryName);
    if (!category) return 0;
    
    return category.questions.filter(question => {
      const answer = answers.find(a => a.questionId === question.id);
      return answer && answer.value !== null;
    }).length;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">AI Readiness Assessment</h1>
        <p className="text-gray-600 mt-1">Evaluate your organization's readiness for AI adoption</p>
      </div>

      {/* Basic Information Display */}
      {basicInfo && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Organization Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Company Name</p>
              <p className="font-medium text-gray-800">{basicInfo.companyName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact Person</p>
              <p className="font-medium text-gray-800">{basicInfo.contactName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Designation</p>
              <p className="font-medium text-gray-800">{basicInfo.designation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{basicInfo.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-800">{basicInfo.phone}</p>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.name}
            category={category}
            completed={getCompletedCount(category.name)}
            onClick={() => handleCategoryClick(index)}
            disabled={!isAssessmentStarted}
            isLastCategory={index === categories.length - 1}
            onClose={handleCloseAndShowResults}
          />
        ))}
      </div>

      {/* Overall Progress */}
      {isAssessmentStarted && (
        <OverallProgress
          totalQuestions={totalQuestions}
          answeredQuestions={answeredQuestions}
        />
      )}

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-white border-t border-gray-200 py-4 flex justify-center space-x-4 shadow-lg">
        <button
          onClick={handleStartAssessment}
          disabled={isAssessmentStarted}
          className={`px-6 py-2 rounded-lg transition-colors ${
            isAssessmentStarted
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Start
        </button>
        <button
          onClick={() => setShowResults(true)}
          disabled={!isAssessmentStarted}
          className={`px-6 py-2 rounded-lg transition-colors ${
            !isAssessmentStarted
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          Results
        </button>
        <button
          onClick={handleSubmitAssessment}
          disabled={!isAssessmentStarted || !allQuestionsAnswered}
          className={`px-6 py-2 rounded-lg transition-colors ${
            !isAssessmentStarted || !allQuestionsAnswered
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          Submit
        </button>
      </div>

      {/* Basic Info Dialog */}
      <BasicInfoDialog
        isOpen={showBasicInfo}
        onClose={() => setShowBasicInfo(false)}
        onSubmit={handleBasicInfoSubmit}
      />

      {/* Category Dialog */}
      {selectedCategoryIndex !== null && (
        <CategoryDialog
          isOpen={selectedCategoryIndex !== null}
          onClose={handleCloseDialog}
          category={categories[selectedCategoryIndex].name}
          questions={categories[selectedCategoryIndex].questions}
          answers={answers.reduce((acc, answer) => ({ ...acc, [answer.questionId]: answer.value || 0 }), {} as Record<number, number>)}
          onAnswerChange={handleAnswerChange}
          onNavigateCategory={handleNavigateCategory}
          onCloseAndShowResults={() => {
            setShowResults(true);
            handleCloseDialog();
          }}
        />
      )}

      {/* Results Modal */}
      {showResults && assessmentResult && (
        <ResultsModal
          result={assessmentResult}
          onClose={() => setShowResults(false)}
        />
      )}

      {/* Success Message Dialog */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Thank you for taking the assessment</h3>
              <p className="text-gray-600 mb-6">
                Your responses are successfully recorded into the database.
              </p>
              <button
                onClick={() => {
                  setShowSuccessMessage(false);
                  setIsAssessmentStarted(false);
                  setBasicInfo(null);
                  setAnswers([]);
                  setSelectedCategoryIndex(null);
                  setShowResults(false);
                  onComplete();
                }}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIReadinessAssessment; 