#!/usr/bin/env node

import commander from 'commander'
import { start } from '.'
import pkg from '../package.json'

const PORT = 5000

const program = new commander.Command()

program
  .version(pkg.version)
  .name('nhs')
  .usage('-d [path] -p [port]')
  .option('-d, --dest <dest>', '指定一个目录，否则就是当前目录')
  .option('-p, --port <port>', '指定一个端口，默认为5000')
  .action(source => {
    const { port, dest } = source

    start(parseInt(port) || PORT, dest)
  })

program.parse(process.argv)
