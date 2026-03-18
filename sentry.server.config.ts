import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://45577b43c7bd191999ccf6f35d1f93a4@o4511066943455232.ingest.us.sentry.io/4511066967769088",
  // Tracing must be enabled for agent monitoring to work
  tracesSampleRate: 1.0,
  // Add data like inputs and responses to/from LLMs and tools;
  // see https://docs.sentry.io/platforms/javascript/data-management/data-collected/ for more info
  sendDefaultPii: true,
});
