import { HomeCtrlUtils } from '../../utils/homeCtrl.utils'

export default defineEventHandler(async () => {
  const list = await HomeCtrlUtils.pingNas()
  return list.join('<br>')
})
