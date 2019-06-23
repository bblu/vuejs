import request from '@/utils/request'

export function uploadModel(data) {
  const fd = new FormData()
  fd.append('file', data.raw)
  return request({
    url: '/file/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-towerid': 7
    },
    data: fd
  })
}
