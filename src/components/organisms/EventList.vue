<script setup>
import { computed } from 'vue'
import EventItem from '../molecules/EventItem.vue'
import { formatDateOnly, getCurrentDate } from '../../utils/dateFormatters'

const props = defineProps({
  events: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  selectedDate: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'report'])

const hasEvents = computed(() => props.events.length > 0)

const title = computed(() => {
  return props.selectedDate === getCurrentDate()
    ? 'Eventos de hoy'
    : `Eventos del ${formatDateOnly(props.selectedDate)}`
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
        {{ title }}
      </h2>
      <button
        v-if="hasEvents"
        @click="$emit('report')"
        class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
        title="Generar reporte de eventos"
      >
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clip-rule="evenodd" />
        </svg>
        Generar reporte
      </button>
    </div>

    <div v-if="loading" class="text-center py-4 text-gray-700 dark:text-gray-300">
      Cargando eventos...
    </div>

    <div
      v-else-if="!hasEvents"
      class="text-center py-4 text-gray-500 dark:text-gray-400"
    >
      No hay eventos registrados para {{ props.selectedDate === getCurrentDate() ? 'hoy' : 'esta fecha' }}
    </div>

    <div v-else class="space-y-3 sm:space-y-4">
      <EventItem
        v-for="event in events"
        :key="event.id"
        :event="event"
        :loading="loading"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>