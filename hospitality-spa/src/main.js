import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

// Import components
import Dashboard from './components/Dashboard.vue'
import Units from './components/Units.vue'
import Contacts from './components/Contacts.vue'
import AIAgent from './components/AIAgent.vue'
import Website from './components/Website.vue'
import BusinessInfo from './components/BusinessInfo.vue'
import Calendar from './components/Calendar.vue'

// Create router
const router = createRouter({
  history: createWebHistory('/hospitality-dashboard/'),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: Dashboard, meta: { title: 'Dashboard' } },
    { path: '/units', component: Units, meta: { title: 'Units' } },
    { path: '/contacts', component: Contacts, meta: { title: 'Contacts' } },
    { path: '/aiagent', component: AIAgent, meta: { title: 'AI Agent' } },
    { path: '/website', component: Website, meta: { title: 'Website' } },
    { path: '/business-info', component: BusinessInfo, meta: { title: 'Business Info' } },
    { path: '/calendar', component: Calendar, meta: { title: 'Calendar' } }
  ]
})

// Update page title on route change
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Hospitality Dashboard` : 'Hospitality Dashboard'
  next()
})

const app = createApp(App)
app.use(router)
app.mount('#app')
