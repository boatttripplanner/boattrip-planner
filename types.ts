

import type { Chat } from "@google/genai";

export interface BoatTransferDetails {
  model?: string;
  averageConsumption?: string; // e.g., "20 L/h"
  tankCapacity?: string;     // e.g., "500 L"
  cruisingSpeed?: string;    // e.g., "20 knots"
  beam?: string;             // e.g., "4.5 m"
  length?: string;           // e.g., "15 m"
  draft?: string;            // e.g., "2.2 m"
}

export enum BudgetLevel {
  ECONOMY = 'economy',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  LUXURY = 'luxury',
  SPECIFIC_AMOUNT = 'specific_amount' 
}

export enum PlanningMode {
  OWN_BOAT = 'own_boat',
  RENTAL = 'rental',
}

export const planningModeOptions: { value: PlanningMode; label: string }[] = [
  { value: PlanningMode.RENTAL, label: 'Quiero Alquilar un Barco' },
  { value: PlanningMode.OWN_BOAT, label: 'Mi Barco Propio' },
];

export interface UserPreferences {
  planningMode: PlanningMode; 
  destination: string;
  numPeople: number;
  budgetLevel?: BudgetLevel; 
  customBudgetAmount?: number; 
  budgetNotes?: string;     
  activities: string[];
  boatType?: string; 
  experience: ExperienceLevel;
  startDate?: string;
  endDate?: string;
  transferDestinationPort?: string;
  otherActivities?: string;
  desiredExperienceType: DesiredExperienceType;
  boatTransferDetails?: BoatTransferDetails;
  numTripDays?: number;
  isSamePortForMultiDay?: boolean;
  arrivalPortForMultiDay?: string;
  boatingLicense?: BoatingLicenseType;
  multiDayTripNotes?: string;
}

export interface WeatherData {
  date: string;
  temperatureMin: number;
  temperatureMax: number;
  temperatureUnit: string;
  dayIconPhrase: string;
  dayWindSpeed: number;
  dayWindUnit: string;
  dayWindDirection?: string;
  nightIconPhrase?: string;
  nightWindSpeed?: number;
  nightWindUnit?: string;
  nightWindDirection?: string;
  link?: string;
  accuWeatherDayIcon?: number;
  accuWeatherNightIcon?: number;
}

export interface Recommendation {
  text: string;
  chatHistory?: ChatMessage[]; 
  weatherData?: WeatherData[] | null;
  weatherError?: string | null;
  isFetchingWeather?: boolean;
  isAwaitingLocationData?: boolean;
  weatherAdaptations?: string; // Texto de las adaptaciones meteorológicas

}



export enum DesiredExperienceType {
  FULL_DAY = 'full_day',
  HALF_DAY_MORNING = 'half_day_morning',
  HALF_DAY_AFTERNOON = 'half_day_afternoon',
  SUNSET = 'sunset',
  MULTI_DAY = 'multi_day',
  TRANSFER = 'transfer'
}

export const desiredExperienceTypeOptions: { value: DesiredExperienceType; label: string }[] = [
  { value: DesiredExperienceType.FULL_DAY, label: 'Día Completo' },
  { value: DesiredExperienceType.HALF_DAY_MORNING, label: 'Medio Día/Mañana' },
  { value: DesiredExperienceType.HALF_DAY_AFTERNOON, label: 'Medio Día/Tarde' },
  { value: DesiredExperienceType.SUNSET, label: 'Puesta de Sol (Sunset)' },
  { value: DesiredExperienceType.MULTI_DAY, label: 'Varios Días' },
  { value: DesiredExperienceType.TRANSFER, label: 'Traslado (Solo Transporte)' },
];

export enum ExperienceLevel {
  BEGINNER_NEEDS_SKIPPER = 'beginner_needs_skipper',
  BASIC_KNOWLEDGE_PREFERS_SKIPPER = 'basic_knowledge_prefers_skipper',
  EXPERIENCED_WITH_LICENSE_NO_SKIPPER = 'experienced_with_license_no_skipper',
  EXPERT_ADVANCED_LICENSE = 'expert_advanced_license',
}

