// Types for International Expansion functionality - Phase 3
export interface InternationalSettings {
  language: LanguageSettings;
  currency: CurrencySettings;
  region: RegionalSettings;
  content: LocalContentSettings;
  compliance: ComplianceSettings;
  partners: PartnerSettings;
}

export interface LanguageSettings {
  currentLanguage: string;
  availableLanguages: Language[];
  fallbackLanguage: string;
  autoDetect: boolean;
  preferences: LanguagePreference[];
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: TextDirection;
  dateFormat: string;
  timeFormat: string;
  numberFormat: NumberFormat;
  currency: string;
  timezone: string;
  status: LanguageStatus;
  completion: number; // translation completion percentage
}

export interface LanguagePreference {
  userId: string;
  primaryLanguage: string;
  secondaryLanguages: string[];
  interfaceLanguage: string;
  contentLanguage: string;
}

export interface CurrencySettings {
  currentCurrency: string;
  availableCurrencies: Currency[];
  autoConvert: boolean;
  exchangeRates: ExchangeRate[];
  updateFrequency: UpdateFrequency;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  position: CurrencyPosition;
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
  status: CurrencyStatus;
}

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: Date;
  source: string;
  reliability: number;
}

export interface RegionalSettings {
  currentRegion: string;
  availableRegions: Region[];
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: NumberFormat;
  addressFormat: AddressFormat;
  phoneFormat: PhoneFormat;
}

export interface Region {
  code: string;
  name: string;
  country: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: NumberFormat;
  addressFormat: AddressFormat;
  phoneFormat: PhoneFormat;
  currency: string;
  languages: string[];
  regulations: Regulation[];
  partners: Partner[];
}

export interface LocalContentSettings {
  autoLocalize: boolean;
  contentLanguages: ContentLanguage[];
  translationMemory: TranslationMemory[];
  qualityAssurance: QualityAssuranceSettings;
}

export interface ContentLanguage {
  language: string;
  region: string;
  content: LocalizedContent[];
  lastUpdated: Date;
  status: ContentStatus;
}

export interface LocalizedContent {
  id: string;
  type: ContentType;
  key: string;
  originalText: string;
  translatedText: string;
  language: string;
  region: string;
  context: string;
  status: TranslationStatus;
  translator: string;
  reviewedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TranslationMemory {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  context: string;
  quality: number;
  usageCount: number;
  createdAt: Date;
  lastUsed: Date;
}

export interface QualityAssuranceSettings {
  autoReview: boolean;
  reviewThreshold: number;
  glossary: GlossaryTerm[];
  styleGuide: StyleGuide;
  reviewers: Reviewer[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  translations: TermTranslation[];
  context: string;
  category: string;
}

export interface TermTranslation {
  language: string;
  translation: string;
  approved: boolean;
  approvedBy: string;
  approvedAt: Date;
}

export interface StyleGuide {
  id: string;
  language: string;
  region: string;
  rules: StyleRule[];
  examples: StyleExample[];
  lastUpdated: Date;
}

export interface StyleRule {
  id: string;
  category: string;
  rule: string;
  description: string;
  examples: string[];
}

export interface StyleExample {
  id: string;
  category: string;
  correct: string;
  incorrect: string;
  explanation: string;
}

export interface Reviewer {
  id: string;
  name: string;
  email: string;
  languages: string[];
  regions: string[];
  expertise: string[];
  availability: Availability[];
}

export interface ComplianceSettings {
  gdpr: GDPRCompliance;
  localLaws: LocalLaw[];
  dataResidency: DataResidencyPolicy;
  privacyPolicy: PrivacyPolicy[];
  termsOfService: TermsOfService[];
}

export interface GDPRCompliance {
  enabled: boolean;
  dataProcessingBasis: DataProcessingBasis[];
  dataSubjectRights: DataSubjectRight[];
  dataBreachProcedures: DataBreachProcedure[];
  dpo: DataProtectionOfficer;
}

export interface LocalLaw {
  country: string;
  region: string;
  laws: Law[];
  complianceStatus: ComplianceStatus;
  lastReview: Date;
  nextReview: Date;
}

export interface Law {
  id: string;
  name: string;
  description: string;
  requirements: Requirement[];
  penalties: Penalty[];
  effectiveDate: Date;
  status: LawStatus;
}

export interface DataResidencyPolicy {
  defaultRegion: string;
  allowedRegions: string[];
  dataTypes: DataType[];
  transferRestrictions: TransferRestriction[];
}

export interface PartnerSettings {
  partners: Partner[];
  agreements: PartnershipAgreement[];
  revenueSharing: RevenueSharingModel[];
  support: PartnerSupport[];
}

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  region: string;
  languages: string[];
  services: PartnerService[];
  contact: PartnerContact;
  agreement: PartnershipAgreement;
  performance: PartnerPerformance;
  status: PartnerStatus;
}

export interface PartnerService {
  id: string;
  name: string;
  description: string;
  pricing: PartnerPricing;
  availability: Availability[];
  quality: ServiceQuality;
}

export interface PartnerPricing {
  model: PricingModel;
  basePrice: number;
  commission: number;
  currency: string;
  terms: string[];
}

export interface PartnershipAgreement {
  id: string;
  partnerId: string;
  type: AgreementType;
  startDate: Date;
  endDate: Date;
  terms: AgreementTerm[];
  revenueSharing: RevenueSharing;
  obligations: Obligation[];
  status: AgreementStatus;
}

export interface RevenueSharing {
  model: RevenueSharingModel;
  percentages: RevenuePercentage[];
  minimumThreshold: number;
  paymentSchedule: PaymentSchedule;
}

export interface PartnerPerformance {
  revenue: number;
  bookings: number;
  customerSatisfaction: number;
  responseTime: number;
  qualityScore: number;
  lastMonth: PerformanceMetrics;
  thisMonth: PerformanceMetrics;
}

export interface PerformanceMetrics {
  revenue: number;
  bookings: number;
  customers: number;
  satisfaction: number;
  responseTime: number;
}

export interface PartnerSupport {
  level: SupportLevel;
  contact: SupportContact;
  sla: SLA;
  escalation: EscalationProcedure;
}

// Enums
export enum TextDirection {
  LTR = 'ltr',
  RTL = 'rtl'
}

export enum LanguageStatus {
  ACTIVE = 'active',
  BETA = 'beta',
  DEPRECATED = 'deprecated',
  PLANNED = 'planned'
}

export enum CurrencyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DEPRECATED = 'deprecated'
}

