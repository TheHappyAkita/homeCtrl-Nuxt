import { readBody } from 'h3'
import { HomeCtrlUtils } from '../../utils/homeCtrl.utils'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ action?: string }>(event)
  if (body?.action?.trim().toLowerCase() === 'wol') {
    return await HomeCtrlUtils.execDevWol()
  }
  return ''
})
