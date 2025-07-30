// Types for Enterprise Solutions functionality - Phase 3
export interface EnterpriseAccount {
  id: string;
  company: Company;
  subscription: EnterpriseSubscription;
  users: EnterpriseUser[];
  fleet: Fleet[];
  integrations: Integration[];
  reports: Report[];
  settings: EnterpriseSettings;
  support: SupportInfo;
  analytics: EnterpriseAnalytics;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  legalName: string;
  taxId: string;
  industry: Industry;
  size: CompanySize;
  location: CompanyLocation;
  contact: CompanyContact;
  logo: string;
  website: string;
  description: string;
  founded: Date;
  verified: boolean;
}

export interface EnterpriseSubscription {
  plan: EnterprisePlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  billingCycle: BillingCycle;
  features: EnterpriseFeature[];
  limits: EnterpriseLimits;
  pricing: EnterprisePricing;
  customizations: Customization[];
}

export interface EnterpriseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  department: string;
  position: string;
  avatar: string;
  status: UserStatus;
  lastLogin: Date;
  createdAt: Date;
}

export interface Fleet {
  id: string;
  name: string;
  description: string;
  vessels: Vessel[];
  maintenance: Maintenance[];
  operations: Operation[];
  analytics: FleetAnalytics;
  settings: FleetSettings;
  createdAt: Date;
}

export interface Vessel {
  id: string;
  name: string;
  type: VesselType;
  model: string;
  year: number;
  length: number; // meters
  beam: number; // meters
  draft: number; // meters
  capacity: number; // passengers
  specifications: VesselSpecifications;
  documents: VesselDocument[];
  maintenance: Maintenance[];
  operations: Operation[];
  status: VesselStatus;
  location: VesselLocation;
  tracking: TrackingInfo;
}

export interface VesselSpecifications {
  engine: EngineInfo;
  fuelCapacity: number; // liters
  waterCapacity: number; // liters
  maxSpeed: number; // knots
  cruisingSpeed: number; // knots
  range: number; // nautical miles
  equipment: Equipment[];
  safety: SafetyEquipment[];
}

export interface EngineInfo {
  type: EngineType;
  manufacturer: string;
  model: string;
  power: number; // horsepower
  fuelType: FuelType;
  year: number;
  hours: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  manufacturer: string;
  model: string;
  serialNumber: string;
  installationDate: Date;
  warrantyExpiry: Date;
  status: EquipmentStatus;
}

export interface SafetyEquipment {
  id: string;
  name: string;
  type: SafetyEquipmentType;
  quantity: number;
  expiryDate: Date;
  lastInspection: Date;
  nextInspection: Date;
  status: SafetyStatus;
}

export interface VesselDocument {
  id: string;
  name: string;
  type: DocumentType;
  number: string;
  issueDate: Date;
  expiryDate: Date;
  issuingAuthority: string;
  status: DocumentStatus;
  fileUrl: string;
}

export interface Maintenance {
  id: string;
  vesselId: string;
  type: MaintenanceType;
  title: string;
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  cost: number;
  provider: string;
  technician: string;
  parts: MaintenancePart[];
  status: MaintenanceStatus;
  priority: Priority;
  notes: string;
}

export interface MaintenancePart {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  cost: number;
  supplier: string;
  warranty: Date;
}

export interface Operation {
  id: string;
  vesselId: string;
  type: OperationType;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  captain: string;
  crew: CrewMember[];
  passengers: number;
  route: Route;
  fuelConsumption: number;
  revenue: number;
  expenses: number;
  status: OperationStatus;
  weather: WeatherInfo;
  incidents: Incident[];
}

export interface CrewMember {
  id: string;
  name: string;
  role: CrewRole;
  license: string;
  experience: number; // years
  contact: ContactInfo;
  availability: Availability[];
}

export interface Route {
  id: string;
  name: string;
  waypoints: Waypoint[];
  totalDistance: number; // nautical miles
  estimatedDuration: number; // hours
  fuelRequired: number; // liters
  weatherConditions: WeatherCondition[];
  restrictions: Restriction[];
}

