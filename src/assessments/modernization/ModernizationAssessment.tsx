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
import { supabase } from '../../supabaseClient';

interface ApplicationDetails {
  name: string;
  mnemonic: string;
  description: string;
  techStack: string;
  remarks: string;
  ownerName: string;
  companyName: string;
  designation: string;
  email: string;
  phone: string;
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
    setSelectedCategoryIndex(categoryIndex);
  };

  const handleCloseDialog = () => {
    setSelectedCategoryIndex(null);
  };

  const handleCloseAndShowResults = () => {
    setSelectedCategoryIndex(null);
    setShowResults(true);
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

  const handleSubmission = async () => {
    if (allQuestionsAnswered && applicationDetails) {
      // Clear state before insert
      setAnswers([]);
      setApplicationDetails(null);
      setSelectedCategoryIndex(null);

      // Construct responses string: '1-1,2-0,...,34-1'
      const responses = answers
        .sort((a, b) => a.questionId - b.questionId)
        .map(a => `${a.questionId}-${a.value === 'yes' ? 1 : 0}`)
        .join(',');

      // Insert into Supabase
      await supabase.from('app_response').insert([
        {
          name: applicationDetails.name,
          mnemonic: applicationDetails.mnemonic,
          description: applicationDetails.description,
          techstack: applicationDetails.techStack,
          remarks: applicationDetails.remarks,
          ownername: applicationDetails.ownerName,
          companyname: applicationDetails.companyName,
          designation: applicationDetails.designation,
          email: applicationDetails.email,
          phone: applicationDetails.phone,
          responses,
        }
      ]);

      setShowSubmissionConfirmation(true);
      setTimeout(() => {
        setShowSubmissionConfirmation(false);
        setCurrentView('home');
      }, 3000);
    }
  };

  const handleStartAssessment = (details: ApplicationDetails) => {
    setApplicationDetails(details);
    setShowApplicationDetails(false);
  };

  const getCompletedCount = (categoryName: string): number => {
    const category = categories.find(c => c.name === categoryName);
    if (!category) return 0;
    
    return category.questions.filter(question => {
      const answer = answers.find(a => a.questionId === question.id);
      return answer && answer.value !== null;
    }).length;
  };

  const renderHeader = () => (
    <header className="flex-none p-3 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <a href="." className="hover:opacity-80 transition-opacity">
          <img
            src={ffisLogo}
            alt="FFIS Logo"
            className="h-16 w-auto"
          />
        </a>
        <div>
          <h1 className="text-lg font-bold text-gray-800">Future Focus IT Solutions and Strategic Consulting</h1>
          <p className="text-gray-600 text-xs mt-1">Comprehensive tools to evaluate your organization's AI readiness and application modernization status</p>
        </div>
      </div>
    </header>
  );

  // Horizontal navigation bar for assessments
  const renderAssessmentNav = () => (
    <nav className="w-full border-b border-gray-100 bg-white">
      <div className="grid grid-cols-3 items-center text-center py-1">
        <div>
          <button
            className={`px-3 py-0.5 rounded-md text-xs font-medium transition-colors ${currentView === 'ai-readiness' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`}
            onClick={() => setCurrentView('ai-readiness')}
          >
            AI Readiness Assessment
          </button>
        </div>
        <div>
          <button
            className={`px-3 py-0.5 rounded-md text-xs font-medium transition-colors ${currentView === 'modernization' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-purple-50'}`}
            onClick={() => setCurrentView('modernization')}
          >
            Application Modernization Assessment
          </button>
        </div>
        <div className="text-[10px] text-gray-400 text-right pr-2">
          © {new Date().getFullYear()} Future Focus IT Solutions. All rights reserved.
        </div>
      </div>
    </nav>
  );

  const renderFooter = () => null;

  const renderHomePage = () => (
    <div className="h-[90vh] w-[90vw] mx-auto flex flex-col">
      {renderHeader()}
      {renderAssessmentNav()}
      <main className="flex-1 p-4">
        <div className="space-y-4">
          {/* Assessment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* AI Readiness Assessment Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">AI Readiness Assessment</h2>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Evaluate your organization's preparedness for AI adoption across key domains including:
              </p>
              <ul className="space-y-1 mb-4">
                <li className="flex items-center gap-2 text-gray-700 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Business Strategy and Objectives
                </li>
                <li className="flex items-center gap-2 text-gray-700 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Technological Infrastructure
                </li>
                <li className="flex items-center gap-2 text-gray-700 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Data Infrastructure and Quality
                </li>
                <li className="flex items-center gap-2 text-gray-700 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Talent and Skills
                </li>
              </ul>
              <button
                onClick={() => setCurrentView('ai-readiness')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Start AI Readiness Assessment
              </button>
            </div>

            {/* Application Modernization Assessment Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Application Modernization Assessment</h2>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Assess your application's modernization level across critical areas including:
              </p>
              <ul className="space-y-1 mb-4">
                <li className="flex items-center gap-2 text-gray-700 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Architecture and Design
                </li>
                <li className="flex items-center gap-2 text-gray-700 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Technology Stack
                </li>
                <li className="flex items-center gap-2 text-gray-700 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Development Practices
                </li>
                <li className="flex items-center gap-2 text-gray-700 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Operational Excellence
                </li>
              </ul>
              <button
                onClick={() => setCurrentView('modernization')}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Start Modernization Assessment
              </button>
            </div>
          </div>

          {/* Why Assess Section */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Why Assess Your Organization?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-800 mb-1 text-sm">Strategic Planning</h4>
                <p className="text-gray-600 text-xs">Identify gaps and opportunities in your AI readiness and application modernization journey</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-800 mb-1 text-sm">Resource Optimization</h4>
                <p className="text-gray-600 text-xs">Make informed decisions about technology investments and resource allocation</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-800 mb-1 text-sm">Competitive Advantage</h4>
                <p className="text-gray-600 text-xs">Stay ahead of the curve with data-driven insights and actionable recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {renderFooter()}
    </div>
  );

  const renderAIReadinessAssessment = () => (
    <div className="h-[90vh] w-[90vw] mx-auto flex flex-col">
      {renderHeader()}
      {renderAssessmentNav()}
      <main className="flex-1 p-4">
        <AIReadinessAssessment onComplete={() => setCurrentView('home')} />
      </main>
      {renderFooter()}
    </div>
  );

  const renderModernizationAssessment = () => (
    <div className="w-[90vw] mx-auto flex flex-col min-h-screen pb-24">
      {renderHeader()}
      {renderAssessmentNav()}
      <main className="flex-1 p-4">
        <div className="mb-2 text-center">
          <h1 className="text-xl font-bold text-gray-800">How Modern is the Application?</h1>
          <p className="text-gray-600 mt-1 text-sm">Evaluate your application's modernization level across key domains</p>
        </div>

        {/* Application Details Summary */}
        {applicationDetails && (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-2 mb-2">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.name}
              category={category}
              completed={getCompletedCount(category.name)}
              onClick={() => handleCategoryClick(index)}
              isLastCategory={index === categories.length - 1}
              onClose={handleCloseAndShowResults}
            />
          ))}
        </div>

        {/* Overall Progress */}
        <div>
          <OverallProgress
            categoryProgress={categoryProgress}
            totalQuestions={totalQuestions}
            answeredQuestions={answeredQuestions}
          />
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 w-full z-40 bg-white border-t border-gray-200 py-3 flex justify-center gap-4 shadow-lg">
          {!applicationDetails ? (
            <button
              onClick={() => setShowApplicationDetails(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Start
            </button>
          ) : (
            <button
              onClick={() => setSelectedCategoryIndex(0)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Begin Assessment
            </button>
          )}
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
      </main>
      {renderFooter()}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'home' && renderHomePage()}
      {currentView === 'ai-readiness' && renderAIReadinessAssessment()}
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
          onCloseAndShowResults={handleCloseAndShowResults}
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