import { createServer } from 'miragejs'

// TODO: how to get the type of serverconfig in mirage?
export const makeServer = ({ environment }: { environment?: string }) =>
  createServer({
    environment,

    routes() {
      this.namespace = 'api'
      this.passthrough()
    },
  })
