import { createStore } from "redux";

let initialState = {
    productsPurchasedFeatures: [],
    productsPurchasedAllDetails: [],
    
}

function reducer(prevState=initialState,action){    //used to apply changes to the store 
    if(action.type=='add'){
        if(alreadyPurchased(prevState.productsPurchasedFeatures,action.product)){
        prevState.productsPurchasedFeatures.push(action.product);
        prevState.productsPurchasedAllDetails.push(action.productAll);
        return prevState
        }
    }
   return prevState
}

function alreadyPurchased(productsPutchased,newProduct){
    let flag = false;
    if(productsPutchased.length==0){
      flag = true;
    }
    productsPutchased.map((value)=>{
       if(value.id==newProduct.id&&value.attributeSwatch==newProduct.attributeSwatch&&value.attributeText==newProduct.attributeText){
           
           console.log(value.id);
           flag = false;
       }else{
        flag = true;
    }
    })

     return flag;
}

let store = createStore(reducer)

export default store