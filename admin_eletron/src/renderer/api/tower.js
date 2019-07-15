import request from '@/utils/request'

export function getStyle(id) {
  return request({
    url: '/tower/style',
    method: 'get',
    id
  })
}

export function getTower(line) {
  return request({
    url: `/tower?line=${line}`,
    method: 'get'
  })
}

export function getTree(params) {
  return request({
    url: '/line/tree',
    method: 'get',
    params
  })
}
