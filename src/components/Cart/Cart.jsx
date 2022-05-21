import { Component } from "react";
import { connect } from "react-redux";
import styles from "./Cart.module.css";
class Cart extends Component {
  state = {
    productsPurchased: this.props.storeState.productsPurchasedFeatures,             //all products in cart with selected features (attributes)
    productsPurchasedAllDetails:this.props.storeState.productsPurchasedAllDetails, //all products in cart without selected features
   
  };
  inc = (e) => { //function used to increase the quantity of certain product
    this.state.productsPurchased[e.target.value].count =
      this.state.productsPurchased[e.target.value].count + 1;
    this.setState({
      productsPurchased: this.state.productsPurchased,
    
    });
  };
  dec = (e) => { //function used to decrease the quantity of certain product
    if (this.state.productsPurchased[e.target.value].count > 0) {
      this.state.productsPurchased[e.target.value].count =
        this.state.productsPurchased[e.target.value].count - 1;
      this.setState({
        productsPurchased: this.state.productsPurchased,
      });
    }
  };
  render() {
    let productsPurchased = this.state.productsPurchased;
    let productsPurchasedAllDetails = this.state.productsPurchasedAllDetails;
    let currency = this.props.symbol;
    let count = 0; //quantity of all products in cart
    let total = 0; //total money to be paid
    let inCart=false;
    if(window.location.pathname.split("/")[1]=='cart'){
    inCart=true;
    }
    
    return (
      <>
        <div className={styles.cartBody}>
          {inCart?(<><div className={styles.cartTitle}>CART</div></>):(<><div className={styles.cartTitle}>My Bag</div></>)}
          
          {productsPurchased.map((value, index) => {
            {
              count = count + value.count;
            }

        
            return (
              <>
                <div className={styles.line}></div>
                <div className={styles.productContainer} key={value.id}>
                  <div>
                    <div className={styles.productId}>{value.id}</div>
                    <div className={styles.productName}>{value.name}</div>

                    {productsPurchasedAllDetails[index].prices.map((price) => {
                      if (price.currency.symbol == currency) {
                        total = total + price.amount * value.count;
                        return (
                          <>
                            <div
                              className={styles.price}
                              key={price.currency.symbol}
                            >
                              {currency} {price.amount}
                            </div>
                          </>
                        );
                      }
                    })}

                    {productsPurchasedAllDetails[index].attributes.map(
                      (value) => {
                        return (
                          <>
                            <div className={styles.attribute}>
                              {value.name}:
                            </div>
                            <div className={styles.attributes}>
                              {value.items.map((attribute) => {
                                if (value.type == "text") {
                                  if (
                                    attribute.value ==
                                    productsPurchased[index].attributeText
                                  ) {
                                    return (
                                      <>
                                        <div
                                          className={styles.textChosen}
                                          key={attribute.id}
                                        >
                                          {attribute.value}
                                        </div>
                                      </>
                                    );
                                  } else {
                                    return (
                                      <>
                                        <div
                                          className={styles.text}
                                          key={attribute.id}
                                        >
                                          {attribute.value}
                                        </div>
                                      </>
                                    );
                                  }
                                } else {
                                  if (
                                    attribute.value ==
                                    productsPurchased[index].attributeSwatch
                                  ) {
                                    return (
                                      <>
                                        <div className={styles.swatchChosen}>
                                          <div
                                            className={styles.swatch}
                                            key={attribute.id}
                                            style={{
                                              backgroundColor: attribute.value,
                                            }}
                                          ></div>
                                        </div>
                                      </>
                                    );
                                  } else {
                                    return (
                                      <>
                                        <div
                                          className={styles.swatch}
                                          key={attribute.id}
                                          style={{
                                            backgroundColor: attribute.value,
                                          }}
                                        ></div>
                                      </>
                                    );
                                  }
                                }
                              })}
                            </div>
                          </>
                        );
                      }
                    )}
                  </div>
                  <div className={styles.product_Img_Quantitiy}>
                    <div className={styles.quantity}>
                      <button
                        onClick={this.inc}
                        value={index}
                        className={styles.common}
                      >
                        +
                      </button>
                      <div className={styles.count}>{value.count}</div>

                      <button
                        onClick={this.dec}
                        value={index}
                        className={[styles.decrease, styles.common].join(" ")}
                      >
                        -
                      </button>
                    </div>
                    <div>
                      <img
                        className={styles.product_Img}
                        src={productsPurchasedAllDetails[index].gallery[0]}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </>
            );
          })}
          {inCart? (<>
          <div className={styles.line}></div>
          <div className={styles.purchasingDetails}>
            <div className={styles.payment}>
              <div>Tax 21%: </div>
              <div className={styles.numbers}>
                {currency}
                {(0.21 * total).toFixed(2)} 
              </div>
            </div>
            <div className={styles.payment}>
              <div>Quantity: </div>
              <div className={styles.numbers}>{count}</div>
            </div>
            <div className={styles.payment}>
              <div>Total: </div>
              <div className={styles.numbers}>
                {currency}
                {total.toFixed(2)}
              </div>
            </div>
          </div>
          </>):(<><div></div></>)
          }
          
        </div>
      </>
    );
  }
}
function stateToProps(state) {
  return { storeState: state };
}
export default connect(stateToProps)(Cart);
