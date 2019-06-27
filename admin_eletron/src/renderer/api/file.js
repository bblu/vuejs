import request from '@/utils/request'

export function uploadModel(tower, data) {
  const formData = new FormData()
  formData.append('file', data)
  return request({
    url: '/file/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-Tower': tower
    },
    data: formData
  })
}
