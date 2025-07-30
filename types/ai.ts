// Types for AI and Machine Learning functionality - Phase 3
export interface AISystem {
  id: string;
  name: string;
  type: AISystemType;
  version: string;
  status: AISystemStatus;
  models: AIModel[];
  configurations: AIConfiguration;
  performance: AIPerformance;
  training: TrainingInfo;
  deployment: DeploymentInfo;
  monitoring: MonitoringInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIModel {
  id: string;
  name: string;
  type: ModelType;
  version: string;
  architecture: ModelArchitecture;
  parameters: ModelParameters;
  performance: ModelPerformance;
  training: ModelTraining;
  deployment: ModelDeployment;
  status: ModelStatus;
}

export interface ModelArchitecture {
  type: ArchitectureType;
  layers: Layer[];
  inputShape: number[];
  outputShape: number[];
  activationFunctions: string[];
  regularization: RegularizationConfig;
}

export interface Layer {
  id: string;
  type: LayerType;
  units: number;
  activation: string;
  dropout?: number;
  batchNormalization?: boolean;
  parameters: LayerParameters;
}

export interface ModelParameters {
  totalParameters: number;
  trainableParameters: number;
  nonTrainableParameters: number;
  learningRate: number;
  batchSize: number;
  epochs: number;
  optimizer: OptimizerConfig;
  lossFunction: string;
  metrics: string[];
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  rocCurve: ROCCurve;
  precisionRecallCurve: PrecisionRecallCurve;
  customMetrics: CustomMetric[];
}

export interface ModelTraining {
  dataset: DatasetInfo;
  split: DataSplit;
  trainingHistory: TrainingHistory;
  validationResults: ValidationResult[];
  hyperparameters: Hyperparameters;
  augmentation: DataAugmentation;
}

export interface ModelDeployment {
  environment: DeploymentEnvironment;
  endpoint: string;
  version: string;
  scaling: ScalingConfig;
  monitoring: DeploymentMonitoring;
  rollback: RollbackConfig;
}

export interface PredictiveAnalytics {
  id: string;
  name: string;
  type: PredictiveType;
  target: string;
  features: Feature[];
  model: AIModel;
  predictions: Prediction[];
  accuracy: PredictionAccuracy;
  insights: PredictionInsight[];
  alerts: PredictionAlert[];
}

export interface Feature {
  id: string;
  name: string;
  type: FeatureType;
  description: string;
  importance: number;
  correlation: number;
  dataType: DataType;
  preprocessing: PreprocessingStep[];
  validation: FeatureValidation;
}

export interface Prediction {
  id: string;
  timestamp: Date;
  input: PredictionInput;
  output: PredictionOutput;
  confidence: number;
  model: string;
  version: string;
  metadata: PredictionMetadata;
}

export interface PredictionInput {
  features: FeatureValue[];
  context: PredictionContext;
  constraints: PredictionConstraint[];
}

export interface PredictionOutput {
  value: any;
  probability: number;
  confidence: number;
  explanation: PredictionExplanation;
  alternatives: PredictionAlternative[];
}

export interface RouteOptimization {
  id: string;
  name: string;
  type: OptimizationType;
  constraints: OptimizationConstraint[];
  objectives: OptimizationObjective[];
  algorithm: OptimizationAlgorithm;
  solution: OptimizationSolution;
  performance: OptimizationPerformance;
}

export interface OptimizationConstraint {
  id: string;
  type: ConstraintType;
  description: string;
  parameters: ConstraintParameters;
  priority: number;
  hard: boolean;
}

export interface OptimizationObjective {
  id: string;
  type: ObjectiveType;
  weight: number;
  target: number;
  direction: OptimizationDirection;
  description: string;
}

export interface OptimizationSolution {
  routes: OptimizedRoute[];
  totalCost: number;
  totalDistance: number;
  totalTime: number;
  efficiency: number;
  feasibility: boolean;
  alternatives: OptimizationAlternative[];
}

export interface OptimizedRoute {
  id: string;
  waypoints: Waypoint[];
  distance: number;
  duration: number;
  cost: number;
  fuel: number;
  weather: WeatherConditions;
  restrictions: RouteRestriction[];
}

export interface PricePrediction {
  id: string;
  name: string;
  type: PricePredictionType;
  market: MarketData;
  factors: PriceFactor[];
  model: AIModel;
  predictions: PricePrediction[];
  accuracy: PriceAccuracy;
  trends: PriceTrend[];
}

export interface MarketData {
  id: string;
  region: string;
  sector: string;
  data: MarketDataPoint[];
  indicators: MarketIndicator[];
  volatility: number;
  trends: MarketTrend[];
}

export interface PriceFactor {
  id: string;
  name: string;
  type: FactorType;
  weight: number;
  correlation: number;
  volatility: number;
  seasonality: SeasonalityPattern;
  impact: FactorImpact;
}

export interface PricePrediction {
  id: string;
  timestamp: Date;
  basePrice: number;
  predictedPrice: number;
  confidence: number;
  factors: FactorContribution[];
  scenario: PredictionScenario;
  validity: Date;
}

export interface SmartRecommendations {
  id: string;
  name: string;
  type: RecommendationType;
  user: UserProfile;
  context: RecommendationContext;
  items: RecommendationItem[];
  algorithm: RecommendationAlgorithm;
  performance: RecommendationPerformance;
}

export interface UserProfile {
  id: string;
  preferences: UserPreference[];
  behavior: UserBehavior;
  demographics: UserDemographics;
  history: UserHistory;
  segments: UserSegment[];
}

export interface RecommendationContext {
  location: Location;
  time: Date;
  weather: WeatherInfo;
  season: string;
  events: Event[];
  constraints: ContextConstraint[];
}

export interface RecommendationItem {
  id: string;
  type: ItemType;
  content: any;
  score: number;
  reason: RecommendationReason;
  metadata: ItemMetadata;
  actions: RecommendationAction[];
}

export interface AnomalyDetection {
  id: string;
  name: string;
  type: AnomalyType;
  data: AnomalyData[];
  model: AIModel;
  thresholds: AnomalyThreshold;
  alerts: AnomalyAlert[];
  performance: AnomalyPerformance;
}

export interface AnomalyData {
  id: string;
  timestamp: Date;
  value: number;
  expected: number;
  deviation: number;
  severity: AnomalySeverity;
  context: AnomalyContext;
  classification: AnomalyClassification;
}

export interface AnomalyAlert {
  id: string;
  timestamp: Date;
  anomaly: AnomalyData;
  severity: AlertSeverity;
  message: string;
  actions: AlertAction[];
  status: AlertStatus;
}

export interface ChatbotSystem {
  id: string;
  name: string;
  type: ChatbotType;
  model: AIModel;
  knowledge: KnowledgeBase;
  conversations: Conversation[];
  performance: ChatbotPerformance;
  integrations: ChatbotIntegration[];
}

export interface KnowledgeBase {
  id: string;
  name: string;
  documents: Document[];
  faqs: FAQ[];
  intents: Intent[];
  entities: Entity[];
  responses: Response[];
}

export interface Conversation {
  id: string;
  userId: string;
  sessionId: string;
  messages: Message[];
  context: ConversationContext;
  sentiment: SentimentAnalysis;
  satisfaction: number;
  resolution: ResolutionStatus;
}

export interface Message {
  id: string;
  timestamp: Date;
  sender: MessageSender;
  content: string;
  type: MessageType;
  intent: Intent;
  entities: Entity[];
  confidence: number;
  metadata: MessageMetadata;
}

// Enums
export enum AISystemType {
  PREDICTIVE_ANALYTICS = 'predictive_analytics',
  ROUTE_OPTIMIZATION = 'route_optimization',
  PRICE_PREDICTION = 'price_prediction',
  RECOMMENDATIONS = 'recommendations',
  ANOMALY_DETECTION = 'anomaly_detection',
  CHATBOT = 'chatbot',
  COMPUTER_VISION = 'computer_vision',
  NATURAL_LANGUAGE_PROCESSING = 'nlp'
}

export enum AISystemStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TRAINING = 'training',
  DEPLOYING = 'deploying',
  ERROR = 'error',
  MAINTENANCE = 'maintenance'
}

