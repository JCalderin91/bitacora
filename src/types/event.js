/**
 * @typedef {Object} Event
 * @property {string} id - ID único del evento
 * @property {string} content - Contenido del evento
 * @property {string} created_at - Fecha de creación
 * @property {string} user_id - ID del usuario que creó el evento
 */

/**
 * @typedef {Object} EventFilter
 * @property {string} timeRange - Rango de tiempo ('today' | 'yesterday')
 * @property {string} searchTerm - Término de búsqueda
 */

export const EVENT_FILTERS = {
  TODAY: 'today',
  YESTERDAY: 'yesterday'
}

export const EVENT_ERRORS = {
  FETCH: 'Error al obtener los eventos',
  CREATE: 'Error al crear el evento',
  UPDATE: 'Error al actualizar el evento',
  DELETE: 'Error al eliminar el evento'
}