export const experienceLevelOptions: { value: ExperienceLevel; label: string }[] = [
  { value: ExperienceLevel.BEGINNER_NEEDS_SKIPPER, label: 'Principiante (necesita patrón, sin experiencia)' },
  { value: ExperienceLevel.BASIC_KNOWLEDGE_PREFERS_SKIPPER, label: 'Con Nociones Básicas (puede ayudar, prefiere patrón)' },
  { value: ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER, label: 'Experimentado (con licencia, puede navegar solo)' },
  { value: ExperienceLevel.EXPERT_ADVANCED_LICENSE, label: 'Experto (licencia avanzada, busca desafíos)' },
];

export enum BoatingLicenseType {
  NO_LICENSE = 'no_license',
  LNB = 'lnb',
  PNB = 'pnb',
  PER = 'per',
  PER_EXTENDED = 'per_extended',
  PY = 'py',
  CY = 'cy'
}

export const boatingLicenseTypeOptions: { value: BoatingLicenseType; label: string }[] = [
  { value: BoatingLicenseType.NO_LICENSE, label: 'Sin Titulación / No Requerida' },
  { value: BoatingLicenseType.LNB, label: 'LNB (Licencia de Navegación)' },
  { value: BoatingLicenseType.PNB, label: 'PNB (Patrón de Navegación Básica)' },
  { value: BoatingLicenseType.PER, label: 'PER (Patrón de Embarcaciones de Recreo)' },
  { value: BoatingLicenseType.PER_EXTENDED, label: 'PER Ampliado (Habilitación Baleares/Vela)' },
  { value: BoatingLicenseType.PY, label: 'PY (Patrón de Yate)' },
  { value: BoatingLicenseType.CY, label: 'Capitán de Yate' }
];

export const activityOptions: string[] = [
  // Actividades de Relax y Naturaleza
  'Tomar el Sol y Relajarse en Cubierta',
  'Observación de Puestas de Sol desde el Mar',
  'Fotografía Paisajística y Marina',
  'Avistamiento de Delfines o Fauna Marina',
  
  // Actividades Acuáticas
  'Snorkel',
  'Buceo (con equipo propio o guía)',
  'Buceo con botella (submarinismo)',
  'Paddle Surf (SUP)',
  'Kayak o Canoa',
  'Deportes Acuáticos (Esquí, Wakeboard, Donut)',
  
  // Exploración y Aventura
  'Visitar Calas Escondidas',
  'Exploración Costera y Cuevas Marinas',
  'Visitar Puertos Pintorescos y Paseos Marítimos',
  'Navegación a Vela (si aplica)',
  
  // Pesca y Gastronomía
  'Pesca Recreativa',
  'Comida o Picnic a Bordo',
  
  // Celebraciones
  'Celebraciones Especiales (Cumpleaños, Aniversarios)',
  'Romántico (Parejas)',
  'Familiar (con Niños)',
  'Grupo de Amigos'
];

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export type ChatRole = 'user' | 'model';

export interface AppChatSession {
  id: string; 
  geminiChat: Chat; 
  history: ChatMessage[]; 
  isLoading: boolean;
}

// Type for custom checklist items
export interface CustomChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

// AccuWeather API specific types
// Weather data interfaces
export interface WeatherServiceConfig {
  enabled: boolean;
  useSimulatedData: boolean;
}

export interface AccuWeatherLocationResponse {
  Key: string;
  LocalizedName: string;
  Country: { ID: string };
  AdministrativeArea: { ID: string; LocalizedName: string };
}

export interface AccuWeatherForecastResponse {
  DailyForecasts: {
    Date: string;
    Temperature: {
      Minimum: { Value: number; Unit: string };
      Maximum: { Value: number; Unit: string };
    };
    Day: {
      Icon: number;
      IconPhrase: string;
      Wind: { Speed: { Value: number; Unit: string }; Direction: { Degrees: number; Localized: string } };
    };
    Night: {
      Icon: number;
      IconPhrase: string;
      Wind: { Speed: { Value: number; Unit: string }; Direction: { Degrees: number; Localized: string } };
    };
    Link: string;
  }[];
}

