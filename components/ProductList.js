import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const PRODUCTS_PER_PAGE = 10

const ProductList = ({
  data: { loading, error, allProducts, _allProductsMeta },
  loadMoreProducts
}) => {
  if(error) return 'error'
  if(allProducts && allProducts.length) {
    const areaMoreProducts = allProducts.length < _allProductsMeta.count
    return (
      <section>
        <ul>
          {allProducts.map((product, index) => (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <h5>{product.price}</h5>
            </div>
          ))}
        </ul>
      </section>
    )
  }

  return <div>Loading</div>
}

export const allProducts = gql`
  query allProducts($first: Int!, $skip: Int!) {
    allProducts(orderBy: createdAt_DESC, first: $first, skip: $skip) {
      id
      name
      price
    }
    _allProductsMeta {
      count
    }
  }
`

export const allProductsQueryVars = {
  skip: 0,
  first: PRODUCTS_PER_PAGE
}

export default graphql(allProducts, {
  options: {
    variables: allProductsQueryVars
  },
  props: ({ data }) => {
    return ({
      data,
      loadMoreProducts: () => {
        return data.fetchMore({
          variables: {
            skip: data.allProducts.length
          },
          updateQuery: (previousResult, { fetchMoreResult}) => {
            if(!fetchMoreResult) {
              return previousResult
            }
            return Object.assign({}, previousResult, {
              allProducts: [ ...previousResult.allProducts, ...fetchMoreResult.allProducts ]
            })
          }
        })
      }
    })
  }
})(ProductList)