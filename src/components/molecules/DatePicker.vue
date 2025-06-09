<script setup>
import { ref, computed } from 'vue'
import { formatDateOnly } from '../../utils/dateFormatters'

const props = defineProps({
  selectedDate: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:selectedDate'])

const currentDate = new Date()
const currentMonth = ref(new Date())

const daysInMonth = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  return new Date(year, month + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  return new Date(year, month, 1).getDay()
})

const monthDays = computed(() => {
  const days = []
  const totalDays = daysInMonth.value
  const firstDay = firstDayOfMonth.value

  // Añadir días vacíos al principio
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Añadir días del mes
  for (let i = 1; i <= totalDays; i++) {
    days.push(i)
  }

  return days
})

const monthName = computed(() => {
  return new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(currentMonth.value)
})

const previousMonth = () => {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() - 1
  )
}

const nextMonth = () => {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1
  )
}

const selectDate = (day) => {
  if (!day) return
  const date = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth(),
    day
  )
  emit('update:selectedDate', date.toISOString().split('T')[0])
}

const isSelected = (day) => {
  if (!day) return false
  const date = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth(),
    day
  ).toISOString().split('T')[0]
  return date === props.selectedDate
}

const isToday = (day) => {
  if (!day) return false
  return (
    currentDate.getDate() === day &&
    currentDate.getMonth() === currentMonth.value.getMonth() &&
    currentDate.getFullYear() === currentMonth.value.getFullYear()
  )
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 p-2 sm:p-4">
    <!-- Cabecera del calendario -->
    <div class="flex justify-between items-center mb-2 sm:mb-4">
      <button
        @click="previousMonth"
        class="p-1 sm:p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        title="Mes anterior"
      >
        <svg class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
        </svg>
      </button>
      <h3 class="text-base sm:text-lg font-semibold capitalize text-gray-900 dark:text-white">
        {{ monthName }}
      </h3>
      <button
        @click="nextMonth"
        class="p-1 sm:p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        title="Mes siguiente"
      >
        <svg class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Días de la semana -->
    <div class="grid grid-cols-7 gap-0.5 sm:gap-1 text-center mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
      <div>Do</div>
      <div>Lu</div>
      <div>Ma</div>
      <div>Mi</div>
      <div>Ju</div>
      <div>Vi</div>
      <div>Sa</div>
    </div>

    <!-- Días del mes -->
    <div class="grid grid-cols-7 gap-0.5 sm:gap-1">
      <button
        v-for="(day, index) in monthDays"
        :key="index"
        @click="selectDate(day)"
        :class="[
          'p-1 sm:p-2 text-xs sm:text-sm rounded-full transition-colors relative',
          {
            'cursor-default': !day,
            'hover:bg-indigo-50 dark:hover:bg-indigo-500/20': day && !isSelected(day),
            'bg-indigo-600 dark:bg-indigo-500 text-white': isSelected(day),
            'text-indigo-600 dark:text-indigo-400 font-bold': isToday(day) && !isSelected(day),
            'text-gray-900 dark:text-gray-100': day && !isSelected(day) && !isToday(day),
            'text-gray-400 dark:text-gray-600': !day,
            'hover:text-gray-900 dark:hover:text-white': day && !isSelected(day),
            'aspect-square': true
          }
        ]"
        :disabled="!day"
      >
        <span :class="{ 'relative z-10': isToday(day) }">
          {{ day || '' }}
        </span>
        <!-- Indicador de hoy -->
        <div
          v-if="isToday(day)"
          class="absolute inset-0 border border-indigo-600 dark:border-indigo-400 rounded-full sm:border-2"
        ></div>
      </button>
    </div>
  </div>
</template>