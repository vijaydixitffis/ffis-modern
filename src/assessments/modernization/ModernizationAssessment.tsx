import React, { useState, useMemo, useEffect } from 'react';
import { FileText, Brain, CheckCircle } from 'lucide-react';
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

const modernityCategories = [
  {
    name: "Architecture",
    questions: [
      { id: 1, text: "Uses microservices or modular architecture?", category: "Architecture" },
      { id: 2, text: "Provides API-first or event-driven design (RESTful/GraphQL APIs, WebSockets, event streaming)?", category: "Architecture" },
      { id: 3, text: "Uses containerization & orchestration (Docker, Kubernetes)?", category: "Architecture" },
      { id: 4, text: "Is serverless or cloud-native (auto-scaling, managed services, cloud-agnostic)?", category: "Architecture" },
      { id: 5, text: "Supports edge computing?", category: "Architecture" },
    ]
  },
  {
    name: "Development & Deployment",
    questions: [
      { id: 6, text: "Implements CI/CD automation?", category: "Development & Deployment" },
      { id: 7, text: "Uses Infrastructure as Code (IaC)?", category: "Development & Deployment" },
      { id: 8, text: "Integrates DevSecOps into the lifecycle?", category: "Development & Deployment" },
    ]
  },
  {
    name: "Scalability & Performance",
    questions: [
      { id: 9, text: "Supports elastic scalability?", category: "Scalability & Performance" },
      { id: 10, text: "Uses high availability & fault tolerance strategies?", category: "Scalability & Performance" },
      { id: 11, text: "Uses async processing or event-driven architecture for scalability?", category: "Scalability & Performance" },
    ]
  },
  {
    name: "Data & Storage",
    questions: [
      { id: 12, text: "Supports polyglot persistence (multiple database types)?", category: "Data & Storage" },
      { id: 13, text: "Uses streaming or real-time data processing technologies?", category: "Data & Storage" },
      { id: 14, text: "Ensures data governance & compliance (encryption, privacy, regulations)?", category: "Data & Storage" },
    ]
  },
  {
    name: "Security & Compliance",
    questions: [
      { id: 15, text: "Implements zero trust architecture (strong authentication, least privilege)?", category: "Security & Compliance" },
      { id: 16, text: "Encrypts data end-to-end (at rest and in transit)?", category: "Security & Compliance" },
      { id: 17, text: "Uses modern API security standards (OAuth2, OpenID Connect, JWT, API gateways)?", category: "Security & Compliance" },
      { id: 18, text: "Integrates automated security testing into CI/CD pipelines?", category: "Security & Compliance" },
    ]
  },
  {
    name: "User Experience",
    questions: [
      { id: 19, text: "Uses responsive & progressive UI (modern frameworks)?", category: "User Experience" },
      { id: 20, text: "Is mobile-first & cross-platform (PWA, responsive web, mobile apps)?", category: "User Experience" },
      { id: 21, text: "Optimized for low latency & high performance (CDN, caching, efficient rendering)?", category: "User Experience" },
    ]
  },
  {
    name: "Observability & Monitoring",
    questions: [
      { id: 22, text: "Uses centralized logging & monitoring (ELK, Prometheus, Grafana, OpenTelemetry)?", category: "Observability & Monitoring" },
      { id: 23, text: "Has automated incident response (AIOps, alerting, self-healing)?", category: "Observability & Monitoring" },
      { id: 24, text: "Tracks business & technical metrics (performance, SLAs, user behavior)?", category: "Observability & Monitoring" },
    ]
  },
  {
    name: "Technical Debt Management",
    questions: [
      { id: 25, text: "Minimizes reliance on legacy code and outdated technologies?", category: "Technical Debt Management" },
      { id: 26, text: "Codebase is maintainable and clean (SOLID, DDD, separation of concerns)?", category: "Technical Debt Management" },
      { id: 27, text: "Performs automated refactoring & code quality checks regularly?", category: "Technical Debt Management" },
    ]
  },
  {
    name: "Backward Compatibility & Lifecycle",
    questions: [
      { id: 28, text: "New updates are backward compatible and do not break integrations?", category: "Backward Compatibility & Lifecycle" },
      { id: 29, text: "Tech stack lifecycle is managed (dependencies/frameworks upgraded regularly)?", category: "Backward Compatibility & Lifecycle" },
    ]
  },
  {
    name: "Business Agility",
    questions: [
      { id: 30, text: "Fast time-to-market (DevOps, CI/CD, modular architecture)?", category: "Business Agility" },
      { id: 31, text: "Low change failure rate (frequent, stable releases, DORA metrics)?", category: "Business Agility" },
      { id: 32, text: "Uses data-driven decision-making (real-time analytics, A/B testing, AI insights)?", category: "Business Agility" },
      { id: 33, text: "Application is API and ecosystem ready (easy integration with third-party services)?", category: "Business Agility" },
      { id: 34, text: "Business capabilities are composable & reusable (APIs, microservices)?", category: "Business Agility" }
    ]
  }
];

