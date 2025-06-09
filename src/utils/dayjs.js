import dayjs from 'dayjs'
import 'dayjs/locale/es'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'

// Extender dayjs con plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)

// Establecer locale español
dayjs.locale('es')

export default dayjs