export enum ModelType {
  REGRESSION = 'regression',
  CLASSIFICATION = 'classification',
  CLUSTERING = 'clustering',
  DEEP_LEARNING = 'deep_learning',
  REINFORCEMENT_LEARNING = 'reinforcement_learning',
  TIME_SERIES = 'time_series',
  NLP = 'nlp',
  COMPUTER_VISION = 'computer_vision'
}

export enum ArchitectureType {
  FEEDFORWARD = 'feedforward',
  CONVOLUTIONAL = 'convolutional',
  RECURRENT = 'recurrent',
  TRANSFORMER = 'transformer',
  AUTOENCODER = 'autoencoder',
  GAN = 'gan',
  CUSTOM = 'custom'
}

export enum LayerType {
  DENSE = 'dense',
  CONVOLUTIONAL = 'convolutional',
  LSTM = 'lstm',
  GRU = 'gru',
  ATTENTION = 'attention',
  DROPOUT = 'dropout',
  BATCH_NORMALIZATION = 'batch_normalization'
}

export enum ModelStatus {
  TRAINING = 'training',
  TRAINED = 'trained',
  DEPLOYED = 'deployed',
  DEPRECATED = 'deprecated',
  ERROR = 'error'
}

export enum PredictiveType {
  DEMAND_FORECASTING = 'demand_forecasting',
  PRICE_PREDICTION = 'price_prediction',
  CUSTOMER_CHURN = 'customer_churn',
  MAINTENANCE_PREDICTION = 'maintenance_prediction',
  RISK_ASSESSMENT = 'risk_assessment',
  TREND_ANALYSIS = 'trend_analysis'
}

