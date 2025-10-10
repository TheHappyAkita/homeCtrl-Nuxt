import { HomeCtrlUtils } from '../../utils/homeCtrl.utils'

export default defineEventHandler(async () => {
  const list = await HomeCtrlUtils.getServicesDev()
  return list.join('<br>')
})
