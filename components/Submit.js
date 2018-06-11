import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { allProducts, allProductsQueryVars } from './ProductList'

const Submit = ({ createProduct }) => {
  const handleSubmit = e => {
    e.preventDefault()

    const form = e.target
    const formData = new window.FormData(form)
    
    createProduct(formData.get('name'), formData.get('price'))

    form.reset()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Submit</h1>
      <input placeholder='Name' name='name' type='text' required />
      <input placeholder='Price' name='price' type='number' required />
      <button type='submit'>Submit</button>
    </form>
  )
}

const createProduct = gql`
  mutation createProduct($name: String!, $price: Int!) {
    createProduct(name: $name, price: $price) {
      id
      name
      price
    }
  }
`

export default graphql(createProduct, {
  props: ({ mutate }) => ({
    createProduct: (name, price) => 
      mutate({
        variables: { name, price },
        update: (proxy, { data: { createProduct }}) => {
          const data = proxy.readQuery({
            query: allProducts,
            variables: allProductsQueryVars
          })
          proxy.writeQuery({
            query: allProducts,
            data: {
              ...data,
              allProducts: [ createProduct, ...data.allProducts ]
            },
            variables: allProductsQueryVars
          })
        }
      })
  })
})(Submit)