export enum CurrencyPosition {
  BEFORE = 'before',
  AFTER = 'after'
}

export enum UpdateFrequency {
  REAL_TIME = 'real_time',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly'
}

export enum ContentType {
  UI_TEXT = 'ui_text',
  CONTENT = 'content',
  EMAIL = 'email',
  NOTIFICATION = 'notification',
  DOCUMENT = 'document'
}

export enum TranslationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REVIEWED = 'reviewed',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  OUTDATED = 'outdated'
}

export enum PartnerType {
  DISTRIBUTOR = 'distributor',
  RESELLER = 'reseller',
  AFFILIATE = 'affiliate',
  INTEGRATOR = 'integrator',
  SERVICE_PROVIDER = 'service_provider'
}

export enum PricingModel {
  COMMISSION = 'commission',
  FIXED = 'fixed',
  TIERED = 'tiered',
  REVENUE_SHARE = 'revenue_share'
}

export enum AgreementType {
  DISTRIBUTION = 'distribution',
  RESELLER = 'reseller',
  AFFILIATE = 'affiliate',
  INTEGRATION = 'integration',
  SERVICE = 'service'
}

export enum RevenueSharingModel {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  TIERED = 'tiered',
  PERFORMANCE_BASED = 'performance_based'
}

export enum PartnerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export enum AgreementStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
  PENDING = 'pending'
}

export enum DataProcessingBasis {
  CONSENT = 'consent',
  CONTRACT = 'contract',
  LEGAL_OBLIGATION = 'legal_obligation',
  VITAL_INTERESTS = 'vital_interests',
  PUBLIC_TASK = 'public_task',
  LEGITIMATE_INTERESTS = 'legitimate_interests'
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PENDING_REVIEW = 'pending_review',
  UNDER_REVIEW = 'under_review'
}

export enum LawStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  AMENDED = 'amended',
  REPEALED = 'repealed'
}

// Additional interfaces
export interface NumberFormat {
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
  currencySymbol: string;
  currencyPosition: CurrencyPosition;
}

export interface AddressFormat {
  country: string;
  format: string[];
  requiredFields: string[];
  optionalFields: string[];
  validation: AddressValidation;
}

export interface AddressValidation {
  postalCode: PostalCodeValidation;
  phone: PhoneValidation;
  required: string[];
  optional: string[];
}

export interface PostalCodeValidation {
  pattern: string;
  length: number;
  example: string;
}

export interface PhoneValidation {
  pattern: string;
  length: number;
  countryCode: string;
  example: string;
}

export interface PhoneFormat {
  countryCode: string;
  nationalPrefix: string;
  format: string;
  length: number;
}

