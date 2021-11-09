import { readFile, checkPort } from './utils/index'
import chalk from 'chalk'
import * as http from 'http'
import path from 'path'
import url from 'url'
import mime from 'mime'

const server = http.createServer()

export const start = async (port: number, dest?: string) => {
  const securePort = await checkPort(port)
  server.on('request', async (req, res) => {
    if (req.method === 'GET') {
      let { pathname } = url.parse(req.url as string, true)
      let cache = 'max-age=2592000,s-maxage=3600'
      if (pathname === '/' || pathname === '/index.html') {
        pathname = '/index.html'
        cache = 'no-cache'
      }
      try {
        let destpath = path.join(process.cwd(), pathname || 'index.html')
        if (dest) {
          destpath = path.join(dest, pathname || 'index.html')
        }
        console.log(mime.getType(pathname as string))
        const data = await readFile(destpath)
        console.log(
          chalk.green(`GET ${pathname} 200 ${req.headers['user-agent']}`)
        )
        res.setHeader(
          'Content-Type',
          mime.getType(pathname as string) || 'text/html'
        )
        res.setHeader('Cache-Control', cache)
        res.end(data)
      } catch (error) {
        const { errno } = error as NodeJS.ErrnoException
        if (errno === -4058) {
          console.log(chalk.red(`GET ${pathname} 404`))
          res.statusCode = 404
          res.end('not found')
        } else {
          console.log(chalk.red(`GET ${pathname} 500`))
          res.statusCode = 500
          res.end('sever intenal error')
        }
      }
    } else {
      res.statusCode = 405
      res.end('<h1>405 Method Not Allowed</h1>')
    }
    // const dataArray: Buffer[] = []
    // req.on('data', (chunk: Buffer) => {
    //   dataArray.push(chunk)
    // })
    // req.on('end', () => {
    //   const body = Buffer.concat(dataArray).toString()
    //   console.log(body)
    //   res.end('hi')
    // })
  })

  server.listen(securePort, () => {
    console.log(chalk.cyan('server run at http://localhost:' + securePort))
  })
}
