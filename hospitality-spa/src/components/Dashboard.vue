<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    
    <!-- AI Recommendation Section -->
    <div class="ai-section">
      <h2>🤖 AI Assistant</h2>
      <div class="ai-card">
        <textarea 
          v-model="userInput" 
          placeholder="Ask me anything about your guests, units, or bookings..."
          rows="3"
          class="ai-input"
        ></textarea>
        <button 
          @click="getAIRecommendation" 
          :disabled="loading || !userInput.trim()"
          class="ai-button"
        >
          {{ loading ? 'Thinking...' : 'Get AI Recommendation' }}
        </button>
        
        <div v-if="aiResponse" class="ai-response">
          <h3>AI Response:</h3>
          <p>{{ aiResponse }}</p>
        </div>
        
        <div v-if="error" class="ai-error">
          <strong>Error:</strong> {{ error }}
        </div>
        
        <div v-if="!isAIConfigured" class="ai-warning">
          ⚠️ AI service not configured. Add VITE_ANTHROPIC_API_KEY to .env.local
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Units</h3>
        <p class="stat-number">{{ stats.totalUnits }}</p>
      </div>
      <div class="stat-card">
        <h3>Active Bookings</h3>
        <p class="stat-number">{{ stats.activeBookings }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Contacts</h3>
        <p class="stat-number">{{ stats.totalContacts }}</p>
      </div>
      <div class="stat-card">
        <h3>Revenue (Month)</h3>
        <p class="stat-number">${{ stats.monthlyRevenue }}</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="action-buttons">
        <router-link to="/units" class="action-btn">➕ Add Unit</router-link>
        <router-link to="/contacts" class="action-btn">👤 New Contact</router-link>
        <router-link to="/calendar" class="action-btn">📅 View Calendar</router-link>
        <router-link to="/aiagent" class="action-btn">🤖 Configure AI</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Storage from '../services/storage.js'
import { getRecommendation, isConfigured } from '../services/aiService.js'

// Reactive state
const userInput = ref('')
const aiResponse = ref('')
const loading = ref(false)
const error = ref('')
const isAIConfigured = ref(false)

// Stats from storage
const stats = ref({
  totalUnits: 0,
  activeBookings: 0,
  totalContacts: 0,
  monthlyRevenue: 0
})

// Load data on mount
onMounted(() => {
  loadStats()
  isAIConfigured.value = isConfigured()
})

function loadStats() {
  // Load units
  const units = Storage.getJSON('units', [])
  stats.value.totalUnits = units.length

  // Load contacts
  const contacts = Storage.getJSON('clients', [])
  stats.value.totalContacts = contacts.length

  // Calculate mock stats (you can enhance this with real data)
  stats.value.activeBookings = Math.floor(Math.random() * 50) + 10
  stats.value.monthlyRevenue = Math.floor(Math.random() * 50000) + 10000
}

async function getAIRecommendation() {
  if (!userInput.value.trim()) return

  loading.value = true
  error.value = ''
  aiResponse.value = ''

  try {
    // Get units and business info for context
    const units = Storage.getJSON('units', [])
    const businessInfo = Storage.getJSON('businessInfo', {})

    const response = await getRecommendation(userInput.value, {
      units: units.slice(0, 5), // Send first 5 units for context
      businessInfo
    })

    aiResponse.value = response
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #2c3e50;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #34495e;
}

/* AI Section */
.ai-section {
  margin-bottom: 3rem;
}

.ai-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.ai-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 1rem;
}

.ai-input:focus {
  outline: none;
  border-color: #3498db;
}

.ai-button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.ai-button:hover:not(:disabled) {
  background: #2980b9;
}

.ai-button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.ai-response {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f0f9ff;
  border-left: 4px solid #3498db;
  border-radius: 4px;
}

.ai-response h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.ai-response p {
  margin: 0;
  line-height: 1.6;
  color: #34495e;
  white-space: pre-wrap;
}

.ai-error {
  margin-top: 1rem;
  padding: 1rem;
  background: #fee;
  border-left: 4px solid #e74c3c;
  border-radius: 4px;
  color: #c0392b;
}

.ai-warning {
  margin-top: 1rem;
  padding: 1rem;
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 4px;
  color: #856404;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #7f8c8d;
  text-transform: uppercase;
  font-weight: 600;
}

.stat-number {
  margin: 0;
  font-size: 2rem;
  color: #2c3e50;
  font-weight: bold;
}

/* Quick Actions */
.quick-actions {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.3s;
  font-weight: 500;
}

.action-btn:hover {
  background: #2980b9;
}
</style>
