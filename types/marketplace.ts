// Types for Marketplace functionality - Phase 3
export interface MarketplaceService {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  provider: ServiceProvider;
  price: Price;
  location: Location;
  availability: Availability;
  reviews: Review[];
  rating: number;
  images: string[];
  features: string[];
  requirements: string[];
  cancellationPolicy: CancellationPolicy;
  insurance: InsuranceInfo;
  status: ServiceStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceProvider {
  id: string;
  name: string;
  description: string;
  logo: string;
  rating: number;
  verified: boolean;
  location: Location;
  services: string[];
  contact: ContactInfo;
  documents: Document[];
  subscription: ProviderSubscription;
  earnings: ProviderEarnings;
  status: ProviderStatus;
  joinedAt: Date;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  parentCategory?: string;
  subcategories?: ServiceCategory[];
}

export interface Price {
  amount: number;
  currency: string;
  type: PriceType;
  perUnit: string;
  discounts?: Discount[];
  seasonalPricing?: SeasonalPrice[];
}

export interface Location {
  country: string;
  region: string;
  city: string;
  port?: string;
  marina?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  address: string;
  postalCode: string;
}

export interface Availability {
  startDate: Date;
  endDate: Date;
  availableDays: DayOfWeek[];
  availableHours: TimeRange[];
  maxBookings: number;
  currentBookings: number;
  blackoutDates: Date[];
}

export interface Review {
  id: string;
  userId: string;
  serviceId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CancellationPolicy {
  type: CancellationType;
  refundPercentage: number;
  timeLimit: number; // hours before service
  description: string;
}

export interface InsuranceInfo {
  included: boolean;
  coverage: string[];
  deductible: number;
  provider: string;
  policyNumber?: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  userId: string;
  providerId: string;
  status: BookingStatus;
  dates: BookingDates;
  participants: number;
  totalPrice: Price;
  payment: PaymentInfo;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingDates {
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  duration: number; // hours
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  amount: Price;
  fees: Price;
  commission: Price;
  paidAt?: Date;
}

export interface ProviderSubscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  features: string[];
  limits: SubscriptionLimits;
}

export interface ProviderEarnings {
  total: number;
  thisMonth: number;
  thisYear: number;
  pending: number;
  paid: number;
  commission: number;
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  verified: boolean;
  uploadedAt: Date;
  expiresAt?: Date;
}

export interface ContactInfo {
  email: string;
  phone: string;
  website?: string;
  socialMedia?: SocialMedia;
  emergencyContact?: EmergencyContact;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface Discount {
  type: DiscountType;
  value: number;
  description: string;
  validFrom: Date;
  validTo: Date;
  conditions?: string[];
}

export interface SeasonalPrice {
  season: string;
  multiplier: number;
  startDate: Date;
  endDate: Date;
}

export interface TimeRange {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

// Enums
export enum ServiceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_APPROVAL = 'pending_approval'
}

export enum ProviderStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification'
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  STRIPE = 'stripe'
}

export enum PriceType {
  FIXED = 'fixed',
  PER_HOUR = 'per_hour',
  PER_DAY = 'per_day',
  PER_PERSON = 'per_person',
  NEGOTIABLE = 'negotiable'
}

export enum CancellationType {
  FLEXIBLE = 'flexible',
  MODERATE = 'moderate',
  STRICT = 'strict',
  NON_REFUNDABLE = 'non_refundable'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended'
}

export enum DocumentType {
  LICENSE = 'license',
  INSURANCE = 'insurance',
  CERTIFICATION = 'certification',
  IDENTITY = 'identity',
  BUSINESS = 'business'
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping'
}

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

// Marketplace API Types
export interface MarketplaceFilters {
  category?: string;
  location?: Location;
  priceRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  rating?: number;
  features?: string[];
  availability?: boolean;
}

export interface MarketplaceSearchParams {
  query?: string;
  filters: MarketplaceFilters;
  sortBy?: SortOption;
  page: number;
  limit: number;
}

export enum SortOption {
  PRICE_LOW_TO_HIGH = 'price_low_to_high',
  PRICE_HIGH_TO_LOW = 'price_high_to_low',
  RATING_HIGH_TO_LOW = 'rating_high_to_low',
  NEWEST = 'newest',
  POPULAR = 'popular'
}

// Marketplace Analytics Types
export interface MarketplaceAnalytics {
  totalServices: number;
  activeProviders: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  topCategories: CategoryAnalytics[];
  topProviders: ProviderAnalytics[];
  revenueByMonth: MonthlyRevenue[];
}

export interface CategoryAnalytics {
  category: ServiceCategory;
  serviceCount: number;
  bookingCount: number;
  revenue: number;
  averageRating: number;
}

export interface ProviderAnalytics {
  provider: ServiceProvider;
  serviceCount: number;
  bookingCount: number;
  revenue: number;
  averageRating: number;
  commission: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  bookings: number;
  commission: number;
}

// Marketplace Notification Types
export interface MarketplaceNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

export enum NotificationType {
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_CANCELLED = 'booking_cancelled',
  PAYMENT_RECEIVED = 'payment_received',
  REVIEW_RECEIVED = 'review_received',
  SERVICE_APPROVED = 'service_approved',
  SERVICE_REJECTED = 'service_rejected',
  NEW_MESSAGE = 'new_message'
} 