import { Component } from "react";
import { connect } from "react-redux";
import styles from "./ProductPurchase.module.css";
 class ProductPurchase extends Component {
  state = {
    product: [],
    attributeText: "",                //assigned with the selected text att
    attributeSwatch: "",              //assigned with the selected swatch att
    errorMessage: "",                 //this message is displayed when add to cart button is clicked without selected attributes
   attTextClass:styles.selectedAtt,   //class added to selected att of type text
   attSwatchClass:styles.colors,      //class added to selected att of type Swatch
  };
  getProductDetails = async () => {
    let idArr = window.location.pathname.split("/");
    let id = idArr[2];

   
    const requestOptions = { //requesting data from the graphql endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            product(id:"${id}"){
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
          }`,
      }),
    };
    let response = await fetch("http://localhost:4000", requestOptions);
    let product = await response.json();
    this.setState({
      product: product.data.product,
    });
  };
  componentDidMount() {
    this.getProductDetails();
  }
  onChangeText = (e) => { //function executed when text att is selected
      
      this.setState({ attributeText: e.target.value,attTextClass:styles.selectedAtt });

    
  }
  onChangeSwatch = (e) => {//function executed when swatch att is selected
    this.setState({ attributeSwatch: e.target.value,attSwatchClass:styles.attSwatchClass });
  };
  addToCart = (e) => {//function executed when add to cart button is clicked to check if all attributes are selected and add the product to cart 
   let flags = e.target.value.split(',');
   let sFlag = flags[0];
   let tFlag = flags[1];
    if (sFlag=='true' && tFlag=='true'&&this.state.attributeText == "" && this.state.attributeSwatch == "") {
    
        this.setState({
          errorMessage: "you must select your product features",
        });
      
    } else if (sFlag=='true'&&this.state.attributeSwatch == "") {
      this.setState({
        errorMessage: "you must select your product features",
      });
    } else if (tFlag=='true'&&this.state.attributeText == "") {
      this.setState({
        errorMessage: "you must select your product features",
      });
    } else {
      this.setState({
        errorMessage: "added successfully",
        
      });
    
     let productFeatures={id:this.state.product.id,
            name:this.state.product.name,
            attributeText: this.state.attributeText,
            attributeSwatch:this.state.attributeSwatch,
            attributes:this.state.product.attributeText,
            count:1
            
          };
      this.props.addCart(productFeatures,this.state.product);
    }
   
  };

  render() {
    let productObj = this.state.product;
    let currency = this.props.symbol;
    let typeFlag = [false, false];
    if (!(productObj.length == 0)) {
      return (
        <>
  
          <div className={styles.product_details}>
            <div className={styles.product_sides_container}>
              {productObj.gallery.map((image) => {
                return (
                  <>
                    <img
                      key={image}
                      className={styles.product_side_photos}
                      src={image}
                      alt=""
                    />
                  </>
                );
              })}
            </div>
            <div className={styles.product_main_container}>
              <img
                className={styles.product_main_photo}
                src={productObj.gallery[0]}
                alt=""
              />
            </div>
            <div className={styles.product_features}>
              <div className={styles.brand}>{productObj.brand}</div>
              <div className={styles.name}>{productObj.name}</div>

              {productObj.attributes.map((attribute) => {
                
                return (
                  <>
                    <div key={attribute.id}>
                      <div className={styles.attribute}>{attribute.id}:</div>
                      <div className={styles.product_size}>
                        {attribute.items.map((item) => {
                          
                          if (attribute.type == "swatch") {
                            typeFlag[0] = true;
                            if(this.state.attributeSwatch==item.value){ 
                            return (
                              <>
                              <div key={item.id} className={this.state.attSwatchClass}>
                                <button
                                  onClick={this.onChangeSwatch}
                                  value={item.value}
                                  
                                  className={styles.colors}
                                  style={{ backgroundColor: item.value }}
                                ></button>
                                </div>
                              </>
                            )
                            }else{
                              return (
                                <>
                                  <button
                                    onClick={this.onChangeSwatch}
                                    value={item.value}
                                    key={item.id}
                                    className={styles.colors}
                                    style={{ backgroundColor: item.value }}
                                  ></button>
                                </>
                              )
                            }
                          } else {
                            typeFlag[1] = true;
                           
                            if(this.state.attributeText==item.value){ 
                              
                              return(
                              <>
                                <button
                                  onClick={this.onChangeText}
                                  value={item.value}
                                  key={item.id}
                                  className={this.state.attTextClass}
                                >
                                  {item.value}
                                </button>
                              </>)
                            }else{
                              return(
                              <>
                                <button
                                  onClick={this.onChangeText}
                                  value={item.value}
                                  key={item.id}
                                  className={styles.sizes}
                                >
                                  {item.value}
                                </button>
                              </>)
                          }
                           
                          }
                        })}
                      </div>
                    </div>
                  </>
                );
              })}
              <div className={styles.attribute}>PRICE:</div>

              {productObj.prices.map((price, index) => {
                if (price.currency.symbol == currency) {
                  return (
                    <>
                      <div key={index} className={styles.price}>
                        {price.amount} {currency}
                      </div>
                    </>
                  );
                }
              })}
              
              <button
                value={typeFlag}
                onClick={this.addToCart}
                className={styles.cart_button}
                
              >
                ADD TO CART
              </button>
              
              {this.state.errorMessage=='added successfully'?(
                  <>
                  <div className={styles.addedSuccessfully}>{this.state.errorMessage}</div>
                  </>
              ):(
                <>
                <div className={styles.error}>{this.state.errorMessage}</div>
                </>
              )}
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: productObj.description }}
              />
            </div>
          </div>
        </>
      );
    }
  }
}
function stateToProps(state){
    return {productsPurchased:state}
}
function actionToProps(addAction){
    return{addCart:(product,productAll)=>{
           
            return addAction({type:'add',product:product,productAll:productAll})
    }}
}
export default connect(stateToProps,actionToProps)(ProductPurchase)