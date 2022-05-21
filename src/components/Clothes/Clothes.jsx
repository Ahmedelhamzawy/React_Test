import { Component } from "react";
import styles from "../All/All.module.css";
import { Link } from "react-router-dom";
export default class Clothes extends Component {
  state = { allProducts: [] };//object used to put all the products in the shop in it
  getAllData = async () => {
  
    const requestOptions = {//requesting data from the graphql endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
         query {
             categories {
                 name
                 products {
                   id
                   name
                   inStock
                   gallery
                   description
                   category
                   attributes {
                     id
                     name
                     type
                     items {
                       displayValue
                       value
                       id
                     }
                   }
                   prices {
                     currency {
                       label
                       symbol
                     }
                     amount
                   }
                   brand
                 }
               }
         }`,
      }),
    };
    let response = await fetch("http://localhost:4000", requestOptions);
    let products = await response.json();
    this.setState({
      allProducts: products.data.categories[1].products,
    });
  };
  componentDidMount() {
    this.getAllData();
  }
  render() {
    let currency = this.props.symbol;
    return (
      <>
        <div className={styles.all_Products}>
          <div className={styles.category_Title}>Clothes</div>
          <div className={styles.products_listing}>
            {this.state.allProducts.map((value) => {
              return (
                <div className={styles.product} key={value.id}>
       {value.inStock ? (
                    <>
                      <Link
                        to={{
                          pathname: `/ProductPurchase/${value.id}`,
                        }}
                      >
                        <img
                          className={styles.product_img}
                          src={value.gallery[0]}
                          alt=""
                        />
                      </Link>
                      <div className={styles.product_name}>{value.name}</div>
                      {value.prices.map((price, index) => {
                        if (price.currency.symbol == currency) {
                          return (
                            <>
                              {" "}
                              <div key={index} className={styles.product_price}>
                                {" "}
                                {currency} {price.amount}
                              </div>
                            </>
                          );
                        }
                      })}
                    </>
                  ) : (
                    <>
                      
                      <div className={styles.outofstock}>OUT OF STOCK</div>
                      <img
                        className={styles.product_img}
                        src={value.gallery[0]}
                        alt=""
                      />
                      <div className={styles.product_outstock}>
                        {value.name}
                      </div>
                      {value.prices.map((price, index) => {
                        if (price.currency.symbol == currency) {
                          return (
                            <>
                              
                              <div key={index} className={styles.product_price_outofstock}>
                                {" "}
                                {currency} {price.amount}
                              </div>
                            </>
                          );
                        }
                      })}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}
