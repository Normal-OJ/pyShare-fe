import { createServer, Response } from 'miragejs'

export const makeServer = ({ environment }) =>
  createServer({
    environment,

    routes() {
      this.namespace = 'api'
      // this.get('/course', () => new Response(403, {}, { message: 'Authorization Expired' }))
      this.patch(
        '/course/:name/student/remove',
        () => new Response(200, {}, { message: 'cool bro' }),
        // () => new Response(400, {}, { message: 'fail to update students' }),
      )
      this.passthrough()
    },
  })
