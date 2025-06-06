<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'
import Login from './components/Login.vue'
import EventLog from './components/EventLog.vue'
import LogoutButton from './components/LogoutButton.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import UserProfile from './components/UserProfile.vue'

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
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-1.5 sm:gap-3">
            <svg class="w-5 h-5 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            <h1 class="text-lg sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Bitácora de Eventos
            </h1>
          </div>
          <div class="flex items-center gap-4">
            <UserProfile v-if="session" />
            <ThemeToggle />
            <LogoutButton v-if="session" />
          </div>
        </div>
      </div>
    </header>
    <main class="flex-1 transition-colors duration-200">
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <Login v-if="!session" />
        <EventLog v-else />
      </div>
    </main>
    <footer class="py-2 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-center gap-2">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clip-rule="evenodd" />
        </svg>
        <span>Desarrollado con IA</span>
      </div>
    </footer>
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
