import { HomeCtrlUtils } from '../../utils/homeCtrl.utils'

export default defineEventHandler(async () => {
  const list = await HomeCtrlUtils.getUpdateStateDev()
  return list.join('<br>')
})
