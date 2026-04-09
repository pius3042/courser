import type { PredefinedEntry } from './types';

export const INITIAL_QUICK_REPLIES: string[] = [
  'View Menu & Prices',
  'Opening Hours',
  'Location',
  'Delivery Info',
  'Contact Us',
  'Place an Order',
];

export const DEFAULT_FOLLOW_UPS: string[] = [
  'View Menu & Prices',
  'Opening Hours',
  'Place an Order',
];

export const PREDEFINED_RESPONSES: PredefinedEntry[] = [
  {
    trigger: 'View Menu & Prices',
    response:
      "Here's our full menu with prices! 🥧🎂\n\n**Snacks & Pastries**\n- Meat Pie — ₦500\n- Chicken Pie — ₦700\n- Sausage Roll — ₦400\n- Chin Chin (pack) — ₦1,500\n- Doughnut (each) — ₦300\n\n**Birthday Cakes**\n- Small — ₦15,000\n- Medium — ₦25,000\n- Large — ₦40,000\n\nAnything catch your eye? 😊",
    followUps: ['Place an Order', 'Delivery Info', 'Opening Hours'],
  },
  {
    trigger: 'Opening Hours',
    response:
      "We're open **Monday to Saturday, 8:00 AM – 7:00 PM**. We are closed on Sundays. Feel free to visit or call us anytime during those hours! ☀️",
    followUps: ['Location', 'View Menu & Prices', 'Contact Us'],
  },
  {
    trigger: 'Location',
    response:
      '📍 Find us at **12 Broad Street, Lagos Island, Lagos**. We\'d love to have you visit! If you need directions, give us a call at **08012345678**.',
    followUps: ['Opening Hours', 'Delivery Info', 'Contact Us'],
  },
  {
    trigger: 'Delivery Info',
    response:
      '🚚 We deliver **within Lagos Island** for orders above **₦5,000**. A flat delivery fee of **₦1,000** applies. To arrange delivery, call us at **08012345678** during business hours (Mon–Sat, 8AM–7PM).',
    followUps: ['View Menu & Prices', 'Place an Order', 'Contact Us'],
  },
  {
    trigger: 'Contact Us',
    response:
      '📞 Give us a call at **08012345678**. We\'re available **Monday to Saturday, 8AM–7PM**. You can also visit us at **12 Broad Street, Lagos Island, Lagos**. We\'re always happy to help! 😊',
    followUps: ['Opening Hours', 'Location', 'Place an Order'],
  },
  {
    trigger: 'Place an Order',
    response:
      'To place an order, please call us at **08012345678** during business hours (Mon–Sat, 8AM–7PM). 🎉\n\nFor **birthday cakes**, we recommend ordering at least **2–3 days in advance** so we can make it perfect for you!',
    followUps: ['View Menu & Prices', 'Delivery Info', 'Contact Us'],
  },
];

export function findPredefinedResponse(message: string): PredefinedEntry | null {
  const normalized = message.trim().toLowerCase();
  return (
    PREDEFINED_RESPONSES.find(
      (entry) => entry.trigger.toLowerCase() === normalized
    ) ?? null
  );
}
