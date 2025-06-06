<script setup>
import { computed } from 'vue'
import EventItem from '../molecules/EventItem.vue'
import BaseButton from '../atoms/BaseButton.vue'
import { EVENT_FILTERS } from '../../types/event'

const props = defineProps({
  events: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  selectedFilter: {
    type: String,
    default: EVENT_FILTERS.TODAY
  }
})

const emit = defineEmits(['filter', 'edit', 'delete', 'report'])

const hasEvents = computed(() => props.events.length > 0)
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
      <div class="flex items-center gap-4">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Eventos registrados
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
      <div class="w-full sm:w-auto inline-flex rounded-lg shadow-sm">
        <BaseButton
          :variant="selectedFilter === EVENT_FILTERS.TODAY ? 'primary' : 'secondary'"
          class="flex-1 sm:flex-none rounded-r-none"
          @click="$emit('filter', EVENT_FILTERS.TODAY)"
        >
          Hoy
        </BaseButton>
        <BaseButton
          :variant="selectedFilter === EVENT_FILTERS.YESTERDAY ? 'primary' : 'secondary'"
          class="flex-1 sm:flex-none rounded-l-none border-l border-gray-200 dark:border-gray-600"
          @click="$emit('filter', EVENT_FILTERS.YESTERDAY)"
        >
          Ayer
        </BaseButton>
      </div>
    </div>

    <div v-if="loading" class="text-center py-4 text-gray-700 dark:text-gray-300">
      Cargando eventos...
    </div>

    <div
      v-else-if="!hasEvents"
      class="text-center py-4 text-gray-500 dark:text-gray-400"
    >
      No hay eventos registrados para {{ selectedFilter === EVENT_FILTERS.TODAY ? 'hoy' : 'ayer' }}
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