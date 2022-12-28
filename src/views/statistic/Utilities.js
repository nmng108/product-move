const MONTH = 'Month'
const QUARTER = 'Quarter'
const YEAR = 'Year'
const CURRENT_DATE = new Date()
const CURRENT_MONTH = CURRENT_DATE.getMonth()
const CURRENT_QUARTER = parseInt(CURRENT_MONTH / 3)
const CURRENT_YEAR = CURRENT_DATE.getFullYear()

const monthsOfYear = [
  'All',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const quartersOfYear = ['All', 'First', 'Second', 'Third', 'Fourth']

var random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

export {
  MONTH,
  QUARTER,
  YEAR,
  CURRENT_DATE,
  CURRENT_MONTH,
  CURRENT_QUARTER,
  CURRENT_YEAR,
  monthsOfYear,
  quartersOfYear,
  random,
}