export enum FeatureType {
  NUMERICAL = 'numerical',
  CATEGORICAL = 'categorical',
  TEMPORAL = 'temporal',
  TEXT = 'text',
  IMAGE = 'image',
  GEOSPATIAL = 'geospatial'
}

export enum DataType {
  INTEGER = 'integer',
  FLOAT = 'float',
  STRING = 'string',
  BOOLEAN = 'boolean',
  DATE = 'date',
  DATETIME = 'datetime',
  ARRAY = 'array',
  OBJECT = 'object'
}

export enum OptimizationType {
  ROUTE_OPTIMIZATION = 'route_optimization',
  SCHEDULE_OPTIMIZATION = 'schedule_optimization',
  RESOURCE_ALLOCATION = 'resource_allocation',
  COST_OPTIMIZATION = 'cost_optimization',
  FUEL_OPTIMIZATION = 'fuel_optimization'
}

export enum ConstraintType {
  TIME = 'time',
  DISTANCE = 'distance',
  CAPACITY = 'capacity',
  WEATHER = 'weather',
  REGULATORY = 'regulatory',
  SAFETY = 'safety',
  COST = 'cost'
}

export enum ObjectiveType {
  MINIMIZE_COST = 'minimize_cost',
  MINIMIZE_TIME = 'minimize_time',
  MINIMIZE_DISTANCE = 'minimize_distance',
  MAXIMIZE_EFFICIENCY = 'maximize_efficiency',
  MAXIMIZE_SAFETY = 'maximize_safety',
  MINIMIZE_FUEL = 'minimize_fuel'
}

export enum OptimizationDirection {
  MINIMIZE = 'minimize',
  MAXIMIZE = 'maximize'
}

export enum PricePredictionType {
  DYNAMIC_PRICING = 'dynamic_pricing',
  MARKET_ANALYSIS = 'market_analysis',
  COMPETITIVE_PRICING = 'competitive_pricing',
  SEASONAL_PRICING = 'seasonal_pricing',
  DEMAND_BASED_PRICING = 'demand_based_pricing'
}

export enum FactorType {
  MARKET = 'market',
  SEASONAL = 'seasonal',
  COMPETITIVE = 'competitive',
  OPERATIONAL = 'operational',
  EXTERNAL = 'external'
}

export enum RecommendationType {
  CONTENT_BASED = 'content_based',
  COLLABORATIVE = 'collaborative',
  HYBRID = 'hybrid',
  CONTEXTUAL = 'contextual',
  REAL_TIME = 'real_time'
}

export enum ItemType {
  BOAT = 'boat',
  DESTINATION = 'destination',
  ACTIVITY = 'activity',
  SERVICE = 'service',
  COURSE = 'course',
  EQUIPMENT = 'equipment'
}

export enum AnomalyType {
  STATISTICAL = 'statistical',
  MACHINE_LEARNING = 'machine_learning',
  RULE_BASED = 'rule_based',
  HYBRID = 'hybrid'
}

export enum AnomalySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export enum ChatbotType {
  RULE_BASED = 'rule_based',
  AI_POWERED = 'ai_powered',
  HYBRID = 'hybrid',
  VOICE = 'voice',
  MULTIMODAL = 'multimodal'
}

