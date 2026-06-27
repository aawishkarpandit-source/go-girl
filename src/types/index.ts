export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  sizes: string[];
  colors: string[];
  in_stock: boolean;
  featured: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: string;
  user_email: string;
  items: CartItem[];
  total: number;
  status: string;
  created_at: string;
}
