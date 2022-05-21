import { Component } from "react";
import styles from "./Navbar.module.css";
import Navimg from "../../images/cartIcon.png";
import Cartimg from "../../images/cart.png";
import { NavLink, Routes, Route, Navigate, Link } from "react-router-dom";
import All from "../All/All";
import Tech from "../Tech/Tech";
import Clothes from "../Clothes/Clothes";
import ProductPurchase from "../ProductPurchase/ProducrPurchase";
import Cart from "../Cart/Cart";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
export default class Navbar extends Component {
  state = { currencies: [], currencySymbol: "$", openModal: false };
  getCurrencies = async () => {
    // POST request using fetch with async/await
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
                query {
                    currencies{label,symbol}
                }`,
      }),
    };
    let response = await fetch("http://localhost:4000", requestOptions);
    let currenciesArr = await response.json();

    this.setState({
      currencies: currenciesArr.data.currencies,
    });
  };
  componentDidMount() {
    this.getCurrencies();
  }
  onChange = (e) => {
    this.setState({ currencySymbol: e.target.value });
  };
  onClickButton = (e) => {
    e.preventDefault();
    this.setState({ openModal: true });
  };
  onCloseModal = () => {
    this.setState({ openModal: false });
  };
  viewBag=()=>{
    this.setState({ openModal: false });
  }
  render() {
    let currencySymbol = this.state.currencySymbol;
    let inCart=false;
    if(window.location.pathname.split("/")[1]=='cart'){
    inCart=true;
    }
    return (
      <>
        <div className={styles.bg}>
          <div className={styles.innerDiv}>
            <div className={styles.Nav_elements}>
              <NavLink to="/all" className={styles.Nav_element}>
                All{" "}
              </NavLink>
              <NavLink to="/tech" className={styles.Nav_element}>
                Tech
              </NavLink>
              <NavLink to="/clothes" className={styles.Nav_element}>
                Clothes
              </NavLink>
            </div>
            <div className={styles.logo}>
              <img className={styles.cartIcon} src={Navimg} alt="" />
            </div>
            <div>
              <form className={styles.currencyswitcher}>
                <select className={[styles.currencyswitcher, styles.select].join(" ")} id="options" value={currencySymbol} onChange={this.onChange}
                >
                  {this.state.currencies.map((value) => {
                    return (
                      <>
                        <option className={styles.options} key={value.symbol} value={value.symbol}>
                          {value.symbol} {value.label}
                        </option>
                      </>
                    );
                  })}
                </select>
              </form>
            </div>

            <button className={styles.cartCar} onClick={this.onClickButton}>
              <img className={styles.cartCarImg} src={Cartimg} alt="" />
            </button>
            {inCart?(<></>):(<><Modal classNames={styles.modal} open={this.state.openModal} onClose={this.onCloseModal}> {/*modal is used to make cartOverlay*/}
              <Cart />
              <Link to="/cart">
                <button onClick={this.viewBag} className={styles.viewbag}>VIEW BAG</button>
              </Link>
            </Modal></>)}
            
          </div>
        </div>

        <Routes>
          <Route path="/all" element={<All symbol={currencySymbol} />} />
          <Route path="/tech" element={<Tech symbol={currencySymbol} />} />
          <Route path="/clothes" element={<Clothes symbol={currencySymbol} />}/>
          <Route path="/ProductPurchase/:id" element={<ProductPurchase symbol={currencySymbol} />}/>
          <Route path="/cart" element={<Cart symbol={currencySymbol} />} />
          <Route path="/" element={<Navigate to="/all" />} />
        </Routes>
      </>
    );
  }
}