export interface Waypoint {
  id: string;
  name: string;
  coordinates: Coordinates;
  type: WaypointType;
  arrivalTime: Date;
  departureTime: Date;
  activities: Activity[];
}

export interface Incident {
  id: string;
  type: IncidentType;
  severity: Severity;
  description: string;
  date: Date;
  location: Coordinates;
  involved: string[];
  actions: Action[];
  status: IncidentStatus;
}

export interface Action {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  completedDate?: Date;
  status: ActionStatus;
}

export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  provider: string;
  status: IntegrationStatus;
  config: IntegrationConfig;
  syncStatus: SyncStatus;
  lastSync: Date;
  errors: IntegrationError[];
}

export interface IntegrationConfig {
  apiKey: string;
  endpoint: string;
  credentials: Credentials;
  mappings: FieldMapping[];
  schedule: SyncSchedule;
}

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  description: string;
  parameters: ReportParameter[];
  schedule: ReportSchedule;
  recipients: string[];
  format: ReportFormat;
  lastGenerated: Date;
  status: ReportStatus;
}

export interface ReportParameter {
  id: string;
  name: string;
  type: ParameterType;
  value: any;
  required: boolean;
  options?: any[];
}

export interface EnterpriseSettings {
  branding: BrandingSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  compliance: ComplianceSettings;
  integrations: IntegrationSettings;
}

export interface BrandingSettings {
  logo: string;
  colors: ColorScheme;
  fonts: FontSettings;
  customDomain: string;
  whiteLabel: boolean;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface FontSettings {
  heading: string;
  body: string;
  size: FontSize;
}

export interface NotificationSettings {
  email: EmailSettings;
  sms: SMSSettings;
  push: PushSettings;
  webhook: WebhookSettings;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: PasswordPolicy;
  ipWhitelist: string[];
  auditLog: boolean;
}

export interface ComplianceSettings {
  gdpr: boolean;
  sox: boolean;
  iso27001: boolean;
  dataRetention: DataRetentionPolicy;
  backupPolicy: BackupPolicy;
}

export interface SupportInfo {
  level: SupportLevel;
  contact: SupportContact;
  sla: SLA;
  tickets: SupportTicket[];
  knowledgeBase: KnowledgeBaseArticle[];
}

export interface SupportContact {
  email: string;
  phone: string;
  chat: boolean;
  hours: string;
  timezone: string;
}

export interface SLA {
  responseTime: number; // hours
  resolutionTime: number; // hours
  availability: number; // percentage
  penalties: Penalty[];
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
  responses: TicketResponse[];
}

export interface EnterpriseAnalytics {
  fleetMetrics: FleetMetrics;
  operationalMetrics: OperationalMetrics;
  financialMetrics: FinancialMetrics;
  complianceMetrics: ComplianceMetrics;
  customDashboards: Dashboard[];
}

export interface FleetMetrics {
  totalVessels: number;
  activeVessels: number;
  maintenanceDue: number;
  averageUtilization: number;
  fuelEfficiency: number;
  safetyScore: number;
}

export interface OperationalMetrics {
  totalOperations: number;
  completedOperations: number;
  onTimePerformance: number;
  customerSatisfaction: number;
  incidentRate: number;
  crewUtilization: number;
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  profitMargin: number;
  costPerHour: number;
  revenuePerVessel: number;
  maintenanceCosts: number;
}

export interface ComplianceMetrics {
  documentExpiry: number;
  inspectionDue: number;
  certificationValid: number;
  auditScore: number;
  regulatoryCompliance: number;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  layout: Layout;
  permissions: Permission[];
  refreshRate: number;
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  dataSource: string;
  config: WidgetConfig;
  position: Position;
  size: Size;
}

// Enums
export enum Industry {
  MARINE_TRANSPORT = 'marine_transport',
  TOURISM = 'tourism',
  FISHING = 'fishing',
  OFFSHORE = 'offshore',
  DEFENSE = 'defense',
  RESEARCH = 'research',
  OTHER = 'other'
}

export enum CompanySize {
  SMALL = 'small', // 1-50 employees
  MEDIUM = 'medium', // 51-250 employees
  LARGE = 'large', // 251-1000 employees
  ENTERPRISE = 'enterprise' // 1000+ employees
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
  CUSTOM = 'custom'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export enum VesselType {
  MOTOR_YACHT = 'motor_yacht',
  SAILING_YACHT = 'sailing_yacht',
  CATAMARAN = 'catamaran',
  FISHING_BOAT = 'fishing_boat',
  CHARTER_BOAT = 'charter_boat',
  FERRY = 'ferry',
  CARGO_SHIP = 'cargo_ship',
  RESEARCH_VESSEL = 'research_vessel'
}

export enum VesselStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service',
  RETIRED = 'retired'
}

export enum EngineType {
  DIESEL = 'diesel',
  GASOLINE = 'gasoline',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid'
}

export enum FuelType {
  DIESEL = 'diesel',
  GASOLINE = 'gasoline',
  LPG = 'lpg',
  ELECTRIC = 'electric'
}

export enum EquipmentType {
  NAVIGATION = 'navigation',
  COMMUNICATION = 'communication',
  SAFETY = 'safety',
  ENTERTAINMENT = 'entertainment',
  COMFORT = 'comfort'
}

export enum EquipmentStatus {
  OPERATIONAL = 'operational',
  MAINTENANCE = 'maintenance',
  REPAIR = 'repair',
  REPLACED = 'replaced'
}

export enum SafetyEquipmentType {
  LIFE_JACKET = 'life_jacket',
  LIFE_RAFT = 'life_raft',
  FIRE_EXTINGUISHER = 'fire_extinguisher',
  EPIRB = 'epirb',
  FLARES = 'flares',
  FIRST_AID = 'first_aid'
}

export enum SafetyStatus {
  VALID = 'valid',
  EXPIRED = 'expired',
  INSPECTION_DUE = 'inspection_due',
  REPLACED = 'replaced'
}

export enum MaintenanceType {
  PREVENTIVE = 'preventive',
  CORRECTIVE = 'corrective',
  EMERGENCY = 'emergency',
  INSPECTION = 'inspection'
}

export enum MaintenanceStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum OperationType {
  CHARTER = 'charter',
  TRANSPORT = 'transport',
  FISHING = 'fishing',
  RESEARCH = 'research',
  TRAINING = 'training',
  MAINTENANCE = 'maintenance'
}

export enum OperationStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DELAYED = 'delayed'
}

