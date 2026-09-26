export async function sendOrderNotification(order: OrderNotificationData): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = process.env.TELEGRAM_CHAT_ID?.split(",") || [];

  if (!token || chatIds.length === 0) return true; // not configured — not an error

  const orderNum = order.id.slice(-8).toUpperCase();
  const siteUrl = "https://www.aleppokhan.com";

  const subtotal = order.total - order.deliveryFee;

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
    `🧾 *المجموع الفرعي:* ${formatIQD(subtotal)}`,
    order.deliveryFee > 0
      ? `🚚 *رسوم التوصيل:* ${formatIQD(order.deliveryFee)}`
      : `🚚 *التوصيل:* مجاني`,
    `💰 *الإجمالي الكلي:* ${formatIQD(order.total)}`,
    ``,
    `🔗 [فتح الطلب في لوحة التحكم](${siteUrl}/admin/orders/${order.id})`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  try {
    for (const chatId of chatIds) {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId.trim(), text, parse_mode: "Markdown" }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("[Telegram] sendMessage failed:", res.status, JSON.stringify(err));
      }
    }
    return true;
  } catch (e) {
    console.error("[Telegram] fetch error:", e);
    return false;
  }
}
