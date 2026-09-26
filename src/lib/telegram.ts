import { formatIQD } from "./constants";

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
}

interface OrderNotificationData {
  id: string;
  fullName: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string | null;
  total: number;
  deliveryFee: number;
  items: OrderItem[];
}

export async function sendOrderNotification(order: OrderNotificationData): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return true;

  const orderNum = order.id.slice(-8).toUpperCase();
  const subtotal = order.total - order.deliveryFee;

  const itemLines = order.items.map((item) => `• ${item.title} × ${item.quantity} — ${formatIQD(item.price * item.quantity)}`).join("\n");

  const text = `🛒 *طلب جديد #${orderNum}*\n\n👤 *الاسم:* ${order.fullName}\n📞 *الهاتف:* ${order.phone}\n📍 *المحافظة:* ${order.governorate}\n🏠 *العنوان:* ${order.address}\n\n📦 *المنتجات:*\n${itemLines}\n\n💰 *الإجمالي:* ${formatIQD(order.total)}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}