export interface Regulation {
  id: string;
  name: string;
  description: string;
  category: RegulationCategory;
  requirements: Requirement[];
  compliance: ComplianceRequirement;
}

export interface Requirement {
  id: string;
  description: string;
  mandatory: boolean;
  deadline: Date;
  status: RequirementStatus;
}

export interface ComplianceRequirement {
  status: ComplianceStatus;
  lastAssessment: Date;
  nextAssessment: Date;
  actions: ComplianceAction[];
}

export interface ComplianceAction {
  id: string;
  description: string;
  deadline: Date;
  assignedTo: string;
  status: ActionStatus;
}

export interface DataProtectionOfficer {
  name: string;
  email: string;
  phone: string;
  address: string;
  qualifications: string[];
}

export interface DataSubjectRight {
  right: string;
  description: string;
  process: string;
  timeframe: number;
  exceptions: string[];
}

export interface DataBreachProcedure {
  step: number;
  action: string;
  responsible: string;
  timeframe: number;
  documentation: string;
}

export interface DataType {
  type: string;
  description: string;
  retentionPeriod: number;
  allowedRegions: string[];
  transferRestrictions: string[];
}

export interface TransferRestriction {
  fromRegion: string;
  toRegion: string;
  restriction: string;
  justification: string;
  safeguards: string[];
}

export interface RevenuePercentage {
  tier: string;
  percentage: number;
  conditions: string[];
}

export interface PaymentSchedule {
  frequency: PaymentFrequency;
  dayOfMonth: number;
  processingTime: number;
  currency: string;
}

export interface Obligation {
  party: string;
  obligation: string;
  deadline: Date;
  status: ObligationStatus;
}

export interface EscalationProcedure {
  levels: EscalationLevel[];
  contacts: EscalationContact[];
  responseTimes: ResponseTime[];
}

export interface EscalationLevel {
  level: number;
  description: string;
  responseTime: number;
  actions: string[];
}

export interface EscalationContact {
  level: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface ResponseTime {
  severity: Severity;
  responseTime: number;
  resolutionTime: number;
}

export interface ServiceQuality {
  rating: number;
  reviews: number;
  responseTime: number;
  completionRate: number;
  customerSatisfaction: number;
}

export interface Availability {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  timezone: string;
  available: boolean;
}

export interface PartnerContact {
  primary: ContactPerson;
  technical: ContactPerson;
  billing: ContactPerson;
  emergency: ContactPerson;
}

export interface AgreementTerm {
  section: string;
  clause: string;
  description: string;
  obligations: string[];
  penalties: string[];
}

export interface Penalty {
  type: string;
  description: string;
  amount: number;
  currency: string;
  conditions: string[];
}

export interface PrivacyPolicy {
  language: string;
  region: string;
  version: string;
  effectiveDate: Date;
  content: string;
  lastUpdated: Date;
}

export interface TermsOfService {
  language: string;
  region: string;
  version: string;
  effectiveDate: Date;
  content: string;
  lastUpdated: Date;
}

export enum RegulationCategory {
  PRIVACY = 'privacy',
  DATA_PROTECTION = 'data_protection',
  CONSUMER_RIGHTS = 'consumer_rights',
  FINANCIAL = 'financial',
  MARITIME = 'maritime',
  ENVIRONMENTAL = 'environmental'
}

export enum RequirementStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue'
}

export enum ActionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ObligationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue'
}

export enum PaymentFrequency {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// International API Types
export interface LocalizationRequest {
  content: string;
  sourceLanguage: string;
  targetLanguage: string;
  context: string;
  priority: TranslationPriority;
}

export interface CurrencyConversionRequest {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  date?: Date;
}

export interface RegionalContentRequest {
  contentType: ContentType;
  region: string;
  language: string;
  filters?: any;
}

export enum TranslationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

// International Analytics Types
export interface InternationalAnalytics {
  languageUsage: LanguageUsage[];
  currencyUsage: CurrencyUsage[];
  regionalPerformance: RegionalPerformance[];
  partnerPerformance: PartnerPerformance[];
  complianceStatus: ComplianceStatus[];
}

export interface LanguageUsage {
  language: string;
  users: number;
  sessions: number;
  contentViews: number;
  conversionRate: number;
}

export interface CurrencyUsage {
  currency: string;
  transactions: number;
  volume: number;
  conversionRate: number;
  averageAmount: number;
}

export interface RegionalPerformance {
  region: string;
  users: number;
  revenue: number;
  growth: number;
  marketShare: number;
} 