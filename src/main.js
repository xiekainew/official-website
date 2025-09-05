import './public-path'
import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'
import routes from './router'
import * as Sentry from "@sentry/vue";

let router = null;
let instance = null;
function render(props = {}) {
  const { container } = props;
  router = createRouter({
    history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/app-vue/' : '/'),
    routes,
  });

  instance = createApp(App);
  instance.use(router);


Sentry.init({
  app: instance,
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


  instance.mount(container ? container.querySelector('#app') : '#app');
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('Vue MicroApp bootstraped');
}

export async function mount(props) {
  render(props);
}

export async function unmount() {
  instance.unmount();
  instance = null;
  router = null;
}