import React, { useState, useMemo } from 'react';
import { FileText, Award } from 'lucide-react';
import { categories } from './data/questions';
import { Answer, CategoryProgress } from './types/assessment';
import { calculateScore } from './utils/scoring';
import { CategoryCard } from './components/CategoryCard';
import { CategoryDialog } from './components/CategoryDialog';
import { OverallProgress } from './components/OverallProgress';
import { ResultsModal } from './components/ResultsModal';
import { ApplicationDetailsDialog } from './components/ApplicationDetailsDialog';
import { SubmissionConfirmationDialog } from './components/SubmissionConfirmationDialog';

interface ApplicationDetails {
  name: string;
  mnemonic: string;
  description: string;
  techStack: string;
  remarks: string;
}

function App() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const [showSubmissionConfirmation, setShowSubmissionConfirmation] = useState(false);
  const [applicationDetails, setApplicationDetails] = useState<ApplicationDetails | null>(null);
  
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <div className="container mx-auto px-3 py-4 max-w-7xl h-screen flex flex-col">
        {/* Compact Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-2">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Application Modernization Assessment
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Evaluate your application's modernization level across key domains
          </p>
        </div>

        {/* Application Details Summary */}
        {applicationDetails && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{applicationDetails.name}</h2>
                <p className="text-sm text-gray-600">Code: {applicationDetails.mnemonic}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Tech Stack: {applicationDetails.techStack}</p>
              </div>
            </div>
          </div>
        )}

        {/* Categories Grid - Fixed Height */}
        <div className="flex-1 min-h-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 h-[75%]">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.name}
                category={category}
                completed={getCompletedCount(category.name)}
                onClick={() => handleCategoryClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Compact Overall Progress */}
        <div className="mt-1 mb-2">
          <OverallProgress
            categoryProgress={categoryProgress}
            totalQuestions={totalQuestions}
            answeredQuestions={answeredQuestions}
          />
        </div>

        {/* Compact Submit Button */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
          <div className="flex flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowApplicationDetails(true)}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:scale-105"
            >
              Start
            </button>

            <button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered}
              className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg ${
                allQuestionsAnswered
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Award className="w-4 h-4" />
              Get Assessment Results
            </button>

            <button
              onClick={handleSubmission}
              disabled={!allQuestionsAnswered}
              className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg ${
                allQuestionsAnswered
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
          </div>
        </div>

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
    </div>
  );
}

export default App;