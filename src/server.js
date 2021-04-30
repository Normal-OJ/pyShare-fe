import { createServer } from 'miragejs'

export const makeServer = ({ environment }) =>
  createServer({
    environment,

    routes() {
      this.namespace = 'api'
      this.passthrough()
    },
  })
