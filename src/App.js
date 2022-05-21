import {Component} from "react"
import Navbar from "./components/Navbar/Navbar"


class App extends Component{
render(){
  return  <>

    <Navbar/> {/*all components are included in Routes at the end of the navbar component to pass the currency as a props*/}
    
  </>
}
}
export default App
