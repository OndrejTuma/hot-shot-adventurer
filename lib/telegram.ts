/**
 * Telegram Bot integration for sending notifications
 */

interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}

/**
 * Send a message via Telegram Bot API
 * @param message - The message text to send
 * @returns Promise<boolean> - true if message was sent successfully
 */
export async function sendTelegramNotification(message: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // If credentials are not configured, silently skip (don't fail)
  if (!botToken || !chatId) {
    console.log('[Telegram] Bot token or chat ID not configured, skipping notification');
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const payload: TelegramMessage = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Telegram] Failed to send message:', response.status, errorData);
      return false;
    }

    console.log('[Telegram] Notification sent successfully');
    return true;
  } catch (error) {
    console.error('[Telegram] Error sending notification:', error);
    return false;
  }
}

/**
 * Format a route visit notification message
 */
export function formatRouteVisitNotification(
  routeName: string,
  routeId: string,
  points: number,
  totalPoints: number,
  visitedRoutes: number,
  totalRoutes: number
): string {
  const progress = Math.round((visitedRoutes / totalRoutes) * 100);
  
  return `🏺 <b>Treasure Route Visited!</b>

📍 <b>Location:</b> ${routeName}
🆔 <b>Route ID:</b> <code>${routeId}</code>
🪙 <b>Points Earned:</b> ${points.toLocaleString()}

📊 <b>Progress:</b>
   • Routes: ${visitedRoutes}/${totalRoutes} (${progress}%)
   • Total Points: ${totalPoints.toLocaleString()}

⏰ <b>Time:</b> ${new Date().toLocaleString()}`;
}