export enum MessageSender {
  USER = 'user',
  BOT = 'bot',
  SYSTEM = 'system'
}

export enum MessageType {
  TEXT = 'text',
  VOICE = 'voice',
  IMAGE = 'image',
  BUTTON = 'button',
  QUICK_REPLY = 'quick_reply'
}

export enum ResolutionStatus {
  RESOLVED = 'resolved',
  ESCALATED = 'escalated',
  PENDING = 'pending',
  FAILED = 'failed'
}

// Additional interfaces
export interface AIConfiguration {
  modelConfig: ModelConfiguration;
  trainingConfig: TrainingConfiguration;
  deploymentConfig: DeploymentConfiguration;
  monitoringConfig: MonitoringConfiguration;
}

export interface ModelConfiguration {
  architecture: string;
  hyperparameters: Hyperparameters;
  regularization: RegularizationConfig;
  optimization: OptimizerConfig;
}

export interface TrainingConfiguration {
  dataset: string;
  validationSplit: number;
  batchSize: number;
  epochs: number;
  earlyStopping: EarlyStoppingConfig;
  callbacks: Callback[];
}

export interface DeploymentConfiguration {
  environment: string;
  scaling: ScalingConfig;
  monitoring: boolean;
  versioning: boolean;
}

export interface MonitoringConfiguration {
  metrics: string[];
  alerts: AlertConfig[];
  logging: LoggingConfig;
  performance: PerformanceConfig;
}

export interface AIPerformance {
  accuracy: number;
  latency: number;
  throughput: number;
  resourceUsage: ResourceUsage;
  cost: CostMetrics;
}

export interface TrainingInfo {
  startDate: Date;
  endDate: Date;
  duration: number;
  epochs: number;
  loss: number[];
  accuracy: number[];
  validationLoss: number[];
  validationAccuracy: number[];
}

export interface DeploymentInfo {
  environment: string;
  version: string;
  endpoint: string;
  status: DeploymentStatus;
  health: HealthStatus;
  scaling: ScalingInfo;
}

export interface MonitoringInfo {
  metrics: Metric[];
  alerts: Alert[];
  logs: Log[];
  performance: PerformanceMetrics;
}

export interface LayerParameters {
  weights: number[][];
  biases: number[];
  activation: string;
  regularization: RegularizationConfig;
}

export interface RegularizationConfig {
  l1: number;
  l2: number;
  dropout: number;
  batchNormalization: boolean;
}

export interface OptimizerConfig {
  type: string;
  learningRate: number;
  momentum: number;
  beta1: number;
  beta2: number;
  epsilon: number;
}

export interface ROCCurve {
  fpr: number[];
  tpr: number[];
  auc: number;
  thresholds: number[];
}

export interface PrecisionRecallCurve {
  precision: number[];
  recall: number[];
  thresholds: number[];
  averagePrecision: number;
}

export interface CustomMetric {
  name: string;
  value: number;
  description: string;
  threshold: number;
}

export interface DatasetInfo {
  name: string;
  size: number;
  features: number;
  samples: number;
  split: DataSplit;
  preprocessing: PreprocessingStep[];
}

export interface DataSplit {
  training: number;
  validation: number;
  test: number;
  stratification: boolean;
}

export interface TrainingHistory {
  loss: number[];
  accuracy: number[];
  valLoss: number[];
  valAccuracy: number[];
  learningRate: number[];
}

export interface ValidationResult {
  epoch: number;
  loss: number;
  accuracy: number;
  metrics: Metric[];
}

export interface Hyperparameters {
  learningRate: number;
  batchSize: number;
  epochs: number;
  optimizer: string;
  lossFunction: string;
  regularization: RegularizationConfig;
}

export interface DataAugmentation {
  enabled: boolean;
  techniques: AugmentationTechnique[];
  probability: number;
}

export interface DeploymentEnvironment {
  type: string;
  resources: ResourceRequirements;
  scaling: ScalingConfig;
  monitoring: boolean;
}

export interface ScalingConfig {
  minInstances: number;
  maxInstances: number;
  targetCPU: number;
  targetMemory: number;
  autoScaling: boolean;
}

export interface DeploymentMonitoring {
  metrics: string[];
  alerts: AlertConfig[];
  logging: LoggingConfig;
}

