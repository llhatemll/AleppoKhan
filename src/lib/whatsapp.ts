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

export async function sendWhatsAppNotification(order: OrderNotificationData): Promise<boolean> {
  const phone = process.env.CALLMEBOT_PHONE;
  const apiKey = process.env.CALLMEBOT_APIKEY;

  if (!phone || !apiKey) return true; // not configured — not an error

  const orderNum = order.id.slice(-8).toUpperCase();
  const subtotal = order.total - order.deliveryFee;

  const lines = [
    `🛒 طلب جديد #${orderNum}`,
    ``,
    `👤 ${order.fullName}`,
    `📞 ${order.phone}`,
    `📍 ${order.governorate} — ${order.address}`,
    order.notes ? `📝 ${order.notes}` : null,
    ``,
    ...order.items.map((i) => `• ${i.title} ×${i.quantity} — ${formatIQD(i.price * i.quantity)}`),
    ``,
    `🧾 المجموع الفرعي: ${formatIQD(subtotal)}`,
    order.deliveryFee > 0 ? `🚚 التوصيل: ${formatIQD(order.deliveryFee)}` : `🚚 التوصيل: مجاني`,
    `💰 الإجمالي: ${formatIQD(order.total)}`,
  ].filter((l) => l !== null).join("\n");

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(lines)}&apikey=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error("[WhatsApp] sendMessage failed:", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (e) {
    console.error("[WhatsApp] fetch error:", e);
    return false;
  }
}
