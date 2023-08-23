import React, { useEffect } from 'react'
import styles from "./Cart.module.scss";
import { useDispatch, useSelector } from 'react-redux';
import { selectCartTotalAmount ,selectCartItems, selectCartTotalQuantity, ADD_TO_CART , DECREASE_CART, REMOVE_FROM_CART, CLEAR_CART , CALCULATE_SUBTOTAL , CALCULATE_TOTALQUANTITY , SAVE_URL} from '../../redux/slice/cartSlice';
import { selectIsLoggedIn} from "../../redux/slice/authSlice";
import { Link, useNavigate } from 'react-router-dom';
import trashicon from "../../assets/images/bin.png";
import { Card } from '../../components/card/Card';


export const Cart = () => {
  const cartItems = useSelector(selectCartItems)
  const cartTotalAmount = useSelector(selectCartTotalAmount)
  const cartTotalQuantity = useSelector(selectCartTotalQuantity)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const increaseCart =(cart)=> {
    dispatch(ADD_TO_CART(cart));
  }
  
  const decreaseCart =(cart)=> {
    dispatch(DECREASE_CART(cart))
  }

  const removeFromCart = (cart) =>{
    dispatch(REMOVE_FROM_CART(cart))
  }

  const clearCart = () => {
    dispatch(CLEAR_CART())
  }

  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL())
    dispatch(CALCULATE_TOTALQUANTITY())
    dispatch(SAVE_URL(""))
  },[dispatch,cartItems])

  const url = window.location.href;

  const checkout = () => {
    if(isLoggedIn){
      navigate("/checkout-details")
    }else{
        dispatch(SAVE_URL(url))
        navigate("/login")
    }
  }

  return (
    <section>
      <div className={`container ${styles.table}`}>
        <h2>Shoping Cart</h2>
        {cartItems.length === 0 ? (
          <>
          <p>Your cart is currently empty. </p>
          <br/>
          <div>
            <Link to="/#products">&larr; Continue shopping</Link>
          </div>
          </>
        ):(
          <>
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((cart, index) => {
                const {id, name, price, imageURL , cartQuantity} = cart
                return(
                  <tr key={id}>
                    <td>{index +1 }</td>
                    <td>
                      <p>
                        <b>{name}</b>
                      </p>
                      <img src={imageURL} alt={name} className='h-40 w-100'/>
                    </td>
                    <td>{price}</td>
                    <td>
                      <div className={styles.count}>
                        <button className="--btn" onClick={()=> decreaseCart(cart)}>-</button>
                        <p>
                          <b>{cartQuantity}</b>
                        </p>
                        <button className="--btn" onClick={()=> increaseCart(cart)}>+</button>
                      </div>
                    </td>
                    <td>
                      {(price * cartQuantity).toFixed(2)}
                    </td>
                    <td>
                      <img src={trashicon} alt='trashicon'  className='h-10' onClick={() => removeFromCart(cart)}/>
                    </td>
                  </tr>
                  
                );
              })}
            </tbody>
          </table>
          <div className={styles.summary}>
            <button className="--btn --btn-danger" onClick={clearCart}>Clear Cart</button>
          </div>
          <div className={styles.checkout}>
            <div>
              <Link to="/#products">&larr; Continue shopping </Link>
            </div>
            <br />
            <Card cardClass={styles.card}>
              <p>
                <b>{`Cart items(s): ${cartTotalQuantity}`}</b>
              </p>
              <div className={styles.text}>
                <h4>
                  <b>SubTotal :</b>
                </h4>
                <h3>{`$${cartTotalAmount.toFixed(2)}`}</h3>
              </div>
              <p>Tax an shipping calculated at checkout</p>
              <button className="--btn --btn-primary --btn-block" onClick={checkout}>Checkout</button>
            </Card>
          </div>
          </>
        )}
      </div>
    </section>
  )
}