export interface RollbackConfig {
  enabled: boolean;
  versions: number;
  automatic: boolean;
  threshold: number;
}

export interface FeatureValue {
  name: string;
  value: any;
  type: DataType;
  confidence: number;
}

export interface PredictionContext {
  location: Location;
  time: Date;
  user: UserContext;
  environment: EnvironmentContext;
}

export interface PredictionConstraint {
  type: string;
  value: any;
  operator: string;
  description: string;
}

export interface PredictionExplanation {
  method: string;
  features: FeatureImportance[];
  rules: Rule[];
  confidence: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  direction: string;
  contribution: number;
}

export interface PredictionAlternative {
  value: any;
  probability: number;
  confidence: number;
  explanation: string;
}

export interface PredictionAccuracy {
  overall: number;
  byCategory: CategoryAccuracy[];
  byTime: TimeAccuracy[];
  trends: AccuracyTrend[];
}

export interface PredictionInsight {
  type: string;
  description: string;
  confidence: number;
  impact: number;
  recommendations: string[];
}

export interface PredictionAlert {
  id: string;
  type: string;
  message: string;
  severity: AlertSeverity;
  timestamp: Date;
  actions: AlertAction[];
}

export interface PreprocessingStep {
  type: string;
  parameters: any;
  order: number;
  description: string;
}

export interface FeatureValidation {
  type: string;
  rules: ValidationRule[];
  status: ValidationStatus;
  errors: ValidationError[];
}

export interface PredictionMetadata {
  model: string;
  version: string;
  timestamp: Date;
  processingTime: number;
  confidence: number;
}

export interface ConstraintParameters {
  min: number;
  max: number;
  target: number;
  tolerance: number;
  unit: string;
}

export interface OptimizationAlgorithm {
  type: string;
  parameters: AlgorithmParameters;
  convergence: ConvergenceCriteria;
  performance: AlgorithmPerformance;
}

export interface AlgorithmParameters {
  populationSize: number;
  generations: number;
  mutationRate: number;
  crossoverRate: number;
  selectionMethod: string;
}

export interface ConvergenceCriteria {
  maxIterations: number;
  tolerance: number;
  improvementThreshold: number;
  stagnationLimit: number;
}

export interface OptimizationPerformance {
  iterations: number;
  convergenceTime: number;
  solutionQuality: number;
  computationalCost: number;
}

export interface OptimizationAlternative {
  routes: OptimizedRoute[];
  cost: number;
  efficiency: number;
  feasibility: boolean;
  ranking: number;
}

export interface WeatherConditions {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  waveHeight: number;
  visibility: number;
  forecast: WeatherForecast[];
}

export interface RouteRestriction {
  type: string;
  description: string;
  impact: string;
  alternatives: string[];
}

export interface MarketDataPoint {
  timestamp: Date;
  price: number;
  volume: number;
  demand: number;
  supply: number;
  indicators: MarketIndicator[];
}

export interface MarketIndicator {
  name: string;
  value: number;
  trend: string;
  significance: number;
}

export interface MarketTrend {
  direction: string;
  strength: number;
  duration: number;
  confidence: number;
  factors: string[];
}

export interface SeasonalityPattern {
  type: string;
  period: number;
  amplitude: number;
  phase: number;
  trend: number;
}

export interface FactorImpact {
  magnitude: number;
  direction: string;
  confidence: number;
  timeframe: number;
}

export interface FactorContribution {
  factor: string;
  contribution: number;
  direction: string;
  confidence: number;
}

export interface PredictionScenario {
  name: string;
  probability: number;
  conditions: ScenarioCondition[];
  impact: number;
}

export interface PriceAccuracy {
  overall: number;
  byRegion: RegionAccuracy[];
  byTime: TimeAccuracy[];
  byFactor: FactorAccuracy[];
}

export interface PriceTrend {
  direction: string;
  magnitude: number;
  duration: number;
  confidence: number;
  drivers: string[];
}

export interface UserPreference {
  category: string;
  value: any;
  weight: number;
  lastUpdated: Date;
}

export interface UserBehavior {
  clicks: ClickEvent[];
  searches: SearchEvent[];
  bookings: BookingEvent[];
  ratings: RatingEvent[];
  patterns: BehaviorPattern[];
}

export interface UserDemographics {
  age: number;
  gender: string;
  location: Location;
  income: string;
  interests: string[];
}

