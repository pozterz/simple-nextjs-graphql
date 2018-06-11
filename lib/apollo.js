import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import fetch from 'isomorphic-unfetch'
import appConfig from '../config'

let apolloClient = null

if(!process.browser) {
  global.fetch = fetch
}

const create = (initialState) => {
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: true,
    link: new HttpLink({
      uri: appConfig.graphurl,
      credentials: 'same-origin'
    }),
    cache: new InMemoryCache().restore(initialState || {})
  })
}

const initApollo = (initialState) => {
  
  if(!process.browser) {
    return create(initialState)
  }

  if(!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}

export default initApollo