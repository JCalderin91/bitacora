<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { supabase } from '../supabase'
import ConfirmModal from './ConfirmModal.vue'
import ReportModal from './ReportModal.vue'

const events = ref([])
const newEvent = ref('')
const loading = ref(false)
const error = ref(null)
const selectedFilter = ref('today')
const showCustomDate = ref(false)
const customDate = ref('')
const customTime = ref('')
const editingEvent = ref(null)
const editedContent = ref('')

// Estado para el modal de confirmación
const showDeleteModal = ref(false)
const eventToDelete = ref(null)

// Estado para el modal de reporte
const showReportModal = ref(false)

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

const formatTimeOnly = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

const formatDateOnly = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

// Obtener la fecha actual en formato YYYY-MM-DD para el valor por defecto
const getCurrentDate = () => {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

// Obtener la hora actual en formato HH:MM para el valor por defecto
const getCurrentTime = () => {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

// Inicializar valores por defecto
onMounted(() => {
  customDate.value = getCurrentDate()
  customTime.value = getCurrentTime()
})

const getDateRange = (filter) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (filter === 'today') {
    return {
      start: today.toISOString(),
      end: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
    }
  } else {
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    return {
      start: yesterday.toISOString(),
      end: today.toISOString()
    }
  }
}

const filteredEvents = computed(() => {
  const { start, end } = getDateRange(selectedFilter.value)
  return events.value.filter(event => {
    const eventDate = new Date(event.created_at)
    return eventDate >= new Date(start) && eventDate < new Date(end)
  })
})

const fetchEvents = async () => {
  try {
    loading.value = true
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (fetchError) throw fetchError
    events.value = data
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const addEvent = async () => {
  if (!newEvent.value.trim()) return

  try {
    loading.value = true
    const { data: { user } } = await supabase.auth.getUser()

    let eventDate
    if (showCustomDate.value && customDate.value && customTime.value) {
      eventDate = new Date(`${customDate.value}T${customTime.value}`)
    } else {
      eventDate = new Date()
    }

    const { error: insertError } = await supabase
      .from('events')
      .insert([
        {
          content: newEvent.value,
          created_at: eventDate.toISOString(),
          user_id: user.id
        }
      ])

    if (insertError) throw insertError
    newEvent.value = ''
    await fetchEvents()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const confirmDelete = (event) => {
  eventToDelete.value = event
  showDeleteModal.value = true
}

const deleteEvent = async () => {
  if (!eventToDelete.value) return

  try {
    loading.value = true
    const { data: { user } } = await supabase.auth.getUser()

    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventToDelete.value.id)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error al eliminar:', deleteError)
      throw new Error('No se pudo eliminar el evento. Por favor, intenta de nuevo.')
    }

    events.value = events.value.filter(e => e.id !== eventToDelete.value.id)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
    showDeleteModal.value = false
    eventToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  eventToDelete.value = null
}

const generateReport = () => {
  const { start } = getDateRange(selectedFilter.value)
  const reportDate = formatDateOnly(start)

  const events = filteredEvents.value
    .map(event => `• ${event.content}\n  ${formatTimeOnly(event.created_at)}`)
    .join('\n\n')

  const reportContent = `📝 Bitácora de eventos - ${reportDate}\n\n${events}`
  return reportContent
}

const startEditing = async (event) => {
  editingEvent.value = event
  editedContent.value = event.content
  // Esperar a que el DOM se actualice antes de enfocar
  await nextTick()
  const input = document.querySelector(`#edit-input-${event.id}`)
  if (input) input.focus()
}

const cancelEditing = () => {
  editingEvent.value = null
  editedContent.value = ''
}

const saveEdit = async () => {
  if (!editingEvent.value || !editedContent.value.trim()) return

  try {
    loading.value = true
    const { data: { user } } = await supabase.auth.getUser()

    const { error: updateError } = await supabase
      .from('events')
      .update({ content: editedContent.value.trim() })
      .eq('id', editingEvent.value.id)
      .eq('user_id', user.id)

    if (updateError) throw updateError

    // Actualizar el evento en la lista local
    const index = events.value.findIndex(e => e.id === editingEvent.value.id)
    if (index !== -1) {
      events.value[index] = {
        ...events.value[index],
        content: editedContent.value.trim()
      }
    }

    editingEvent.value = null
    editedContent.value = ''
  } catch (e) {
    error.value = e.message
    console.error('Error al actualizar:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchEvents()
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <div class="mb-6 sm:mb-8">
      <h2 class="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">Añadir nuevo evento</h2>
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            v-model="newEvent"
            type="text"
            placeholder="¿Qué sucedió?"
            class="flex-1 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:placeholder-gray-400 text-sm sm:text-base"
            @keyup.enter="addEvent"
          />
          <button
            @click="addEvent"
            :disabled="loading || !newEvent.trim()"
            class="w-full sm:w-auto rounded-md bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-500 dark:hover:bg-indigo-400 disabled:opacity-50 text-sm sm:text-base font-semibold"
          >
            {{ loading ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="showCustomDate = !showCustomDate"
            class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1"
          >
            <svg
              class="h-4 w-4"
              :class="{ 'rotate-90': showCustomDate }"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
            Personalizar fecha y hora
          </button>
        </div>

        <div v-if="showCustomDate" class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <label for="custom-date" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Fecha
            </label>
            <input
              id="custom-date"
              v-model="customDate"
              type="date"
              class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm sm:text-base"
            />
          </div>
          <div class="flex-1">
            <label for="custom-time" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Hora
            </label>
            <input
              id="custom-time"
              v-model="customTime"
              type="time"
              class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm sm:text-base"
            />
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <div class="flex items-center gap-4">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Eventos registrados</h2>
          <button
            v-if="filteredEvents.length > 0"
            @click="showReportModal = true"
            class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
            title="Generar reporte de eventos"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clip-rule="evenodd" />
            </svg>
            Generar reporte
          </button>
        </div>
        <div class="w-full sm:w-auto inline-flex rounded-lg shadow-sm">
          <button
            @click="selectedFilter = 'today'"
            :class="[
              'flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-l-lg',
              selectedFilter === 'today'
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
            ]"
          >
            Hoy
          </button>
          <button
            @click="selectedFilter = 'yesterday'"
            :class="[
              'flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-r-lg border-l border-gray-200 dark:border-gray-600',
              selectedFilter === 'yesterday'
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
            ]"
          >
            Ayer
          </button>
        </div>
      </div>

      <div v-if="error" class="text-red-600 dark:text-red-400 mb-4">{{ error }}</div>

      <div v-if="loading" class="text-center py-4 text-gray-700 dark:text-gray-300">Cargando eventos...</div>

      <div v-else-if="filteredEvents.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
        No hay eventos registrados para {{ selectedFilter === 'today' ? 'hoy' : 'ayer' }}
      </div>

      <div v-else class="space-y-3 sm:space-y-4">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="group bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow dark:shadow-gray-700/20"
        >
          <div v-if="editingEvent?.id === event.id" class="flex flex-col gap-3">
            <input
              :id="`edit-input-${event.id}`"
              v-model="editedContent"
              type="text"
              class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm"
              placeholder="¿Qué sucedió?"
              @keyup.enter="saveEdit"
              @keyup.esc="cancelEditing"
            />
            <div class="flex justify-end gap-2">
              <button
                @click="cancelEditing"
                class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
              >
                Cancelar
              </button>
              <button
                @click="saveEdit"
                :disabled="loading || !editedContent.trim()"
                class="inline-flex items-center px-3 py-1.5 rounded-md bg-indigo-600 dark:bg-indigo-500 text-sm font-medium text-white hover:bg-indigo-500 dark:hover:bg-indigo-400 disabled:opacity-50"
              >
                {{ loading ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </div>
          <div v-else>
            <div class="flex justify-between items-start gap-4">
              <p class="text-gray-900 dark:text-white text-sm sm:text-base">{{ event.content }}</p>
              <div class="flex items-center gap-2">
                <button
                  @click="startEditing(event)"
                  class="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-gray-400 hover:text-indigo-500 dark:text-gray-500 dark:hover:text-indigo-400"
                  title="Editar evento"
                >
                  <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(event)"
                  class="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                  title="Eliminar evento"
                >
                  <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {{ formatDate(event.created_at) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <ConfirmModal
      :is-open="showDeleteModal"
      title="Eliminar evento"
      message="¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer."
      @confirm="deleteEvent"
      @cancel="cancelDelete"
    />

    <ReportModal
      :is-open="showReportModal"
      :content="generateReport()"
      @close="showReportModal = false"
    />
  </div>
</template>