import net from 'net'
import chalk from 'chalk'
import fs from 'fs'
import { promisify } from 'util'

interface ErrorWhitCode extends Error {
  code: string
}

export const checkPort = (port: number) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer().listen(port)
    server.on('listening', () => {
      resolve(port)
      server.close()
    })
    server.on('error', (err: ErrorWhitCode) => {
      if (err.code === 'EADDRINUSE') {
        console.log(chalk.red(`端口${port} 被占用`))
        resolve(checkPort(++port))
      }
      reject(err)
    })
  })
}

export const readFile = promisify(fs.readFile)
