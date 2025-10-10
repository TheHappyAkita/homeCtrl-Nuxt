import { HomeCtrlUtils } from '../../utils/homeCtrl.utils'

// Hidden DNS names copied from original React UI's listElementFilterByDnsName
const HIDDEN_DNS_NAMES = new Set([
  'akitaCtrl',
  'audiobooks2',
  'buecher',
  'buecher2',
  'books2',
  'hoerbuecher',
  'hoerbuecher2',
  'jdownloader2',
  'music2',
  'musik',
  'musik2',
  'nas',
  'nas2',
  'nextcloud1',
  'nextcloud2',
  'nextcloud3',
  'nextcloud4',
  'akitasDen',
  'akitasDen2',
])

function shouldHideLine(line: string): boolean {
  if (!line) return true // hide empty lines
  const trimmed = line.trim()
  if (trimmed.startsWith('#')) return true // hide comments

  // Split by whitespace, ignore the first token if it's an IP-like token
  const tokens = trimmed.split(/\s+/)
  if (tokens.length <= 1) return false

  // Heuristic: if first token looks like an IPv4/IPv6, skip it when checking names
  const startIndex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/.test(tokens[0]) || tokens[0].includes(':') ? 1 : 0

  for (let i = startIndex; i < tokens.length; i++) {
    const t = tokens[i].toString().trim()
    // Normalize to plain host label without domain dots for matching against legacy list
    const short = t.split('.')[0]
    if (HIDDEN_DNS_NAMES.has(short)) {
      return true
    }
  }

  return false
}

export default defineEventHandler(async () => {
  const list = await HomeCtrlUtils.getLocalDNSEntries()
  const filtered = (list || []).filter((line) => !shouldHideLine(line))
  return filtered.join('<br>')
})
