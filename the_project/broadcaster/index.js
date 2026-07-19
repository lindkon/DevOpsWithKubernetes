const { connect } = require('nats');

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

const NATS_URL = requireEnv('NATS_URL');
const LOG_ONLY = requireEnv('LOG_ONLY') === 'true';
const BOT_TOKEN = requireEnv('TG_TOKEN');
const CHAT_ID = requireEnv('TG_CHAT_ID');


const sendToTelegram = async (text) => {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram API ${res.status}: ${body}`);
  }
};

const formatMessage = ({ action, todo }) => {
  if (action === 'created') return `todo ${todo.id} was created, body; ${todo.text}`;
  if (action === 'updated') return `todo ${todo.id} was updated, status; ${todo.isDone}`;
  return `Unknown todo event occurred`;
};

const run = async () => {
  const nc = await connect({ servers: NATS_URL });
  console.log(`Connected to NATS at ${NATS_URL}`);
  const sub = nc.subscribe('todos.events', { queue: 'broadcaster' });
  for await (const msg of sub) {
    try {
      const event = JSON.parse(msg.data);
      console.log(`Received event: ${JSON.stringify(event)}`);
      if (LOG_ONLY) continue;
      await sendToTelegram(formatMessage(event));
      console.log('Sent to Telegram');
    } catch (err) {
      console.log(`Failed to process message: ${err.message}`);
    }
  }
};

run().catch((err) => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});