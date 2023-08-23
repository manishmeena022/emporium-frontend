import React, { useEffect, useState } from 'react'
import styles from "./ProductDetails.module.scss";
import { Link, useNavigate , useParams } from 'react-router-dom';
import spinnerimg from "../../../assets/images/spinner.jpg";
import { ADD_TO_CART , DECREASE_CART, CALCULATE_TOTALQUANTITY , selectCartItems} from "../../../redux/slice/cartSlice";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useFetchDocument } from '../../../customHooks/useFetchDocument';
import  useFetchCollection from "../../../customHooks/useFetchCollection";
import { Card } from '../../card/Card';
import StarsRating from 'react-star-rate';

export const ProductDetails = () => {
    const { id } = useParams()
    const [product , setProduct] = useState(null)

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems)

    const cart = cartItems.find((cart) => cart.id === id)
    const {document} = useFetchDocument("products", id);
    const { data } = useFetchCollection("reviews");

    const filteredReviews = data.filter((review) => review.productID === id)

    const isCartAdded = cartItems.findIndex((cart) => {
      return cart.id === id
    })

    
    useEffect(() => {
      setProduct(document)
    },[document]);

    const addToCart =(product) => {
      dispatch(ADD_TO_CART(product))
      dispatch(CALCULATE_TOTALQUANTITY())
    }

    const decreaseCart = (product) => {
      dispatch(DECREASE_CART(product));
      dispatch(CALCULATE_TOTALQUANTITY())
    }

    const increaseCart =( product) => {
      dispatch(ADD_TO_CART(product))
      dispatch(CALCULATE_TOTALQUANTITY())
    }

    const buyNow = (product) => {
      dispatch(ADD_TO_CART(product))
      dispatch(CALCULATE_TOTALQUANTITY());
      navigate("/cart");
    }

  return (
    <section>
      <div className={`container ${styles.product}`} >
          <h2>Product Details</h2>
          <div>
            <Link to="/#products">
              &larr; Back To Products
            </Link>
          </div>
          {product === null ? (
            <img src={spinnerimg} alt='spinnerimg' />
          ):(
            <>
              <div className={styles.details}>
                <div className={styles.img}>
                  <img src={product.imageURL} alt={product.name} />
                </div>
                <div className={styles.content}>
                  <h3>{product.name}</h3>
                  <p className={styles.price}>{`₹${product.price}`}</p>
                  <p>
                    <b>SKU :</b> {product.id}
                  </p>
                  <p>
                    <b>Brand : </b> {product.brand}
                  </p>
                  <p>{product.desc}</p>
                  
                  <div className={styles.count}>
                    {isCartAdded < 0 ? null : (
                      <>
                        <button className='--btn' onClick={() => decreaseCart(product)}>-</button>
                        <p>
                          <b>{cart.cartQuantity}</b>
                        </p>
                        <button className='--btn' onClick={() => increaseCart(product)}>+</button>
                      </>
                    )}
                  </div>
                  <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded' onClick={() => addToCart(product)}>Add To Cart</button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded' onClick={() => buyNow(product)}>Buy Now</button>
                </div>
              </div>
            </>
          )}
          <Card cardClass={styles.card}>
              <h3>Product Reviews</h3>
              <div>
                {filteredReviews.length === 0 ? (
                  <p>There are no reviews for this product yet.</p>
                ): (
                  <>
                    {filteredReviews.map((item, index) => {
                      const { rate, review , reviewDate , userName} = item
                      return(
                        <div key={index} className={styles.review}>
                          <StarsRating  value={rate} />
                          <p>{review}</p>
                          <span>
                            <b>{reviewDate}</b>
                          </span>
                          <br />
                          <span>
                            <b>by: {userName}</b>
                          </span>
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
          </Card>
      </div>
    </section>
  )
};

