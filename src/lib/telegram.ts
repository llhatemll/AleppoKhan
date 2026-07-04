import { formatIQD } from "./constants";

interface OrderNotificationData {
  id: string;
  fullName: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string | null;
  total: number;
  itemCount: number;
}

export async function sendOrderNotification(order: OrderNotificationData) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return; // silently skip if not configured

  const orderNum = order.id.slice(-8).toUpperCase();
  const text = [
    `🛒 *طلب جديد #${orderNum}*`,
    ``,
    `👤 *الاسم:* ${order.fullName}`,
    `📞 *الهاتف:* ${order.phone}`,
    `📍 *المحافظة:* ${order.governorate}`,
    `🏠 *العنوان:* ${order.address}`,
    order.notes ? `📝 *ملاحظات:* ${order.notes}` : null,
    ``,
    `📦 *عدد المنتجات:* ${order.itemCount}`,
    `💰 *الإجمالي:* ${formatIQD(order.total)}`,
    ``,
    `🔗 رابط الطلب: /admin/orders/${order.id}`,
  ]
    .filter(Boolean)
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
