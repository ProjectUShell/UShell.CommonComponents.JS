export function createServiceProxy<TService extends object>(baseUrl: string): TService {
  return new Proxy({} as TService, {
    get: (target, propertyName: string) => {
      // Return a function that makes an HTTP request when any method is called
      return async (...args: any[]) => {
        const url = `${baseUrl}/${propertyName}`

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(args),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        return await response.json()
      }
    },
  })
}

function test() {
  const service = createServiceProxy<{ getData: (id: number) => Promise<string> }>(
    'https://api.example.com/service',
  )
  service.getData(1).then((data) => console.log(data))
}