const aiCategories = [
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
  const [currentView, setCurrentView] = useState<'home' | 'ai-readiness' | 'modernization' | 'manage'>('home');

  // Add login state and data state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [aiResponses, setAiResponses] = useState<any[]>([]);
  const [appResponses, setAppResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  // Move login form state to top level
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        <div>
          <button
            className={`px-3 py-0.5 rounded-md text-xs font-medium transition-colors ${currentView === 'manage' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-green-50'}`}
            onClick={() => setCurrentView('manage')}
          >
            Manage
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

  // Update renderLoginPage to use top-level state
  const renderLoginPage = () => {
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const login = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setLoginError(error.message);
        } else {
          setIsLoggedIn(true);
          setLoginError('');
        }
        setLoading(false);
      };
      login();
    };
    if (isLoggedIn) return renderManagePage();
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-xs border border-gray-200">
          <h2 className="text-lg font-bold mb-4 text-center">Login</h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full px-2 py-1 border rounded text-sm" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input type="password" className="w-full px-2 py-1 border rounded text-sm" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {loginError && <div className="text-xs text-red-500">{loginError}</div>}
                      <button type="submit" className="w-full bg-blue-600 text-white py-1.5 rounded text-sm font-semibold hover:bg-blue-700 disabled:bg-blue-400" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="w-full mt-2 bg-gray-200 text-gray-800 py-1.5 rounded text-sm font-semibold hover:bg-gray-300"
          >
            Home
          </button>
          </form>
        </div>
      </div>
    );
  };

  // Modal to display response details
  const ResponseDetailsModal = ({ response, onClose }: { response: any, onClose: () => void }) => {
    if (!response) return null;

    const isAIResponse = 'company_name' in response;

    const parseAIResponses = (responsesStr: string): Map<number, number> => {
      const responses = new Map<number, number>();
      if (!responsesStr) return responses;
      responsesStr.split(',').forEach(item => {
        const parts = item.split('-');
        if (parts.length === 2) {
          const questionId = parseInt(parts[0], 10);
          const value = parseInt(parts[1], 10);
          if (!isNaN(questionId) && !isNaN(value)) {
            responses.set(questionId, value);
          }
        }
      });
      return responses;
    };

    const calculateAIResult = (responses: Map<number, number>) => {
      const totalQuestions = 50;
      let totalScore = 0;
      responses.forEach(value => { totalScore += value; });

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
        ];
      } else if (percentage >= 60) {
        level = 'Mature';
        message = 'Your organization shows strong readiness for AI implementation';
        recommendations = [
          'Address remaining gaps in AI infrastructure',
          'Expand AI use cases to more business units',
          'Strengthen AI governance and compliance',
        ];
      } else if (percentage >= 40) {
        level = 'Developing';
        message = 'Your organization has moderate readiness for AI adoption';
        recommendations = [
          'Develop a comprehensive AI strategy and roadmap',
          'Invest in core AI infrastructure and capabilities',
          'Build essential AI skills and expertise',
        ];
      } else if (percentage >= 20) {
        level = 'Early Stage';
        message = 'Your organization is in the initial stages of AI readiness';
        recommendations = [
          'Create awareness and education about AI benefits',
          'Assess current technology infrastructure gaps',
          'Develop basic data management capabilities',
        ];
      } else {
        level = 'Not Ready';
        message = 'Your organization needs significant preparation for AI adoption';
        recommendations = [
          'Develop a clear vision for AI adoption',
          'Address fundamental technology infrastructure needs',
          'Establish basic data management practices',
        ];
      }

      return {
        score: percentage,
        level,
        message,
        recommendations,
        responses
      };
    };

    const renderAIResponseDetails = () => {
      const parsedResponses = parseAIResponses(response.responses);
      const result = calculateAIResult(parsedResponses);

      return (
        <div>
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-3xl font-bold text-blue-600 mb-2">{result.score.toFixed(1)}%</p>
            <p className="text-xl font-semibold text-gray-800 mb-1">{result.level}</p>
            <p className="text-gray-600 mb-4">{result.message}</p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Recommendations</h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <span className="text-blue-500">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {aiCategories.map(category => (
            <div key={category.name} className="mb-4">
              <h4 className="font-medium mb-2 text-gray-700">{category.name}</h4>
              <ul className="space-y-2">
                {category.questions.map(question => (
                  <li key={question.id} className="text-sm text-gray-600">
                    <strong>Q{question.id}:</strong> {question.text} - <strong>Answer:</strong> {result.responses.get(question.id) || 'N/A'}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    };

    const calculateModernityResult = (responses: Map<number, number>) => {
      const totalQuestions = modernityCategories.reduce((acc, cat) => acc + cat.questions.length, 0);
      let totalScore = 0;
      responses.forEach(value => { totalScore += value; });

      const percentage = (totalScore / totalQuestions) * 100;

      let level = '';
      let message = '';

      if (percentage >= 80) {
        level = 'Highly Modern';
        message = 'This application is highly modernized and follows best practices.';
      } else if (percentage >= 60) {
        level = 'Modern';
        message = 'This application is well-modernized but has some areas for improvement.';
      } else if (percentage >= 40) {
        level = 'Partially Modernized';
        message = 'This application has some modern features but requires significant modernization efforts.';
      } else {
        level = 'Legacy';
        message = 'This application is a legacy system and needs a comprehensive modernization strategy.';
      }

      return {
        score: percentage,
        level,
        message,
        responses
      };
    };

    const parseModernityResponses = (responsesStr: string): Map<number, number> => {
      const responses = new Map<number, number>();
      if (!responsesStr) return responses;
      responsesStr.split(',').forEach(item => {
        const parts = item.split('-');
        if (parts.length === 2) {
          const questionId = parseInt(parts[0], 10);
          const value = parseInt(parts[1], 10);
          if (!isNaN(questionId) && !isNaN(value)) {
            responses.set(questionId, value);
          }
        }
      });
      return responses;
    };

    const renderModernityResponseDetails = () => {
      const parsedResponses = parseModernityResponses(response.responses);
      const result = calculateModernityResult(parsedResponses);

      return (
        <div>
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <p className="text-3xl font-bold text-green-600 mb-2">{result.score.toFixed(1)}%</p>
            <p className="text-xl font-semibold text-gray-800 mb-1">{result.level}</p>
            <p className="text-gray-600">{result.message}</p>
          </div>

          {modernityCategories.map(category => (
            <div key={category.name} className="mb-4">
              <h4 className="font-medium mb-2 text-gray-700">{category.name}</h4>
              <ul className="space-y-2">
                {category.questions.map(question => (
                  <li key={question.id} className="text-sm text-gray-600">
                    <strong>Q{question.id}:</strong> {question.text} - <strong>Answer:</strong> {result.responses.get(question.id) === 1 ? 'Yes' : 'No'}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    };



    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Response Details - {response.name || response.company_name}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="p-4 overflow-y-auto">
            <div className="mb-4">
              <h4 className="font-medium mb-2">{isAIResponse ? 'Company' : 'Application'} Information:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {isAIResponse ? (
                  <>
                    <div>Company: {response.company_name || '-'}</div>
                    <div>Contact: {response.contact_name || '-'}</div>
                    <div>Designation: {response.designation || '-'}</div>
                    <div>Email: {response.email || '-'}</div>
                    <div>Phone: {response.phone || '-'}</div>
                  </>
                ) : (
                  <>
                    <div>Name: {response.name || '-'}</div>
                    <div>Mnemonic: {response.mnemonic || '-'}</div>
                    <div>Tech Stack: {response.techstack || '-'}</div>
                    <div>Owner: {response.ownername || '-'}</div>
                    <div>Company: {response.companyname || '-'}</div>
                    <div>Email: {response.email || '-'}</div>
                  </>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Responses:</h4>
              {isAIResponse ? renderAIResponseDetails() : renderModernityResponseDetails()}
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Close</button>
          </div>
        </div>
      </div>
    );
  };

  // Render manage page with two tables
  const renderManagePage = () => {
    // Sort responses by created_at ascending
    const aiSorted = [...aiResponses].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    const appSorted = [...appResponses].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2">
        <div className="w-full max-w-4xl">
          {/* Breadcrumb and user info bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
            <nav className="text-xs text-gray-500 flex items-center gap-2">
              <button
                className="hover:underline text-blue-600 font-medium"
                onClick={() => { setCurrentView('home'); setIsLoggedIn(false); setEmail(''); setPassword(''); }}
              >
                Home
              </button>
              <span className="mx-1">/</span>
              <span className="text-gray-700">Dashboard</span>
            </nav>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-700 font-medium">{email}</span>
              <button
                className="text-xs text-red-500 hover:underline font-medium"
                onClick={() => { setIsLoggedIn(false); setEmail(''); setPassword(''); }}
              >
                Logout
              </button>
            </div>
          </div>
          {/* Card with description */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
            <h1 className="text-xl font-bold mb-2 text-gray-800">Assessment Dashboard</h1>
            <p className="text-sm text-gray-600 mb-0.5">Report of assessment responses received</p>
          </div>
          {/* AI Responses Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-8">
            <h2 className="text-lg font-bold mb-4">AI Responses</h2>
            {loading ? <div>Loading...</div> : (
              <div className="overflow-x-auto">
                <table className="min-w-full border text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1">Company Name</th>
                      <th className="border px-2 py-1">Contact Name</th>
                      <th className="border px-2 py-1">Designation</th>
                      <th className="border px-2 py-1">Email</th>
                      <th className="border px-2 py-1">Phone</th>
                      <th className="border px-2 py-1">Created At</th>
                      <th className="border px-2 py-1">Results</th>
                    </tr>
                  </thead>
                  <tbody>
                  {aiSorted.map((row, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      <td className="border px-2 py-1">{row.company_name}</td>
                      <td className="border px-2 py-1">{row.contact_name}</td>
                      <td className="border px-2 py-1">{row.designation}</td>
                      <td className="border px-2 py-1">{row.email}</td>
                      <td className="border px-2 py-1">{row.phone}</td>
                      <td className="border px-2 py-1">{formatDateTime(row.created_at)}</td>
                      <td className="border px-2 py-1 text-center">
                        <button
                          onClick={() => setSelectedResponse(row)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Report
                        </button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* Modernity Responses Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h2 className="text-lg font-bold mb-4">Modernity Responses</h2>
            {loading ? <div>Loading...</div> : (
              <div className="overflow-x-auto">
                <table className="min-w-full border text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1">App Name</th>
                      <th className="border px-2 py-1">Mnemonic</th>
                      <th className="border px-2 py-1">Owner Name</th>
                      <th className="border px-2 py-1">Company Name</th>
                      <th className="border px-2 py-1">Designation</th>
                      <th className="border px-2 py-1">Email</th>
                      <th className="border px-2 py-1">Phone</th>
                      <th className="border px-2 py-1">Created At</th>
                      <th className="border px-2 py-1">Results</th>
                    </tr>
                  </thead>
                  <tbody>
                  {appSorted.map((row, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      <td className="border px-2 py-1">{row.name}</td>
                      <td className="border px-2 py-1">{row.mnemonic}</td>
                      <td className="border px-2 py-1">{row.ownername}</td>
                      <td className="border px-2 py-1">{row.companyname}</td>
                      <td className="border px-2 py-1">{row.designation}</td>
                      <td className="border px-2 py-1">{row.email}</td>
                      <td className="border px-2 py-1">{row.phone}</td>
                      <td className="border px-2 py-1">{formatDateTime(row.created_at)}</td>
                      <td className="border px-2 py-1 text-center">
                        <button
                          onClick={() => setSelectedResponse(row)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Report
                        </button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Add date formatting helper
  function formatDateTime(dt: string) {
    if (!dt) return '';
    const date = new Date(dt);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  // Fetch data after login
  useEffect(() => {
    if (isLoggedIn && currentView === 'manage') {
      setLoading(true);
      Promise.all([
        supabase.from('ai_response').select('company_name, contact_name, designation, email, phone, created_at, responses').order('created_at', { ascending: false }),
        supabase.from('app_response').select('name, mnemonic, ownername, companyname, designation, email, phone, created_at, responses, techstack, description, remarks').order('created_at', { ascending: false })
      ]).then(([aiRes, appRes]) => {
        setAiResponses(aiRes.data || []);
        setAppResponses(appRes.data || []);
        setLoading(false);
      });
    }
  }, [isLoggedIn, currentView]);

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'home' && renderHomePage()}
      {currentView === 'ai-readiness' && renderAIReadinessAssessment()}
      {currentView === 'modernization' && renderModernizationAssessment()}
      {currentView === 'manage' && renderLoginPage()}
      
      {/* Response Details Modal */}
      {selectedResponse && (
        <ResponseDetailsModal 
          response={selectedResponse} 
          onClose={() => setSelectedResponse(null)} 
        />
      )}

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