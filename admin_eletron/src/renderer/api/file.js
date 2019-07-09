import request from '@/utils/request'

export function uploadModel(line, tower, data) {
  const formData = new FormData()
  formData.append('file', data)
  return request({
    url: '/file/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-Line': line,
      'X-Tower': tower
    },
    data: formData
  })
}
