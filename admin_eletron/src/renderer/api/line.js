import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/line/list',
    method: 'get',
    params
  })
}

export function getTower(line) {
  return request({
    url: '/line/tower',
    method: 'get',
    params: { line }
  })
}

export function getTree(params) {
  return request({
    url: '/line/tree',
    method: 'get',
    params
  })
}
