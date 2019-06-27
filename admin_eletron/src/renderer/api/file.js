import request from '@/utils/request'

export function uploadModel(data) {
  const formData = new FormData()
  formData.append('file', data)
  return request({
    url: '/file/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-towerid': 7
    },
    data: formData
  })
}
