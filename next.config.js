// File: next.config.js (phiên bản đã sửa)

/** @format */

const createNextIntlPlugin = require("next-intl/plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // dùng App Router
  },
};

const withNextIntl = createNextIntlPlugin();
module.exports = withNextIntl(nextConfig);
