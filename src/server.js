import { createServer, Response } from 'miragejs'

export const makeServer = ({ environment }) =>
  createServer({
    environment,

    routes() {
      this.namespace = 'api'
      this.passthrough('/auth/session')
      this.get('/course', () => new Response(403, {}, { message: 'Authorization Expired' }))
    },
  })
