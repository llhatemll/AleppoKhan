export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  images: string[];
  deliveryFee: number;
  featured: boolean;
  soldOut: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
  deliveryFee: number;
};

export type OrderItemInput = {
  productId: string;
  quantity: number;
};
