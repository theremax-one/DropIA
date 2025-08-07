export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string;
  categoryId: string;
  sellerId: string;
  stock: number;
  type: 'download' | 'api_access' | 'subscription';
  features: string;
  requirements?: string;
  demoUrl?: string;
  downloadUrl?: string;
  apiEndpoint?: string;
  subscriptionDuration?: number;
  createdAt: Date;
  updatedAt: Date;
  stats?: ProductStats;
  seller?: {
    id: string;
    name: string;
    email: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  productCount?: number;
  color?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    product: Product;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  platformFee: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentIntent {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  clientSecret: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payout {
  id: string;
  sellerId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  requestDate: Date;
  processedDate?: Date;
  notes?: string;
}

export interface DigitalProductAccess {
  id: string;
  userId: string;
  productId: string;
  accessKey: string;
  downloadUrl?: string;
  accessType: 'download' | 'api' | 'subscription';
  expiresAt?: Date;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'payment' | 'system';
  message: string;
  read: boolean;
  createdAt: Date;
  relatedId?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  usageTime?: 'less_than_month' | 'one_to_three_months' | 'more_than_three_months';
  pros?: string[];
  cons?: string[];
  likes: number;
  userResponse?: {
    userId: string;
    comment: string;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductStats {
  id: string;
  productId: string;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  ratingCounts: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  totalReviews: number;
  activeUsers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductRecommendation {
  id: string;
  userId: string;
  productId: string;
  score: number;
  reason: 'similar_purchases' | 'category_interest' | 'rating_based' | 'complementary';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInterest {
  id: string;
  userId: string;
  categoryId: string;
  interactionCount: number;
  lastInteraction: Date;
  averageTimeSpent: number;
  purchaseCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductRelation {
  id: string;
  productId: string;
  relatedProductId: string;
  strength: number;
  type: 'complementary' | 'similar' | 'frequently_bought_together';
  createdAt: Date;
  updatedAt: Date;
}