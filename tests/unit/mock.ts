type ResolveData = {
  data: {
    data: any
  }
}

type RejectError = {
  message: string
}

interface MockAgent {
  [key: string]: {
    [key: string]: () => Promise<ResolveData | RejectError>
  }
}

export function createMockAgent(
  service: string,
  funcname: string,
  data: any,
  error: any,
  fn: (...args: any[]) => Promise<any>,
): MockAgent {
  return {
    [service]: {
      [funcname]: fn || (() =>
        new Promise((resolve, reject) => {
          if (error) {
            if (typeof error === 'string') reject({ message: error })
            else reject(error)
          } else {
            resolve({
              data: { data },
            })
          }
        })),
    },
  }
}
