<script setup>
import { ref, onMounted, computed } from 'vue'
import { EventService } from '../services/eventService'
import { formatDateOnly, formatTimeOnly, getDateRange } from '../utils/dateFormatters'
import { EVENT_FILTERS, EVENT_ERRORS } from '../types/event'
import EventForm from './molecules/EventForm.vue'
import EventList from './organisms/EventList.vue'
import ConfirmModal from './ConfirmModal.vue'
import ReportModal from './ReportModal.vue'

const eventService = new EventService()

const events = ref([])
const loading = ref(false)
const error = ref(null)
const selectedFilter = ref(EVENT_FILTERS.TODAY)

// Estado para el modal de confirmación
const showDeleteModal = ref(false)
const eventToDelete = ref(null)

// Estado para el modal de reporte
const showReportModal = ref(false)

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
    error.value = null
    const user = await eventService.getCurrentUser()
    events.value = await eventService.fetchEvents(user.id)
  } catch (err) {
    error.value = EVENT_ERRORS.FETCH
    console.error('Error al obtener los eventos:', err)
  } finally {
    loading.value = false
  }
}

const handleCreateEvent = async (eventData) => {
  try {
    loading.value = true
    const user = await eventService.getCurrentUser()
    await eventService.createEvent({
      content: eventData.content,
      created_at: eventData.date,
      user_id: user.id
    })
    await fetchEvents()
  } catch (err) {
    error.value = EVENT_ERRORS.CREATE
    console.error('Error al crear el evento:', err)
  } finally {
    loading.value = false
  }
}

const handleEditEvent = async (eventData) => {
  try {
    loading.value = true
    const user = await eventService.getCurrentUser()
    await eventService.updateEvent({
      id: eventData.id,
      content: eventData.content,
      user_id: user.id
    })
    await fetchEvents()
  } catch (err) {
    error.value = EVENT_ERRORS.UPDATE
    console.error('Error al actualizar el evento:', err)
  } finally {
    loading.value = false
  }
}

const confirmDelete = (event) => {
  eventToDelete.value = event
  showDeleteModal.value = true
}

const handleDeleteEvent = async () => {
  if (!eventToDelete.value) return

  try {
    loading.value = true
    const user = await eventService.getCurrentUser()
    await eventService.deleteEvent({
      id: eventToDelete.value.id,
      user_id: user.id
    })
    await fetchEvents()
  } catch (err) {
    error.value = EVENT_ERRORS.DELETE
    console.error('Error al eliminar el evento:', err)
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

  const eventsText = filteredEvents.value
    .map(event => `• ${event.content}\n  ${formatTimeOnly(event.created_at)}`)
    .join('\n\n')

  return `📝 Bitácora de eventos - ${reportDate}\n\n${eventsText}`
}

onMounted(fetchEvents)
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <div class="mb-6 sm:mb-8">
      <h2 class="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Añadir nuevo evento
      </h2>
      <EventForm
        :loading="loading"
        @submit="handleCreateEvent"
      />
    </div>

    <div v-if="error" class="text-red-600 dark:text-red-400 mb-4">
      {{ error }}
    </div>

    <EventList
      :events="filteredEvents"
      :loading="loading"
      :selected-filter="selectedFilter"
      @filter="selectedFilter = $event"
      @edit="handleEditEvent"
      @delete="confirmDelete"
      @report="showReportModal = true"
    />

    <ConfirmModal
      :is-open="showDeleteModal"
      title="Eliminar evento"
      message="¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer."
      @confirm="handleDeleteEvent"
      @cancel="cancelDelete"
    />

    <ReportModal
      :is-open="showReportModal"
      :content="generateReport()"
      @close="showReportModal = false"
    />
  </div>
</template>