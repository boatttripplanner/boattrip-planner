// Types for Educational Platform functionality - Phase 3
export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  duration: number; // hours
  modules: Module[];
  instructor: Instructor;
  price: CoursePrice;
  certificate: CertificateInfo;
  requirements: string[];
  outcomes: string[];
  reviews: CourseReview[];
  rating: number;
  enrolledStudents: number;
  status: CourseStatus;
  tags: string[];
  thumbnail: string;
  previewVideo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  content: Content[];
  duration: number; // minutes
  quiz?: Quiz;
  resources: Resource[];
  order: number;
  isRequired: boolean;
  completionCriteria: CompletionCriteria;
}

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  data: any;
  duration: number; // minutes
  order: number;
  isRequired: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number; // minutes
  passingScore: number; // percentage
  attempts: number;
  isRequired: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  order: number;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  url: string;
  size?: number;
  description?: string;
  isRequired: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  credentials: Credential[];
  experience: number; // years
  rating: number;
  coursesCount: number;
  studentsCount: number;
  specializations: string[];
  contact: InstructorContact;
  verified: boolean;
}

export interface Credential {
  id: string;
  type: CredentialType;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  verificationUrl?: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  parentCategory?: string;
  subcategories?: CourseCategory[];
  courseCount: number;
}

export interface CoursePrice {
  amount: number;
  currency: string;
  type: PriceType;
  originalPrice?: number;
  discounts?: CourseDiscount[];
  subscriptionIncluded: boolean;
}

export interface CourseDiscount {
  type: DiscountType;
  value: number;
  description: string;
  validFrom: Date;
  validTo: Date;
  conditions?: string[];
}

export interface CertificateInfo {
  included: boolean;
  name: string;
  description: string;
  issuer: string;
  validityPeriod?: number; // months
  requirements: string[];
  template: CertificateTemplate;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  design: CertificateDesign;
  fields: CertificateField[];
}

export interface CertificateDesign {
  backgroundColor: string;
  textColor: string;
  logo?: string;
  watermark?: string;
  border?: string;
  font: string;
}

export interface CertificateField {
  id: string;
  name: string;
  type: FieldType;
  position: Position;
  value: string;
  required: boolean;
}

export interface CourseReview {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: CourseProgress;
  startDate: Date;
  completionDate?: Date;
  certificate?: Certificate;
  payment: EnrollmentPayment;
}

export interface CourseProgress {
  completedModules: string[];
  currentModule?: string;
  overallProgress: number; // percentage
  timeSpent: number; // minutes
  lastActivity: Date;
  quizScores: QuizScore[];
}

export interface QuizScore {
  quizId: string;
  score: number;
  attempts: number;
  bestScore: number;
  completedAt: Date;
}

export interface Certificate {
  id: string;
  studentId: string;
  courseId: string;
  certificateNumber: string;
  issueDate: Date;
  expiryDate?: Date;
  status: CertificateStatus;
  downloadUrl: string;
  verificationUrl: string;
}

export interface EnrollmentPayment {
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: Date;
}

export interface Webinar {
  id: string;
  title: string;
  description: string;
  instructor: Instructor;
  date: Date;
  duration: number; // minutes
  maxParticipants: number;
  currentParticipants: number;
  price: WebinarPrice;
  status: WebinarStatus;
  recordingUrl?: string;
  materials: Resource[];
}

export interface WebinarPrice {
  amount: number;
  currency: string;
  type: WebinarPriceType;
  earlyBirdDiscount?: WebinarDiscount;
}

export interface WebinarDiscount {
  amount: number;
  validUntil: Date;
  description: string;
}

export interface MentoringSession {
  id: string;
  mentorId: string;
  studentId: string;
  topic: string;
  description: string;
  date: Date;
  duration: number; // minutes
  price: number;
  status: MentoringStatus;
  meetingUrl?: string;
  notes?: string;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  courses: LearningPathCourse[];
  duration: number; // hours
  difficulty: CourseLevel;
  price: number;
  certificate: CertificateInfo;
  prerequisites: string[];
  outcomes: string[];
}

export interface LearningPathCourse {
  courseId: string;
  order: number;
  isRequired: boolean;
  estimatedDuration: number; // hours
}

// Enums
export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  SUSPENDED = 'suspended'
}

export enum ContentType {
  VIDEO = 'video',
  AUDIO = 'audio',
  TEXT = 'text',
  PDF = 'pdf',
  INTERACTIVE = 'interactive',
  QUIZ = 'quiz'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  FILL_BLANK = 'fill_blank',
  ESSAY = 'essay',
  MATCHING = 'matching'
}

export enum ResourceType {
  PDF = 'pdf',
  VIDEO = 'video',
  AUDIO = 'audio',
  LINK = 'link',
  DOCUMENT = 'document',
  IMAGE = 'image'
}

export enum CredentialType {
  LICENSE = 'license',
  CERTIFICATION = 'certification',
  DEGREE = 'degree',
  DIPLOMA = 'diploma',
  AWARD = 'award'
}

export enum PriceType {
  ONE_TIME = 'one_time',
  SUBSCRIPTION = 'subscription',
  FREE = 'free'
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_COURSE = 'free_course'
}

export enum FieldType {
  TEXT = 'text',
  DATE = 'date',
  NUMBER = 'number',
  IMAGE = 'image'
}

export enum EnrollmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

export enum CertificateStatus {
  PENDING = 'pending',
  ISSUED = 'issued',
  EXPIRED = 'expired',
  REVOKED = 'revoked'
}

export enum WebinarStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum WebinarPriceType {
  FREE = 'free',
  PAID = 'paid',
  SUBSCRIPTION = 'subscription'
}

export enum MentoringStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum CompletionCriteria {
  ALL_CONTENT = 'all_content',
  QUIZ_PASS = 'quiz_pass',
  MINIMUM_TIME = 'minimum_time',
  CUSTOM = 'custom'
}

// Position interface for certificate fields
export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Educational Platform API Types
export interface CourseFilters {
  category?: string;
  level?: CourseLevel;
  priceRange?: {
    min: number;
    max: number;
  };
  duration?: {
    min: number;
    max: number;
  };
  rating?: number;
  instructor?: string;
  tags?: string[];
  status?: CourseStatus;
}

export interface CourseSearchParams {
  query?: string;
  filters: CourseFilters;
  sortBy?: CourseSortOption;
  page: number;
  limit: number;
}

export enum CourseSortOption {
  TITLE_A_Z = 'title_a_z',
  TITLE_Z_A = 'title_z_a',
  PRICE_LOW_TO_HIGH = 'price_low_to_high',
  PRICE_HIGH_TO_LOW = 'price_high_to_low',
  RATING_HIGH_TO_LOW = 'rating_high_to_low',
  NEWEST = 'newest',
  POPULAR = 'popular',
  DURATION_SHORT_TO_LONG = 'duration_short_to_long'
}

// Educational Analytics Types
export interface EducationalAnalytics {
  totalCourses: number;
  activeStudents: number;
  totalEnrollments: number;
  totalRevenue: number;
  averageRating: number;
  completionRate: number;
  topCourses: CourseAnalytics[];
  topInstructors: InstructorAnalytics[];
  revenueByMonth: MonthlyRevenue[];
}

export interface CourseAnalytics {
  course: Course;
  enrollments: number;
  completions: number;
  revenue: number;
  averageRating: number;
  averageProgress: number;
}

export interface InstructorAnalytics {
  instructor: Instructor;
  coursesCount: number;
  studentsCount: number;
  revenue: number;
  averageRating: number;
  completionRate: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  enrollments: number;
  coursesSold: number;
} 