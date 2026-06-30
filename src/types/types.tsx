export interface ProductCardData{
    id:string,
    title:string,
    image : string ,
    price : number ,
    provider :string[] ,
}

export interface Post {
    id: number
    title: string
    slug: string
    content: string
    excerpt?: string
    published: boolean
    views: number
    created_at: string
    updated_at: string
  }
  
  export interface CreatePostDTO {
    title: string
    slug: string
    content: string
    excerpt?: string
    published?: boolean
  }
  
  export interface UploadImageResponse {
    success: boolean
    url: string
    message?: string
  }
  
  export interface CreatePostResponse {
    success: boolean
    post?: Post
    message?: string
  }

  export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    MANAGER = 'manager',
  }

 export interface TokenPayload {
    userId: string
    role: string
    email: string
    exp?: number
    iat?: number
  }

  export  interface CartItem {
    id: number;
    weight: number;
  }
  
  export interface CartState {
    items: CartItem[];
    totalItems: number;
  }
  