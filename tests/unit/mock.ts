type ResolveData<T> = {
  data: {
    data: any
  }
}

type RejectError = {
  message: string
}

interface MockAgent<T> {
  [key: string]: {
    [key: string]: () => Promise<ResolveData<T> | RejectError>
  }
}

export function createMockAgent<T = any>(
  service: string,
  func: string,
  data: T,
  error: any,
): MockAgent<T> {
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
