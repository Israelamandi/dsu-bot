const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.message(async ({ message, say }) => {
  if (message.subtype) return;

  await say(
    `You said: ${message.text}`
  );
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡ DSU Bot running");
})();
