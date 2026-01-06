import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7078',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          // Response: Strip Secure/SameSite so browser accepts the cookie over HTTP
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            if (proxyRes.headers['set-cookie']) {
              proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map((cookie) => {
                return cookie
                  .replace(/; Secure/gi, '')
                  .replace(/; SameSite=None/gi, '; SameSite=Lax')
                  .replace(/; Domain=[^;]+/gi, ''); // Strip Domain to allow localhost
              });
            }
          });

          // Request: Extract JWT from Cookie and add Authorization Header
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            const cookieHeader = req.headers.cookie;
            if (cookieHeader) {
              console.log('Proxy Request Cookies:', cookieHeader);
              // Look specifically for access_token
              const match = cookieHeader.match(/access_token=([^;]+)/);
              if (match && match[1]) {
                // Important: Decode the token in case the cookie is URL-encoded
                const token = decodeURIComponent(match[1]);
                console.log('Proxy: Injecting Authorization Header: Bearer', token.substring(0, 20) + '...');
                proxyReq.setHeader('Authorization', `Bearer ${token}`);
              }
            }
          });
        },
      }
    }
  }
});
