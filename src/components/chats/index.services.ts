import { fetchRequest } from '@/commons/utils/fetch'

//
export const chat = (host: string, params: any) => {
  return fetchRequest(host, {
    method: 'POST',
    data: params
  })
}