// App View Management
export enum AppView {
  MAIN_APP = 'main_app',
  NOT_FOUND = 'not_found',
  BLOG_INDEX = 'blog_index',
  BLOG_POST = 'blog_post',
  ABOUT_US = 'about_us',
}

// Cookie Consent Status
export enum CookieConsentStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined', 
}

export interface UserInputFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isLoading: boolean;
  cookieConsent: CookieConsentStatus;
  onReconsiderCookies: () => void;
  showAppInstallBanner?: boolean;
}

export interface WizardStepProps {
  data: UserPreferences;
  updateData: (fields: Partial<UserPreferences>) => void;
  isPrimaryInputDisabled: boolean;
  onReconsiderCookies: () => void;
}

export interface WizardNavigationProps {
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
    isLoading: boolean;
    isNextDisabled?: boolean;
}

export interface HeaderProps {
  title: string;
  onNavigateHome: () => void;
  onNavigateToBlogIndex?: () => void; 
  currentView: AppView;
}


export interface FooterProps {
  onShowPrivacyPolicy: () => void;
  onShowTermsOfService: () => void;
  onNavigateToMainApp: () => void;
  onNavigateToBlogIndex?: () => void;
  showAds: boolean; 
  currentView: AppView;
}

export interface NotFoundPageProps {
  onNavigateHome: () => void;
  showAppInstallBanner?: boolean;
}

// Blog specific types
export interface BlogPostFrontmatter {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  author?: string;
  summary: string;
  featuredImage?: string; // Path to image, e.g., /images/blog/my-post.jpg
  tags?: string[];
}

export interface ParsedMarkdownPost {
  frontmatter: BlogPostFrontmatter;
  content: string;
}

export interface BlogIndexPageProps {
  onNavigateToPost: (slug: string) => void;
  onNavigateHome: () => void;
  showAppInstallBanner?: boolean;
}

export interface BlogPostPageProps {
  slug: string | null;
  onNavigateToBlogIndex: () => void;
  onNavigateHome: () => void;
  onNavigateToPost: (slug: string) => void;
  showAppInstallBanner?: boolean;
}

// Unsplash Integration Types
export interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

export interface UnsplashSearchResult {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}

export type UnsplashCategory = 'destinations' | 'boats' | 'sailing' | 'ports' | 'sunset' | 'crew';

export interface UnsplashImageProps {
  category?: UnsplashCategory;
  searchQuery?: string;
  width?: number;
  height?: number;
  quality?: number;
  showAttribution?: boolean;
  className?: string;
  alt?: string;
  fallbackSrc?: string;
}

export interface UnsplashImageGalleryProps {
  category?: UnsplashCategory;
  searchQuery?: string;
  count?: number;
  title?: string;
  showAttribution?: boolean;
  className?: string;
}

// Tipos para automatización de blog
export interface BlogContentRequest {
  topic: string;
  category: 'destinos' | 'equipamiento' | 'técnicas' | 'reviews' | 'sostenibilidad' | 'familia' | 'aventuras';
  targetAudience: 'principiantes' | 'intermedios' | 'expertos';
  contentType: 'guia' | 'review' | 'destino' | 'tutorial' | 'noticias';
  targetLength: 'corta' | 'media' | 'larga';
  includeProducts: boolean;
  includeImages: boolean;
  seoKeywords: string[];
  affiliateFocus?: string[];
}

export interface GeneratedBlogContent {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  images: BlogImage[];
  products: BlogProduct[];
  seoData: SEOData;
  readingTime: number;
  publishDate: string;
  tags: string[];
  category: string;
}

export interface BlogImage {
  url: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  position: 'header' | 'inline' | 'gallery';
  unsplashId?: string;
  photographer?: string;
}

export interface BlogProduct {
  asin: string;
  title: string;
  price: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  affiliateUrl: string;
  category: string;
  description: string;
  pros: string[];
  cons: string[];
  position: 'inline' | 'sidebar' | 'gallery';
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string;
  structuredData: any;
}


