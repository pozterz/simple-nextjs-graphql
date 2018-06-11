import App, { Container } from 'next/app'
import React from 'react'
import withApolloClient from '../lib/withApolloClient'
import { ApolloProvider } from 'react-apollo'

class Root extends App {
  render () {
    const { Component, pageProps, apolloClient } = this.props
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component { ...pageProps } />
        </ApolloProvider>
      </Container>
    )
  }
}

export default withApolloClient(Root)