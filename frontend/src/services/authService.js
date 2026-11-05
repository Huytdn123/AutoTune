import client from './client/httpClient'

export const authApi = {
  login: async (username, password) => {
    const res = await client.post('/auth/login', { username, password })
    return res.data
  },
  logout: async () => {
    try {
      const res = await client.post('/auth/logout')
      return res.data
    } catch {
      return { success: true }
    }
  },
  getMe: async () => {
    const res = await client.get('/auth/me')
    return res.data
  },
  getAllUsers: async () => {
    const res = await client.get('/auth/users')
    return res.data
  },
  createUser: async (payload) => {
    const res = await client.post('/auth/users', payload)
    return res.data
  },
  updateUserRole: async (id, role) => {
    const res = await client.put(`/auth/users/${id}/role`, { role })
    return res.data
  },
  deleteUser: async (id) => {
    const res = await client.delete(`/auth/users/${id}`)
    return res.data
  }
}

export const userApi = {
  getProfile: async () => {
    const res = await client.get('/user/profile')
    return res.data
  },
  updateProfile: async (data) => {
    const res = await client.put('/user/profile', data)
    return res.data
  },
  changePassword: async (data) => {
    const res = await client.post('/user/change-password', data)
    return res.data
  }
}