export interface UserHistory {
  interactions: Interaction[];
  purchases: Purchase[];
  preferences: Preference[];
  feedback: Feedback[];
}

export interface UserSegment {
  id: string;
  name: string;
  criteria: SegmentCriteria[];
  size: number;
  characteristics: SegmentCharacteristic[];
}

export interface Event {
  id: string;
  type: string;
  name: string;
  date: Date;
  location: Location;
  impact: number;
}

export interface ContextConstraint {
  type: string;
  value: any;
  priority: number;
  description: string;
}

export interface RecommendationReason {
  type: string;
  description: string;
  confidence: number;
  factors: string[];
}

export interface ItemMetadata {
  category: string;
  tags: string[];
  attributes: Attribute[];
  popularity: number;
  availability: boolean;
}

export interface RecommendationAction {
  type: string;
  label: string;
  url: string;
  parameters: any;
}

export interface RecommendationAlgorithm {
  type: string;
  parameters: AlgorithmParameters;
  performance: AlgorithmPerformance;
  updates: AlgorithmUpdate[];
}

export interface RecommendationPerformance {
  accuracy: number;
  diversity: number;
  novelty: number;
  serendipity: number;
  coverage: number;
}

export interface AnomalyThreshold {
  statistical: StatisticalThreshold;
  ml: MLThreshold;
  rule: RuleThreshold;
}

export interface StatisticalThreshold {
  method: string;
  confidence: number;
  window: number;
  threshold: number;
}

export interface MLThreshold {
  model: string;
  confidence: number;
  threshold: number;
  retraining: RetrainingConfig;
}

export interface RuleThreshold {
  rules: Rule[];
  logic: string;
  threshold: number;
}

export interface AnomalyContext {
  location: Location;
  time: Date;
  conditions: Condition[];
  history: AnomalyData[];
}

export interface AnomalyClassification {
  type: string;
  category: string;
  severity: AnomalySeverity;
  confidence: number;
  explanation: string;
}

export interface AlertAction {
  type: string;
  description: string;
  parameters: any;
  executed: boolean;
  result: any;
}

export interface AnomalyPerformance {
  detectionRate: number;
  falsePositiveRate: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  type: string;
  tags: string[];
  lastUpdated: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  confidence: number;
}

export interface Intent {
  id: string;
  name: string;
  description: string;
  examples: string[];
  entities: Entity[];
  responses: Response[];
  confidence: number;
}

export interface Entity {
  id: string;
  name: string;
  type: string;
  value: string;
  confidence: number;
  synonyms: string[];
}

export interface Response {
  id: string;
  type: string;
  content: string;
  conditions: Condition[];
  confidence: number;
}

export interface ConversationContext {
  session: string;
  user: UserContext;
  topic: string;
  history: Message[];
  state: ConversationState;
}

export interface UserContext {
  id: string;
  preferences: UserPreference[];
  history: UserHistory;
  currentLocation: Location;
  device: DeviceInfo;
}

export interface ConversationState {
  currentIntent: string;
  entities: Entity[];
  confidence: number;
  fallbackCount: number;
  escalationNeeded: boolean;
}

export interface SentimentAnalysis {
  overall: Sentiment;
  aspects: AspectSentiment[];
  confidence: number;
  emotions: Emotion[];
}

export interface MessageMetadata {
  platform: string;
  device: string;
  location: Location;
  timestamp: Date;
  processingTime: number;
}

export interface ChatbotPerformance {
  accuracy: number;
  responseTime: number;
  satisfaction: number;
  resolutionRate: number;
  escalationRate: number;
}

export interface ChatbotIntegration {
  type: string;
  platform: string;
  config: IntegrationConfig;
  status: IntegrationStatus;
}

// Additional enums and interfaces
export enum DeploymentStatus {
  DEPLOYING = 'deploying',
  ACTIVE = 'active',
  FAILED = 'failed',
  ROLLING_BACK = 'rolling_back'
}

export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
  UNKNOWN = 'unknown'
}

export enum ValidationStatus {
  VALID = 'valid',
  INVALID = 'invalid',
  PENDING = 'pending'
}

export enum AugmentationTechnique {
  ROTATION = 'rotation',
  FLIPPING = 'flipping',
  SCALING = 'scaling',
  NOISE = 'noise',
  CROPPING = 'cropping'
}

export enum Sentiment {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
  MIXED = 'mixed'
}

