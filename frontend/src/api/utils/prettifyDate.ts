export default function prettifyDate(dataText: string) {
  const date = dataText.split('T')[0]
  return date.split('-').join('/')
}
