import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "ai-finance-pro",
  name: "AI Finance Pro",
  retryFunction: async (attempt) => ({
    delay: Math.pow(2, attempt) * 1000,
    maxAttempts: 2,
  }),
});