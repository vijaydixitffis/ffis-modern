import React, { useState, useMemo } from 'react';
import { Award, FileText, Brain, CheckCircle } from 'lucide-react';
import { categories } from './data/questions';
import { Answer, CategoryProgress } from './types/assessment';
import { calculateScore } from './utils/scoring';
import { CategoryCard } from './components/CategoryCard';
import { CategoryDialog } from './components/CategoryDialog';
import { OverallProgress } from './components/OverallProgress';
import { ResultsModal } from './components/ResultsModal';
import { ApplicationDetailsDialog } from './components/ApplicationDetailsDialog';
import { SubmissionConfirmationDialog } from './components/SubmissionConfirmationDialog';
import AIReadinessAssessment from '../AIReadinessAssessment';
import ffisLogo from '../../assets/FFIS-logo.png';

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
  const [currentView, setCurrentView] = useState<'home' | 'ai-readiness' | 'modernization'>('home');

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
      setTimeout(() => {
        setShowSubmissionConfirmation(false);
        setCurrentView('home');
      }, 3000);
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

  const renderHomePage = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <img
            src={ffisLogo}
            alt="FFIS Logo"
            className="h-20 w-auto"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Future Focus IT Solutions and Strategic Consulting</h1>
            <p className="text-gray-600 text-lg mt-2">Comprehensive tools to evaluate your organization's AI readiness and application modernization status</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Readiness Assessment Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">AI Readiness Assessment</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Evaluate your organization's preparedness for AI adoption across key domains including:
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Business Strategy and Objectives
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Technological Infrastructure
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Data Infrastructure and Quality
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Talent and Skills
            </li>
          </ul>
          <button
            onClick={() => setCurrentView('ai-readiness')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start AI Readiness Assessment
          </button>
        </div>

        {/* Application Modernization Assessment Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Application Modernization Assessment</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Assess your application's modernization level across critical areas including:
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Architecture and Design
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Technology Stack
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Development Practices
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Operational Excellence
            </li>
          </ul>
          <button
            onClick={() => setCurrentView('modernization')}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Modernization Assessment
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Why Assess Your Organization?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800 mb-2">Strategic Planning</h4>
            <p className="text-gray-600 text-sm">Identify gaps and opportunities in your AI readiness and application modernization journey</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800 mb-2">Resource Optimization</h4>
            <p className="text-gray-600 text-sm">Make informed decisions about technology investments and resource allocation</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800 mb-2">Competitive Advantage</h4>
            <p className="text-gray-600 text-sm">Stay ahead of the curve with data-driven insights and actionable recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModernizationAssessment = () => (
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {currentView === 'home' && renderHomePage()}
      {currentView === 'ai-readiness' && <AIReadinessAssessment onComplete={() => setCurrentView('home')} />}
      {currentView === 'modernization' && renderModernizationAssessment()}

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
    </div>
  );
}

export default ModernizationAssessment; 