import { capitalizeFirstLetter } from '../utils/StringUtils'

export function createServiceProxy<TService extends object>(
  baseUrl: string,
  headersFactory?: () => any,
  additionalBodyPropertiesFactory?: () => any,
): TService {
  return new Proxy({} as TService, {
    get: (target, propertyName: string) => {
      // Return a function that makes an HTTP request when any method is called
      return async (...args: any[]) => {
        if (baseUrl.endsWith('/')) {
          baseUrl = baseUrl.slice(0, -1)
        }
        const url = `${baseUrl}/${capitalizeFirstLetter(propertyName)}`
        const headers = headersFactory ? headersFactory() : {}
        const additionalBodyProperties = additionalBodyPropertiesFactory
          ? additionalBodyPropertiesFactory()
          : {}
        const bodyProperties: any = args[0]
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...additionalBodyProperties, ...bodyProperties }),
        }).catch((error) => {
          console.error('Error:', error)
          return null
        })
        if (!response) {
          return { return: null, fault: 'Network error' }
        }

        if (!response.ok) {
          return { return: null, fault: response.statusText }
        }

        const jsonResponse = await response.json()
        return jsonResponse
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
