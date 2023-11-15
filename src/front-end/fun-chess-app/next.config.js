/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        apiUrl: "localhost:5183",
        apiProtocol: "http",
    }
}

module.exports = nextConfig
