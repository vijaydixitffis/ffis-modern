import React, { useState, useMemo } from 'react';
import { Award, FileText, Home, Settings, HelpCircle, Brain } from 'lucide-react';
import { categories } from './data/questions';
import { Answer, CategoryProgress } from './types/assessment';
import { calculateScore } from './utils/scoring';
import { CategoryCard } from './components/CategoryCard';
import { CategoryDialog } from './components/CategoryDialog';
import { OverallProgress } from './components/OverallProgress';
import { ResultsModal } from './components/ResultsModal';
import { ApplicationDetailsDialog } from './components/ApplicationDetailsDialog';
import { SubmissionConfirmationDialog } from './components/SubmissionConfirmationDialog';
import Layout from '../../shared/components/Layout';
import AIReadinessAssessment from '../AIReadinessAssessment';

interface ApplicationDetails {
  name: string;
  mnemonic: string;
  description: string;
  techStack: string;
  remarks: string;
}

function ModernizationAssessment() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const [showSubmissionConfirmation, setShowSubmissionConfirmation] = useState(false);
  const [applicationDetails, setApplicationDetails] = useState<ApplicationDetails | null>(null);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  
  const totalQuestions = 34;
  const answeredQuestions = answers.filter(answer => answer.value !== null).length;
  const allQuestionsAnswered = answeredQuestions === totalQuestions;
  
  const categoryProgress: CategoryProgress[] = useMemo(() => {
    return categories.map(category => {
      const completed = category.questions.filter(question => {
        const answer = answers.find(a => a.questionId === question.id);
        return answer && answer.value !== null;
      }).length;
      
      return {
        categoryName: category.name,
        completed,
        total: category.questions.length
      };
    });
  }, [answers]);

  const assessmentResult = useMemo(() => {
    if (allQuestionsAnswered) {
      return calculateScore(answers);
    }
    return null;
  }, [answers, allQuestionsAnswered]);

  const handleAnswerChange = (questionId: number, value: 'yes' | 'no') => {
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
    if (!applicationDetails) {
      alert('Please click the Start button and fill in the application details before proceeding with the assessment.');
      setShowApplicationDetails(true);
      return;
    }
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

  const handleSubmit = () => {
    if (allQuestionsAnswered && assessmentResult) {
      setShowResults(true);
    }
  };

  const handleSubmission = () => {
    if (allQuestionsAnswered) {
      setShowSubmissionConfirmation(true);
      setAnswers([]);
      setApplicationDetails(null);
      setSelectedCategoryIndex(null);
    }
  };

  const handleStartAssessment = (details: ApplicationDetails) => {
    setApplicationDetails(details);
    setShowApplicationDetails(false);
    setSelectedCategoryIndex(0);
  };

  const getCompletedCount = (categoryName: string): number => {
    const category = categories.find(c => c.name === categoryName);
    if (!category) return 0;
    
    return category.questions.filter(question => {
      const answer = answers.find(a => a.questionId === question.id);
      return answer && answer.value !== null;
    }).length;
  };

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
      isActive: activeNavItem === 'dashboard'
    },
    {
      id: 'ai-readiness',
      label: 'AI Readiness',
      icon: <Brain className="w-5 h-5" />,
      isActive: activeNavItem === 'ai-readiness'
    },
    {
      id: 'assessment',
      label: 'Assess the App',
      icon: <FileText className="w-5 h-5" />,
      isActive: activeNavItem === 'assessment'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      isActive: activeNavItem === 'settings'
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: <HelpCircle className="w-5 h-5" />,
      isActive: activeNavItem === 'help'
    }
  ];

  const renderContent = () => {
    switch (activeNavItem) {
      case 'dashboard':
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Welcome to Modernization Assessment</h1>
              <p className="text-gray-600 mt-1">Select "Assess the App" from the menu to start your assessment.</p>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-600">Get started by selecting "Assess the App" from the navigation menu.</p>
            </div>
          </div>
        );
      case 'ai-readiness':
        return <AIReadinessAssessment />;
      case 'assessment':
        return (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-800">How Modern is the Application?</h1>
              <p className="text-gray-600 mt-1">Evaluate your application's modernization level across key domains</p>
            </div>

            {/* Application Details Summary */}
            {applicationDetails && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{applicationDetails.name}</h2>
                    <p className="text-sm text-gray-600">Code: {applicationDetails.mnemonic}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Tech Stack: {applicationDetails.techStack}</p>
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
                />
              ))}
            </div>

            {/* Overall Progress */}
            <div className="mt-6">
              <OverallProgress
                categoryProgress={categoryProgress}
                totalQuestions={totalQuestions}
                answeredQuestions={answeredQuestions}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setShowApplicationDetails(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Start
              </button>
              <button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  allQuestionsAnswered
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Get Assessment Results
              </button>
              <button
                onClick={handleSubmission}
                disabled={!allQuestionsAnswered}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  allQuestionsAnswered
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          </>
        );
      case 'settings':
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="text-gray-600 mt-1">Configure your assessment preferences</p>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-600">Settings will be shown here.</p>
            </div>
          </div>
        );
      case 'help':
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
              <p className="text-gray-600 mt-1">Get assistance with your assessment</p>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-600">Help and support information will be shown here.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout
      title="Application Modernization Assessment"
      description="Evaluate your application's modernization level across key domains"
      navigationItems={navigationItems}
      onNavigationItemClick={setActiveNavItem}
    >
      {renderContent()}

      {/* Category Dialog */}
      {selectedCategoryIndex !== null && (
        <CategoryDialog
          category={categories[selectedCategoryIndex]}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onClose={handleCloseDialog}
          onPrevious={handlePreviousCategory}
          onNext={handleNextCategory}
          hasPrevious={selectedCategoryIndex > 0}
          hasNext={selectedCategoryIndex < categories.length - 1}
          categoryIndex={selectedCategoryIndex}
          totalCategories={categories.length}
        />
      )}

      {/* Results Modal */}
      {showResults && assessmentResult && (
        <ResultsModal
          result={assessmentResult}
          onClose={() => setShowResults(false)}
        />
      )}

      {/* Application Details Dialog */}
      {showApplicationDetails && (
        <ApplicationDetailsDialog
          onClose={() => setShowApplicationDetails(false)}
          onStart={handleStartAssessment}
          initialDetails={applicationDetails || undefined}
        />
      )}

      {/* Submission Confirmation Dialog */}
      {showSubmissionConfirmation && (
        <SubmissionConfirmationDialog
          onClose={() => setShowSubmissionConfirmation(false)}
        />
      )}
    </Layout>
  );
}

export default ModernizationAssessment; 