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
  items: OrderItem[];
}

export async function sendOrderNotification(order: OrderNotificationData) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const orderNum = order.id.slice(-8).toUpperCase();
  const siteUrl = "https://www.aleppokhan.com";

  const itemLines = order.items.map(
    (item) => `  • ${item.title} × ${item.quantity} — ${formatIQD(item.price * item.quantity)}`
  );

  const text = [
    `🛒 *طلب جديد #${orderNum}*`,
    ``,
    `👤 *الاسم:* ${order.fullName}`,
    `📞 *الهاتف:* ${order.phone}`,
    `📍 *المحافظة:* ${order.governorate}`,
    `🏠 *العنوان:* ${order.address}`,
    order.notes ? `📝 *ملاحظات:* ${order.notes}` : null,
    ``,
    `📦 *المنتجات:*`,
    ...itemLines,
    ``,
    `💰 *الإجمالي:* ${formatIQD(order.total)}`,
    ``,
    `🔗 [فتح الطلب في لوحة التحكم](${siteUrl}/admin/orders/${order.id})`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });
  } catch {
    // never crash the order flow due to Telegram issues
  }
}
