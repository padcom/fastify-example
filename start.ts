#!/usr/bin/env -S npx ts-node -T

import fastify, { FastifySchema } from 'fastify'
import { FastifyError } from '@fastify/error'

async function main() {
  const app = fastify()

  const get: FastifySchema = {
    response: {
      200: {
        type: 'object',
        required: ['name', 'age'],
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        }
      }
    }
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  app.get('/data', { schema: get }, async (req, res) => {
    await sleep(1000)
    return { name: 'John', age1: 45, x: 1 }
  })

  const post: FastifySchema = {
    body: {
      type: 'object',
      required: ['name', 'age' ],
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      }
    },
    response: {
      200: {
        type: 'string'
      }
    }
  }

  class TestError extends Error {
    readonly statusCode = 523
    readonly code = 'FUBAR'
  }

  app.post('/data', { schema: post }, async (req, res) => {
    console.log('Request data', req.body)

    throw new TestError('No error, just fooling around')
  })

  const listener = await app.listen({ port: 2995 })
  console.log('Check me out at', listener)
}

main()
