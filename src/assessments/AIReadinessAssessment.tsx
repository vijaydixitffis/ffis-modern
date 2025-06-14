import React, { useState, useMemo } from 'react';
import { Brain, CheckCircle, ChevronRight, ChevronLeft, X, BarChart2, Database, Settings, Users, DollarSign, Shield, Building2 } from 'lucide-react';

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
  recommendations: string[];
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
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, completed, onClick, disabled }) => {
  const total = category.questions.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const isCompleted = completed === total;

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
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({ 
  isOpen, 
  onClose, 
  category, 
  questions, 
  answers, 
  onAnswerChange 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];

  const handleSliderChange = (value: number) => {
    onAnswerChange(currentQuestion.id, value);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
            {currentQuestionIndex === questions.length - 1 && (
              <CheckCircle className="w-6 h-6 text-green-500" />
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {currentQuestionIndex + 1}/{questions.length} completed
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div 
                key={question.id} 
                className={`bg-white rounded-lg shadow-sm p-4 ${
                  index === currentQuestionIndex ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <p className="text-gray-800 mb-3">{question.text}</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs text-gray-500">1</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={answers[question.id] || 3}
                      onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-gray-500">5</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 min-w-[2rem] text-center">
                    {answers[question.id] || '-'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentQuestionIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
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
            <p className="text-gray-600">{result.recommendations.join('\n')}</p>
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

const AIReadinessAssessment: React.FC = () => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);

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

      if (percentage >= 80) {
        level = 'Advanced';
        message = 'Fully ready for AI adoption and scaling';
      } else if (percentage >= 60) {
        level = 'Mature';
        message = 'Ready, with minor gaps to address';
      } else if (percentage >= 40) {
        level = 'Developing';
        message = 'Moderate readiness; significant gaps remain';
      } else if (percentage >= 20) {
        level = 'Early Stage';
        message = 'Low readiness; foundational work needed';
      } else {
        level = 'Not Ready';
        message = 'Not prepared for AI adoption';
      }

      return {
        score: percentage,
        level,
        recommendations: []
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

  const handleCloseDialog = () => {
    setSelectedCategoryIndex(null);
  };

  const handlePreviousCategory = () => {
    if (selectedCategoryIndex !== null && selectedCategoryIndex > 0) {
      setSelectedCategoryIndex(selectedCategoryIndex - 1);
    }
  };

  const handleNextCategory = () => {
    if (selectedCategoryIndex !== null && selectedCategoryIndex < categories.length - 1) {
      setSelectedCategoryIndex(selectedCategoryIndex + 1);
    }
  };

  const handleStartAssessment = () => {
    setIsAssessmentStarted(true);
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

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.name}
            category={category}
            completed={getCompletedCount(category.name)}
            onClick={() => handleCategoryClick(index)}
            disabled={!isAssessmentStarted}
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
      <div className="flex justify-center space-x-4">
        {!isAssessmentStarted ? (
          <button
            onClick={handleStartAssessment}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Assessment
          </button>
        ) : (
          <>
            <button
              onClick={() => setShowResults(true)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Assessment Results
            </button>
            <button
              onClick={handleResetAssessment}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reset Assessment
            </button>
          </>
        )}
      </div>

      {/* Category Dialog */}
      {selectedCategoryIndex !== null && (
        <CategoryDialog
          isOpen={selectedCategoryIndex !== null}
          onClose={handleCloseDialog}
          category={categories[selectedCategoryIndex].name}
          questions={categories[selectedCategoryIndex].questions}
          answers={answers.reduce((acc, answer) => ({ ...acc, [answer.questionId]: answer.value || 0 }), {} as Record<number, number>)}
          onAnswerChange={handleAnswerChange}
        />
      )}

      {/* Results Modal */}
      {showResults && assessmentResult && (
        <ResultsModal
          result={assessmentResult}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default AIReadinessAssessment; 