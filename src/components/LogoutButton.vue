<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const loading = ref(false)
const error = ref(null)

const handleLogout = async () => {
  try {
    loading.value = true
    const { error: logoutError } = await supabase.auth.signOut()
    if (logoutError) throw logoutError
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button
    @click="handleLogout"
    :disabled="loading"
    class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    {{ loading ? 'Cerrando sesión...' : 'Cerrar sesión' }}
  </button>
  <div v-if="error" class="text-red-600 text-sm mt-2">{{ error }}</div>
</template>