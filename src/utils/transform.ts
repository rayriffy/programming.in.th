import { ISubmissions } from '../redux/types/submission'

export const transformStatus = (detail: ISubmissions) => {
  if (detail == undefined) return

  if (detail.status === 'in_queue') {
    return Object.assign({}, detail, {
      status: 'PENDING',
      points: 'PENDING',
      memory: 0,
      time: 0
    })
  }

  return detail
}