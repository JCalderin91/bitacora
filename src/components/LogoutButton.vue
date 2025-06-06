<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const loading = ref(false)
const error = ref(null)

const handleLogout = async () => {
  try {
    loading.value = true

    // Obtener la sesión actual
    const { data: { session } } = await supabase.auth.getSession()

    // Si hay una sesión y es de Google, revocar el acceso
    if (session?.provider_token) {
      try {
        const response = await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${session.provider_token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })

        if (!response.ok) {
          throw new Error(`Error al revocar el token: ${response.status} ${response.statusText}`)
        }
      } catch (revokeError) {
        console.error('Error al revocar el token de Google:', revokeError)
      }
    }

    // Cerrar sesión en Supabase
    const { error: logoutError } = await supabase.auth.signOut()
    if (logoutError) throw logoutError

  } catch (e) {
    error.value = e.message
    console.error('Error al cerrar sesión:', e)
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
    :title="loading ? 'Cerrando sesión...' : 'Cerrar sesión'"
  >
    <svg
      v-if="loading"
      class="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <svg
      v-else
      class="h-5 w-5 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
    <span class="hidden sm:ml-2 sm:inline">{{ loading ? 'Cerrando sesión...' : 'Cerrar sesión' }}</span>
  </button>
  <div v-if="error" class="text-red-600 text-sm mt-2">{{ error }}</div>
</template>