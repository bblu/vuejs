import request from '@/utils/request'

export function login(name, pswd) {
  return request({
    url: 'api/user/login',
    method: 'post',
    data: {
      name,
      pswd
    }
  })
}

export function getInfo(token) {
  return request({
    url: 'api/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'api/user/logout',
    method: 'post'
  })
}
