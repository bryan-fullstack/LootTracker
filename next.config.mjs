/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Permissão para o seu IP local (Acesso pelo celular sem erros)
  allowedDevOrigins: ['192.168.200.106'],
}

export default nextConfig