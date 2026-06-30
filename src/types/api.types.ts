// ============ Auth Types ============
export type ApiResponse<T = any> = {
  success: boolean;
  data: T;
  message?: string;
  statusCode: number;
  pagination:{
    total: number,
    page: number,
    totalPages: number
  }
};

export type ApiError = {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
};

export type RegisterRequest = {
  email: string;
  password: string;
  phone: string;
  first_name: string;
  last_name: string;
};

export type LoginRequest = {
  phone: string;
  password: string;
};

export type AuthResponse = {
  user: {
    id: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    role: string;
  };
  token: string;
};
export type ProfileResponse = {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  role: string;
};
// ============ Product Types ============

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string;
  created_at: string;
  updated_at: string;
  realPrice:number;
  weight:number
};
export type ProductsWithRealPrices = {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string;
  realPrice:number;
  weight:number
};
// 1- Product Type Enum
export enum ProductType {
  GOLD_18 = 'gold_18',
  SAHAT_BAHAR = 'sahat_bahar',
  SAHAT_EMAMI = 'sahat_emami',
  NIM_SAHAT = 'nim_sahat',
  ROB_SAHAT = 'rob_sahat',
  SAHAT_SOT = 'sahat_sot',
}
export type AddProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  created_at: string;
  updated_at: string;
  priceType:string ; 
  productType:ProductType;
  wages:number;
  profit:number;
  tax:number;
  weight:number;
  weightSot:number;
  gemPrice:number;
  gemActive:number;
  priceValue:number;
};

export type PaginationInfo = {
  total: number;
  page: number;
  totalPages: number;
};

export type ProductsListResponse = {
  products: Product[];
};

export type GetProductsParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export type CreateProductRequest = {
  title: string;
  price: number;
  description?: string;
  images: string[];
};

export type UpdateProductRequest = Partial<CreateProductRequest>;

export type ProductMutationResponse = {
  id: number;
};

export type GetProductResponse = Product;


// ============ Upload Types ============

export type UploadFolder = 'article' | 'profile' | 'product';

export type UploadResponseData = {
  url: string;
  filename: string;
  original_name: string;
  size: number;
};

export type UploadRequest = {
  file: File;
  folder: UploadFolder;
};

export type AllowedMimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp'
  | 'image/gif'
  | 'video/mp4'
  | 'video/webm';

export const UPLOAD_CONFIG = {
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
  ] as AllowedMimeType[],
  MAX_SIZE: 50 * 1024 * 1024,
  MAX_SIZE_MB: 50,
} as const;

export type UploadError = {
  type: 'invalid_type' | 'too_large' | 'empty' | 'network' | 'server';
  message: string;
};



// ============ Order Types ============

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export type OrderItemRequest = {
  id: number;
  weight: number;
};


export type OrderItemResponse = {
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_title?: string;
  id?: number;
};

export type CreateOrderRequest = {
  items: OrderItemRequest[];
};

export type CreateOrderResponse = {
  order_id: number;
  total_amount: number;
  items: OrderItemResponse[];
};

export type UserOrder = {
  id: number;
  user_id: number;
  total_amount: number;
  status: OrderStatus;
  seen: boolean;
  created_at: string;
  items: OrderItemResponse[];
};

export type AdminOrder = {
  id: number;
  user_id: number;
  total_amount: number;
  status: OrderStatus;
  seen: boolean;
  first_name: string;
  last_name: string;
  email: string;
  phone:string;
  created_at: string;
  updated_at:string
};

export type AdminOrderDetail = {
  order:AdminOrder , 
  user : ProfileResponse , 
  items :{
    order_item_id: number
    quantity: number
    unit_price: number
    total_price: number
    product: Product
  }[]
};

export type AdminOrderFilters = {
  seen?: boolean;
  start_date?: string;
  end_date?: string;
};


// ============ Article Types ============

export type Article = {
  id: number;
  title: string;
  slug: string;
  content: string;
  is_published: boolean;
  view_count: number;
  hashtags: string[];
  admin_id: number;
  description:string;
  // created_at: string;
  // updated_at: string;
  image: string
};

export type ArticleSummary = Pick<Article, 'id' | 'title' | 'slug' | 'hashtags' > & {
  first_name: string;
  last_name: string;
};

export type AdminArticle = Article;

export type ArticleWithRelated = {
  article: Article;
  related: ArticleSummary[];
};

export type CreateArticleRequest = {
  title: string;
  slug: string;
  content: string;
  description:string;
  is_published?: boolean;
  hashtags?: string[];
  image: string
};

export type UpdateArticleRequest = Partial<CreateArticleRequest>;

export type ArticleMutationResponse = {
  id: number;
};

export const SLUG_REGEX = /^[\u0600-\u06FFa-z0-9]+(?:-[\u0600-\u06FFa-z0-9]+)*$/;



// ============ User Management Types ============

export type UserRole = 'user' | 'admin' | 'manager';

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
};

export type UsersListResponse = User[];

export type GetUsersParams = {
  role?: UserRole;
  search?: string;
};

export type UpdateUserRoleRequest = {
  role: UserRole;
};

export type UserStats = {
  total: number;
  by_role: {
    role: UserRole;
    count: number;
  }[];
  new_last_30_days: number;
};

export const VALID_ROLES: UserRole[] = ['user', 'admin', 'manager'];


// ============ Gold Price Types ============

export interface MarketIndicator {
  id: number;
  name: string;
  title: string;
  p: string;
  h: string;
  l: string;
  o: string;
  d: string;
  dp: number;
  dt: 'high' | 'low';
  t: string;
  updated_at: string;
}

export interface MarketResponse {
  indicators: MarketIndicator[];
}

export interface MarketApiResponse {
  response: MarketResponse;
}