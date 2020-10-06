import Prismic from 'prismic-javascript'

export const apiEndpoint = 'https://erik-portfolio.cdn.prismic.io/api/v2'
export const accessToken = 'MC5YM3ZOblJFQUFDUUFiUXJx.77-9I--_vRbvv71vIu-_vUXvv73vv70IUO-_vUrvv73vv73vv73vv73vv71e77-977-977-977-977-9J--_vU4577-977-9'

export const Client = (req = null) => (
  Prismic.client(apiEndpoint, createClientOptions(req, accessToken))
)

const createClientOptions = (req = null, prismicAccessToken = null) => {
  const reqOption = req ? { req } : {}
  const accessTokenOption = prismicAccessToken ? { accessToken: prismicAccessToken } : {}

  return {
    ...reqOption,
    ...accessTokenOption,
  }
}