/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        apiUrl: "http://localhost:5183/Api/"
    }
}

module.exports = nextConfig
