// In-memory log of notification failures.
// Resets on cold start — acceptable for "just happened" error UX.
// Errors from the last ~hour are almost always still in memory on Vercel.

export type NotifError = {
  id: string;
  channel: "telegram" | "whatsapp";
  orderId: string;
  orderNum: string;
  at: number;
};

const MAX = 30;
const store: NotifError[] = [];

export function logNotifError(entry: Omit<NotifError, "id">) {
  store.unshift({ ...entry, id: Math.random().toString(36).slice(2, 10) });
  if (store.length > MAX) store.pop();
}

export function getNotifErrors(): NotifError[] {
  return store.slice();
}

export function dismissNotifError(id: string) {
  const i = store.findIndex((e) => e.id === id);
  if (i !== -1) store.splice(i, 1);
}