export enum Emotion {
  JOY = 'joy',
  SADNESS = 'sadness',
  ANGER = 'anger',
  FEAR = 'fear',
  SURPRISE = 'surprise',
  DISGUST = 'disgust'
}

export enum IntegrationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  CONFIGURING = 'configuring'
}

// Additional interfaces for completeness
export interface ResourceUsage {
  cpu: number;
  memory: number;
  gpu: number;
  storage: number;
  network: number;
}

export interface CostMetrics {
  training: number;
  inference: number;
  storage: number;
  total: number;
}

export interface ScalingInfo {
  currentInstances: number;
  targetInstances: number;
  cpuUtilization: number;
  memoryUtilization: number;
}

export interface Metric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags: Record<string, string>;
}

export interface Alert {
  id: string;
  type: string;
  message: string;
  severity: AlertSeverity;
  timestamp: Date;
  status: AlertStatus;
}

export interface Log {
  id: string;
  level: string;
  message: string;
  timestamp: Date;
  source: string;
  metadata: Record<string, any>;
}

export interface PerformanceMetrics {
  latency: number;
  throughput: number;
  errorRate: number;
  availability: number;
}

export interface AlertConfig {
  metric: string;
  threshold: number;
  operator: string;
  duration: number;
  actions: string[];
}

export interface LoggingConfig {
  level: string;
  format: string;
  destination: string;
  retention: number;
}

export interface PerformanceConfig {
  metrics: string[];
  sampling: number;
  aggregation: string;
  retention: number;
}

export interface ResourceRequirements {
  cpu: number;
  memory: number;
  gpu: number;
  storage: number;
}

export interface ClickEvent {
  timestamp: Date;
  element: string;
  page: string;
  session: string;
}

export interface SearchEvent {
  timestamp: Date;
  query: string;
  results: number;
  clicked: string[];
}

export interface BookingEvent {
  timestamp: Date;
  service: string;
  amount: number;
  status: string;
}

export interface RatingEvent {
  timestamp: Date;
  item: string;
  rating: number;
  review: string;
}

export interface BehaviorPattern {
  type: string;
  frequency: number;
  duration: number;
  confidence: number;
}

export interface Interaction {
  type: string;
  timestamp: Date;
  content: string;
  response: string;
}

export interface Purchase {
  id: string;
  timestamp: Date;
  items: string[];
  amount: number;
  status: string;
}

export interface Preference {
  category: string;
  value: any;
  strength: number;
  lastUpdated: Date;
}

export interface Feedback {
  type: string;
  content: string;
  rating: number;
  timestamp: Date;
}

export interface SegmentCriteria {
  attribute: string;
  operator: string;
  value: any;
}

export interface SegmentCharacteristic {
  attribute: string;
  value: any;
  frequency: number;
}

export interface Attribute {
  name: string;
  value: any;
  type: string;
  importance: number;
}

export interface AlgorithmUpdate {
  timestamp: Date;
  version: string;
  changes: string[];
  performance: PerformanceMetrics;
}

export interface RetrainingConfig {
  frequency: string;
  trigger: string;
  threshold: number;
  dataset: string;
}

export interface Rule {
  id: string;
  condition: string;
  action: string;
  priority: number;
  enabled: boolean;
}

export interface Condition {
  attribute: string;
  operator: string;
  value: any;
}

export interface ValidationRule {
  type: string;
  parameters: any;
  message: string;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: string;
}

export interface CategoryAccuracy {
  category: string;
  accuracy: number;
  samples: number;
  errors: number;
}

export interface TimeAccuracy {
  period: string;
  accuracy: number;
  trend: string;
}

export interface AccuracyTrend {
  direction: string;
  magnitude: number;
  duration: number;
  confidence: number;
}

export interface RegionAccuracy {
  region: string;
  accuracy: number;
  samples: number;
}

export interface FactorAccuracy {
  factor: string;
  accuracy: number;
  impact: number;
}

export interface ScenarioCondition {
  factor: string;
  value: any;
  probability: number;
}

export interface DeviceInfo {
  type: string;
  platform: string;
  version: string;
  capabilities: string[];
}

export interface AspectSentiment {
  aspect: string;
  sentiment: Sentiment;
  confidence: number;
}

export interface IntegrationConfig {
  endpoint: string;
  credentials: any;
  parameters: any;
  webhooks: string[];
} 