import initApollo from './apollo'
import Head from 'next/head'
import { getDataFromTree } from 'react-apollo'

export default (App) => {
  return class Apollo extends React.Component {
    static displayName = 'withApollo(App)'

    static async getInitialProps (ctx) {
      const { Component, router } = ctx

      let appProps = {}
      if(App.getInitialProps) {
        appProps = await App.getInitialProps(ctx)
      }

      const apolloState = {}

      const apollo = initApollo()
      
      try {
        await getDataFromTree(
          <App
            {...appProps}
            Component={Component}
            route={router}
            apolloState={apolloState}
            apolloClient={apollo}
            />
        )
      } catch (error) {
        console.error('Error while runing getDataFromTree', error)
      }

      if(!process.browser) {
        Head.rewind()
      }

      apolloState.data = apollo.cache.extract()

      return {
        ...appProps,
        apolloState
      }
    }

    constructor(props) {
      super(props)
      this.apolloClient = props.apolloClient || initApollo(props.apolloState.data)
    }

    render () {
      return <App { ...this.props } apolloClient={this.apolloClient} />
    }
  }
}