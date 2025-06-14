import { Question, Category } from '../types/assessment';

export const questions: Question[] = [
  // Architecture
  { id: 1, text: "Uses microservices or modular architecture?", category: "Architecture" },
  { id: 2, text: "Provides API-first or event-driven design (RESTful/GraphQL APIs, WebSockets, event streaming)?", category: "Architecture" },
  { id: 3, text: "Uses containerization & orchestration (Docker, Kubernetes)?", category: "Architecture" },
  { id: 4, text: "Is serverless or cloud-native (auto-scaling, managed services, cloud-agnostic)?", category: "Architecture" },
  { id: 5, text: "Supports edge computing?", category: "Architecture" },

  // Development & Deployment
  { id: 6, text: "Implements CI/CD automation?", category: "Development & Deployment" },
  { id: 7, text: "Uses Infrastructure as Code (IaC)?", category: "Development & Deployment" },
  { id: 8, text: "Integrates DevSecOps into the lifecycle?", category: "Development & Deployment" },

  // Scalability & Performance
  { id: 9, text: "Supports elastic scalability?", category: "Scalability & Performance" },
  { id: 10, text: "Uses high availability & fault tolerance strategies?", category: "Scalability & Performance" },
  { id: 11, text: "Uses async processing or event-driven architecture for scalability?", category: "Scalability & Performance" },

  // Data & Storage
  { id: 12, text: "Supports polyglot persistence (multiple database types)?", category: "Data & Storage" },
  { id: 13, text: "Uses streaming or real-time data processing technologies?", category: "Data & Storage" },
  { id: 14, text: "Ensures data governance & compliance (encryption, privacy, regulations)?", category: "Data & Storage" },

  // Security & Compliance
  { id: 15, text: "Implements zero trust architecture (strong authentication, least privilege)?", category: "Security & Compliance" },
  { id: 16, text: "Encrypts data end-to-end (at rest and in transit)?", category: "Security & Compliance" },
  { id: 17, text: "Uses modern API security standards (OAuth2, OpenID Connect, JWT, API gateways)?", category: "Security & Compliance" },
  { id: 18, text: "Integrates automated security testing into CI/CD pipelines?", category: "Security & Compliance" },

  // User Experience (UX)
  { id: 19, text: "Uses responsive & progressive UI (modern frameworks)?", category: "User Experience" },
  { id: 20, text: "Is mobile-first & cross-platform (PWA, responsive web, mobile apps)?", category: "User Experience" },
  { id: 21, text: "Optimized for low latency & high performance (CDN, caching, efficient rendering)?", category: "User Experience" },

  // Observability & Monitoring
  { id: 22, text: "Uses centralized logging & monitoring (ELK, Prometheus, Grafana, OpenTelemetry)?", category: "Observability & Monitoring" },
  { id: 23, text: "Has automated incident response (AIOps, alerting, self-healing)?", category: "Observability & Monitoring" },
  { id: 24, text: "Tracks business & technical metrics (performance, SLAs, user behavior)?", category: "Observability & Monitoring" },

  // Technical Debt Management
  { id: 25, text: "Minimizes reliance on legacy code and outdated technologies?", category: "Technical Debt Management" },
  { id: 26, text: "Codebase is maintainable and clean (SOLID, DDD, separation of concerns)?", category: "Technical Debt Management" },
  { id: 27, text: "Performs automated refactoring & code quality checks regularly?", category: "Technical Debt Management" },

  // Backward Compatibility & Lifecycle
  { id: 28, text: "New updates are backward compatible and do not break integrations?", category: "Backward Compatibility & Lifecycle" },
  { id: 29, text: "Tech stack lifecycle is managed (dependencies/frameworks upgraded regularly)?", category: "Backward Compatibility & Lifecycle" },

  // Business Agility
  { id: 30, text: "Fast time-to-market (DevOps, CI/CD, modular architecture)?", category: "Business Agility" },
  { id: 31, text: "Low change failure rate (frequent, stable releases, DORA metrics)?", category: "Business Agility" },
  { id: 32, text: "Uses data-driven decision-making (real-time analytics, A/B testing, AI insights)?", category: "Business Agility" },
  { id: 33, text: "Application is API and ecosystem ready (easy integration with third-party services)?", category: "Business Agility" },
  { id: 34, text: "Business capabilities are composable & reusable (APIs, microservices)?", category: "Business Agility" }
];

export const categories: Category[] = [
  {
    name: "Architecture",
    questions: questions.filter(q => q.category === "Architecture")
  },
  {
    name: "Development & Deployment",
    questions: questions.filter(q => q.category === "Development & Deployment")
  },
  {
    name: "Scalability & Performance",
    questions: questions.filter(q => q.category === "Scalability & Performance")
  },
  {
    name: "Data & Storage",
    questions: questions.filter(q => q.category === "Data & Storage")
  },
  {
    name: "Security & Compliance",
    questions: questions.filter(q => q.category === "Security & Compliance")
  },
  {
    name: "User Experience",
    questions: questions.filter(q => q.category === "User Experience")
  },
  {
    name: "Observability & Monitoring",
    questions: questions.filter(q => q.category === "Observability & Monitoring")
  },
  {
    name: "Technical Debt Management",
    questions: questions.filter(q => q.category === "Technical Debt Management")
  },
  {
    name: "Backward Compatibility & Lifecycle",
    questions: questions.filter(q => q.category === "Backward Compatibility & Lifecycle")
  },
  {
    name: "Business Agility",
    questions: questions.filter(q => q.category === "Business Agility")
  }
];