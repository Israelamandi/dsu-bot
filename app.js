const { App } = require("@slack/bolt");

const registeredUsers = new Set();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const questions = [
  "What did you accomplish yesterday?",
  "What are your priorities today?",
  "Any blockers?",
  "Do you need support from any team member today?",
  "Which pending actions need attention today?"
];

const userSessions = {};

app.message(async ({ message, say }) => {
  if (message.subtype) return;

  const userId = message.user;
  const text = message.text.trim();

  // WHOAMI COMMAND
  if (text.toLowerCase() === "whoami") {
    await say(`Your Slack User ID is: ${userId}`);
    return;
  }

  // Start DSU
  if (text.toLowerCase() === "start") {
    userSessions[userId] = {
      currentQuestion: 0,
      answers: []
    };

    registeredUsers.add(userId);
    
    await say(
      `Question 1/${questions.length}\n\n${questions[0]}`
    );
    return;
  }

  const session = userSessions[userId];

  if (!session) {
    await say(
      "Send *start* to begin your DSU."
    );
    return;
  }

  session.answers.push(text);
  session.currentQuestion++;

  if (session.currentQuestion >= questions.length) {
    let summary = "*DSU Submitted* 🚀\n\n";

    questions.forEach((q, i) => {
      summary += `*${q}*\n${session.answers[i]}\n\n`;
    });

    await say(summary);

    delete userSessions[userId];
    return;
  }

  await say(
    `Question ${session.currentQuestion + 1}/${questions.length}\n\n${questions[session.currentQuestion]}`
  );
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("DSU Bot running");
})();
