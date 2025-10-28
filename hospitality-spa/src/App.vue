<template>
  <div id="app">
    <!-- Navigation Header -->
    <nav class="main-nav">
      <div class="nav-container">
        <h1 class="nav-logo">🏨 Hospitality Dashboard</h1>
        <div class="nav-links">
          <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          <router-link to="/units" class="nav-link">Units</router-link>
          <router-link to="/contacts" class="nav-link">Contacts</router-link>
          <router-link to="/aiagent" class="nav-link">AI Agent</router-link>
          <router-link to="/website" class="nav-link">Website</router-link>
          <router-link to="/business-info" class="nav-link">Business Info</router-link>
          <router-link to="/calendar" class="nav-link">Calendar</router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
// App-level logic can go here
</script>

<style>
/* Basic navigation styles */
.main-nav {
  background: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  color: white;
  background: rgba(255, 255, 255, 0.15);
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Page transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
