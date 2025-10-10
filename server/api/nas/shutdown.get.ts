import { readBody } from 'h3'
import { HomeCtrlUtils } from '../../utils/homeCtrl.utils'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ action?: string }>(event)
  if (body?.action) {
    const list = await HomeCtrlUtils.infoShutdownOfNas()
    return list.join('<br>')
  }
  return ''
})
