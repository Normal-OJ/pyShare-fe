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
  func: string,
  data: any,
  error: any,
): MockAgent {
  return {
    [service]: {
      [func]: () =>
        new Promise((resolve, reject) => {
          if (error) {
            if (typeof error === 'string') reject({ message: error })
            else reject(error)
          } else {
            resolve({
              data: { data },
            })
          }
        }),
    },
  }
}
