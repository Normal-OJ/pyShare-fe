declare namespace Sandbox {
  interface Info {
    url: string
    alias?: string
  }

  interface CreateBody extends Info {
    token: string
  }
}
