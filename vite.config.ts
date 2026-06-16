import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith('/api/')) {
            const apiPath = req.url.split('?')[0]
            const filePath = path.resolve(process.cwd(), `.${apiPath}.ts`)

            if (fs.existsSync(filePath)) {
              try {
                // Read request body
                let body = ''
                await new Promise((resolve) => {
                  req.on('data', chunk => body += chunk)
                  req.on('end', resolve)
                })

                // Create a Web Request object
                const fullUrl = `http://${req.headers.host}${req.url}`
                const webReq = new Request(fullUrl, {
                  method: req.method,
                  headers: req.headers as Record<string, string>,
                  body: req.method !== 'GET' && req.method !== 'HEAD' ? body : undefined
                })

                // Dynamic import the handler
                // We use a query param to avoid caching issues during dev
                const module = await server.ssrLoadModule(filePath)
                const handler = module.default

                if (typeof handler === 'function') {
                  const webRes = await handler(webReq)

                  // Copy headers
                  webRes.headers.forEach((value: string, key: string) => {
                    res.setHeader(key, value)
                  })

                  res.statusCode = webRes.status
                  const resText = await webRes.text()
                  res.end(resText)
                  return
                }
              } catch (error) {
                console.error(`Error in local API handler (${apiPath}):`, error)
                res.statusCode = 500
                res.end(JSON.stringify({ error: 'Internal Server Error', details: String(error) }))
                return
              }
            }
          }
          next()
        })
      }
    }
  ],
})