export enum CrewRole {
  CAPTAIN = 'captain',
  FIRST_MATE = 'first_mate',
  ENGINEER = 'engineer',
  DECKHAND = 'deckhand',
  STEWARD = 'steward',
  CHEF = 'chef'
}

export enum WaypointType {
  DEPARTURE = 'departure',
  DESTINATION = 'destination',
  STOPOVER = 'stopover',
  REFUEL = 'refuel',
  MAINTENANCE = 'maintenance'
}

export enum IncidentType {
  MECHANICAL = 'mechanical',
  WEATHER = 'weather',
  NAVIGATION = 'navigation',
  SAFETY = 'safety',
  MEDICAL = 'medical',
  SECURITY = 'security'
}

export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum IncidentStatus {
  REPORTED = 'reported',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum ActionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum IntegrationType {
  CRM = 'crm',
  ACCOUNTING = 'accounting',
  BOOKING = 'booking',
  WEATHER = 'weather',
  NAVIGATION = 'navigation',
  MAINTENANCE = 'maintenance'
}

export enum IntegrationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  CONFIGURING = 'configuring'
}

export enum SyncStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  IN_PROGRESS = 'in_progress',
  PENDING = 'pending'
}

export enum ReportType {
  OPERATIONAL = 'operational',
  FINANCIAL = 'financial',
  MAINTENANCE = 'maintenance',
  COMPLIANCE = 'compliance',
  CUSTOM = 'custom'
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json'
}

export enum ReportStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error'
}

