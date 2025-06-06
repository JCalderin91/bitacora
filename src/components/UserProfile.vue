<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const user = ref(null)
const loading = ref(true)

const getUserProfile = async () => {
  try {
    loading.value = true
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (currentUser) {
      user.value = {
        email: currentUser.email,
        name: currentUser.user_metadata?.name || currentUser.email.split('@')[0],
        avatar_url: currentUser.user_metadata?.avatar_url || null
      }
    }
  } catch (error) {
    console.error('Error al obtener el perfil:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getUserProfile()
})
</script>

<template>
  <div v-if="user" class="flex items-center gap-3">
    <div class="relative">
      <img
        v-if="user.avatar_url"
        :src="user.avatar_url"
        :alt="user.name"
        class="h-8 w-8 rounded-full object-cover"
      />
      <div
        v-else
        class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900"
      >
        <span class="text-sm font-medium text-indigo-600 dark:text-indigo-300">
          {{ user.name.charAt(0).toUpperCase() }}
        </span>
      </div>
    </div>
    <div class="hidden sm:block">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
        {{ user.name }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        {{ user.email }}
      </p>
    </div>
  </div>
</template>