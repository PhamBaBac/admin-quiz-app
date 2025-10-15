export const API_NAME = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refreshToken: "/auth/refresh-token",
    generateSecret: "/auth/2fa/generate-secret",
    verify2fa: "/auth/2fa/verify-enable",
    disable2fa: "/auth/2fa/disable",
    tfaVerify: "/auth/login/2fa-verify",
  },
  users: {
    getMe: "/users/me",
  },
};