export enum SupportLevel {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise'
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  WAITING = 'waiting',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum WidgetType {
  CHART = 'chart',
  METRIC = 'metric',
  TABLE = 'table',
  MAP = 'map',
  TIMELINE = 'timeline',
  GAUGE = 'gauge'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Additional interfaces
export interface CompanyLocation {
  country: string;
  state: string;
  city: string;
  address: string;
  postalCode: string;
  timezone: string;
}

export interface CompanyContact {
  primary: ContactPerson;
  billing: ContactPerson;
  technical: ContactPerson;
}

export interface ContactPerson {
  name: string;
  email: string;
  phone: string;
  position: string;
}

export interface EnterprisePlan {
  name: string;
  features: string[];
  limits: PlanLimits;
  pricing: PlanPricing;
}

export interface PlanLimits {
  users: number;
  vessels: number;
  integrations: number;
  storage: number; // GB
  apiCalls: number;
}

export interface PlanPricing {
  monthly: number;
  yearly: number;
  setup: number;
  custom: boolean;
}

export interface EnterpriseFeature {
  name: string;
  enabled: boolean;
  config: any;
}

export interface EnterpriseLimits {
  users: number;
  vessels: number;
  integrations: number;
  storage: number;
  apiCalls: number;
  custom: Record<string, number>;
}

export interface EnterprisePricing {
  basePrice: number;
  perUser: number;
  perVessel: number;
  customFeatures: CustomFeature[];
}

export interface CustomFeature {
  name: string;
  price: number;
  description: string;
}

export interface Customization {
  type: string;
  config: any;
  enabled: boolean;
}

export interface Permission {
  resource: string;
  actions: string[];
  conditions?: any;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface VesselLocation {
  marina: string;
  berth: string;
  coordinates: Coordinates;
  lastUpdate: Date;
}

export interface TrackingInfo {
  enabled: boolean;
  deviceId: string;
  lastPosition: Coordinates;
  lastUpdate: Date;
  speed: number;
  heading: number;
}

export interface WeatherInfo {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  waveHeight: number;
  visibility: number;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: Date;
  temperature: number;
  windSpeed: number;
  windDirection: number;
  waveHeight: number;
  visibility: number;
}

export interface WeatherCondition {
  type: string;
  severity: string;
  description: string;
}

export interface Restriction {
  type: string;
  description: string;
  impact: string;
}

export interface Activity {
  type: string;
  description: string;
  duration: number;
  cost: number;
}

export interface Availability {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface IntegrationError {
  code: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface Credentials {
  username: string;
  password: string;
  apiKey?: string;
  token?: string;
}

export interface FieldMapping {
  source: string;
  target: string;
  transform?: string;
}

export interface SyncSchedule {
  frequency: string;
  time: string;
  enabled: boolean;
}

export interface ReportSchedule {
  frequency: ReportFrequency;
  time: string;
  dayOfWeek?: string;
  dayOfMonth?: number;
  enabled: boolean;
}

export enum ReportFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export interface IntegrationSettings {
  webhooks: WebhookConfig[];
  apiKeys: ApiKeyConfig[];
  rateLimits: RateLimitConfig;
}

export interface WebhookConfig {
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
}

export interface ApiKeyConfig {
  name: string;
  key: string;
  permissions: string[];
  expiresAt?: Date;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
}

export interface EmailSettings {
  enabled: boolean;
  templates: EmailTemplate[];
  recipients: string[];
}

export interface SMSSettings {
  enabled: boolean;
  provider: string;
  recipients: string[];
}

export interface PushSettings {
  enabled: boolean;
  channels: string[];
}

export interface WebhookSettings {
  enabled: boolean;
  endpoints: WebhookEndpoint[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface WebhookEndpoint {
  url: string;
  events: string[];
  secret: string;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expiryDays: number;
}

export interface DataRetentionPolicy {
  period: number; // days
  archiveAfter: number; // days
  deleteAfter: number; // days
}

export interface BackupPolicy {
  frequency: string;
  retention: number; // days
  location: string;
  encryption: boolean;
}

export interface Penalty {
  type: string;
  description: string;
  amount: number;
}

export interface TicketResponse {
  id: string;
  author: string;
  message: string;
  timestamp: Date;
  internal: boolean;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WidgetConfig {
  chartType?: string;
  dataSource?: string;
  filters?: any;
  refreshInterval?: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Layout {
  type: string;
  columns: number;
  rows: number;
  widgets: Widget[];
}

export enum ParameterType {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  MULTISELECT = 'multiselect'
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
} 