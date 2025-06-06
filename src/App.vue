<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'
import Login from './components/Login.vue'
import EventLog from './components/EventLog.vue'
import LogoutButton from './components/LogoutButton.vue'
import ThemeToggle from './components/ThemeToggle.vue'

const session = ref(null)

onMounted(() => {
  supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
    session.value = currentSession
  })

  supabase.auth.onAuthStateChange((_event, currentSession) => {
    session.value = currentSession
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Bitácora de Eventos
          </h1>
          <div class="flex items-center gap-3">
            <ThemeToggle />
            <LogoutButton v-if="session" />
          </div>
        </div>
      </div>
    </header>
    <main class="transition-colors duration-200">
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <Login v-if="!session" />
        <EventLog v-else />
      </div>
    </main>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
