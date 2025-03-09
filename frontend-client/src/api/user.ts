import type { LoginParams, LoginResult, RegisterParams, RegisterResult, UserInfo } from '@/types/user'
import { http } from '@/utils/http'

/**
 * 用户登录
 * @param data 登录参数
 */
export function login(data: LoginParams) {
  return http.post<LoginResult>('/auth/login', data)
}

/**
 * 用户注册
 * @param data 注册参数
 */
export function register(data: RegisterParams) {
  return http.post<RegisterResult>('/auth/register', data)
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return http.get<UserInfo>('/user/info')
}

/**
 * 更新用户信息
 * @param data 用户信息
 */
export function updateUserInfo(data: Partial<UserInfo>) {
  return http.put<UserInfo>('/user/info', data)
}

/**
 * 修改密码
 * @param data 密码信息
 */
export function changePassword(data: { oldPassword: string; newPassword: string }) {
  return http.put('/user/password', data)
}

/**
 * 退出登录
 */
export function logout() {
  return http.post('/auth/logout')
} 