import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'
import routes from './router'
import pinia from './stores'
import * as Sentry from "@sentry/vue";
import '@/styles/global.scss'

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

const app = createApp(App);
app.use(router);
app.use(pinia);

Sentry.init({
  app,
  dsn: "https://2d5c8a401d0ac4b48d6110811aa8f543@o4509955359506432.ingest.us.sentry.io/4509955362586624",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration({ router }),
    Sentry.replayIntegration()
  ],
  // Tracing
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.,
  // Logs
  enableLogs: true
});

app.mount('#app');