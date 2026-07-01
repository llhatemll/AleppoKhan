export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
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
};

export type OrderItemInput = {
  productId: string;
  quantity: number;
};
