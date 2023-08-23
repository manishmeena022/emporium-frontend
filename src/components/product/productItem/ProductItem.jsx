import React from 'react';
import styles from "./ProductItem.module.scss";
import {Card} from "../../card/Card";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ADD_TO_CART } from '../../../redux/slice/cartSlice';
import { CALCULATE_TOTALQUANTITY } from '../../../redux/slice/cartSlice';
export const ProductItem = ({product , grid , id ,name , imageURL, price ,desc}) => {
  
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shortenText = (text , n) => {
    if(text.length > n){
      const shortenedText = text.substring(0,n).concat("...")
      return shortenedText;
    }
    return text;
  }

  const addToCart =(product) => {
    dispatch(ADD_TO_CART(product))
    dispatch(CALCULATE_TOTALQUANTITY());
  }

  const buyNow = (product) => {
    dispatch(ADD_TO_CART(product))
    dispatch(CALCULATE_TOTALQUANTITY());
    navigate("/cart");
  }

  return (
      <Card  cardClass={grid ? `${styles.grid}` : `${styles.list}`}>
        <Link to={`/product-details/${id}`}>
          <div className={styles.img}>
            <img src={imageURL} alt={name} />
          </div>  
         </Link>
         <div className={styles.content}>
          <div className={styles.details}>
            <p>{`$${price}`}</p>
            <h4>{shortenText(name, 18)}</h4>
          </div>
          {!grid && <p className={styles.desc}>{shortenText(desc ,200)}</p>}
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={() => addToCart(product)}>Add to cart </button>
          &nbsp;
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded" onClick={() => buyNow(product)}>Buy now </button>
         </div>
      </Card>
      
    )
}
