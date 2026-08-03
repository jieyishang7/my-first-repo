const {initializeApp} = require("firebase-admin/app");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");

initializeApp();

const db = getFirestore();
const openAiApiKey = defineSecret("OPENAI_API_KEY");
const MAX_MESSAGE_LENGTH = 2000;
const MAX_REQUESTS_PER_MINUTE = 6;

const STUDIO_CRITIC_PROMPT = `You are Studio Critic, a thoughtful design-review partner for
architecture and computational-design students. Help users clarify intent, connect design
decisions to context, and identify one useful next iteration. Ask at most one focused question
when essential. Give specific, constructive feedback without pretending to have seen drawings
or site conditions that were not provided. Separate observations from suggestions. Use plain
language and concise paragraphs. Never claim to replace an instructor, licensed architect, or
engineer.`;

exports.chat = onCall(
    {
      secrets: [openAiApiKey],
      timeoutSeconds: 60,
      memory: "256MiB",
      cors: true,
      invoker: "public",
    },
    async (request) => {
      if (!request.auth) {
        throw new HttpsError("unauthenticated", "Sign in before sending a message.");
      }

      const message = typeof request.data?.message === "string" ?
        request.data.message.trim() : "";

      if (!message || message.length > MAX_MESSAGE_LENGTH) {
        throw new HttpsError(
            "invalid-argument",
            `Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters.`,
        );
      }

      const userId = request.auth.uid;
      await enforceRateLimit(userId);

      const messages = db.collection("users").doc(userId).collection("messages");
      const userMessage = await messages.add({
        role: "user",
        text: message,
        createdAt: FieldValue.serverTimestamp(),
      });

      try {
        const response = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openAiApiKey.value()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-5.6-terra",
            instructions: STUDIO_CRITIC_PROMPT,
            input: message,
            reasoning: {effort: "low"},
            text: {verbosity: "low"},
            max_output_tokens: 500,
            safety_identifier: userId,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          console.error("OpenAI request failed", response.status, data?.error?.code);
          throw new Error("OpenAI request failed");
        }

        const answer = extractOutputText(data);
        if (!answer) throw new Error("OpenAI returned no text");

        await messages.add({
          role: "assistant",
          text: answer,
          createdAt: FieldValue.serverTimestamp(),
          responseId: data.id,
          replyTo: userMessage.id,
        });

        return {answer};
      } catch (error) {
        console.error("Chat request failed", error);
        await userMessage.update({status: "failed"});
        throw new HttpsError("internal", "The critic is unavailable. Please try again.");
      }
    },
);

exports.clearChat = onCall({invoker: "public"}, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Sign in before clearing a conversation.");
  }

  const messages = await db.collection("users").doc(request.auth.uid)
      .collection("messages").limit(100).get();
  const batch = db.batch();
  messages.docs.forEach((message) => batch.delete(message.ref));
  await batch.commit();
  return {deleted: messages.size};
});

function extractOutputText(response) {
  return (response.output || [])
      .filter((item) => item.type === "message")
      .flatMap((item) => item.content || [])
      .filter((part) => part.type === "output_text")
      .map((part) => part.text)
      .join("\n")
      .trim();
}

async function enforceRateLimit(userId) {
  const limitRef = db.doc(`users/${userId}/limits/chat`);
  const now = Date.now();
  const windowMs = 60 * 1000;

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(limitRef);
    const current = snapshot.data() || {};
    const windowStartedAt = current.windowStartedAt?.toMillis?.() || 0;
    const isNewWindow = now - windowStartedAt >= windowMs;
    const count = isNewWindow ? 0 : (current.count || 0);

    if (count >= MAX_REQUESTS_PER_MINUTE) {
      throw new HttpsError("resource-exhausted", "Please wait a minute before trying again.");
    }

    transaction.set(limitRef, {
      count: count + 1,
      windowStartedAt: isNewWindow ? FieldValue.serverTimestamp() :
        current.windowStartedAt,
    });
  });
}
