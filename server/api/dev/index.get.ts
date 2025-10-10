import { HomeCtrlUtils } from '../../utils/homeCtrl.utils'

export default defineEventHandler(async () => {
  const list = await HomeCtrlUtils.pingDev()
  return list.join('<br>')
})
