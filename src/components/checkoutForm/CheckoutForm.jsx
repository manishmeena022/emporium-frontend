import React, { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements} from "@stripe/react-stripe-js";
import styles from "./CheckoutForm.module.scss";
import spinner from "../../assets/images/spinner.jpg";
import { Card } from "../card/Card";
import { CheckoutSummary } from "../checkoutSummary/CheckoutSummary";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector ,useDispatch } from "react-redux";
import { selectUserId, selectEmail } from "../../redux/slice/authSlice";
import { selectCartItems ,selectCartTotalAmount ,CLEAR_CART} from "../../redux/slice/cartSlice";
import { selectShippingAddress } from "../../redux/slice/checkoutSlice";
import {Timestamp, addDoc ,collection} from "firebase/firestore";
import {db} from "../../firebase/config";

export  const CheckoutForm =()=> {
  
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userID = useSelector(selectUserId);
  const userEmail = useSelector(selectEmail);
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmount);
  const shippingAddress = useSelector(selectShippingAddress);


  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }
  }, [stripe]);

  const saveOrder = () => {
    const today = new Date();
    const date  = today.toDateString();
    const time = today.toLocaleTimeString();
    const orderConfig = { 
      userID,
      userEmail,
      orderDate : date,
      orderTime : time,
      orderAmount : cartTotalAmount,
      orderStatus : "Order Placed..",
      cartItems,
      shippingAddress,
      createdAt : Timestamp.now().toDate()
    }
    try{
      addDoc(collection(db, "orders"), orderConfig );
      dispatch(CLEAR_CART());
      toast.success("Order Saved");
      navigate("/checkout-success");
    }catch(error){ 
        toast.error(error.message);
    }
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const confirmPayment = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/checkout-success",
      },
      redirect : "if_required",
    })
    .then((result) => {
      // OK - PaymentIntent //bad -error
      if(result.error){
        toast.error(result.error.message)
        setMessage(result.error.message)
        return
      }
      if(result.paymentIntent){
        if(result.paymentIntent.status === "succeeded"){
          setIsLoading(false)
          toast.success("Payment successful")
          saveOrder()
        }
      }
    });
    setIsLoading(false);
  };

  return (
    <section>
        <div className={`container ${styles.checkout}`}>
            <h2>Checkout</h2>
            <form onSubmit={handleSubmit}>
                <div >
                    <Card cardClass={styles.card} >
                        <CheckoutSummary  />
                    </Card>
                </div>
                <div>
                    <Card cardClass={`${styles.card} ${styles.pay}`}>
                        <h3>Stripe   Checkout</h3>
                        <PaymentElement id={styles["payment-element"]} />
                        <button disabled={isLoading || !stripe || !elements} id="submit" className={styles.button}>
                            <span id="button-text">
                                {isLoading ? (<img src={spinner} alt="Loading.." className="w-50" />) : "Pay now"}
                            </span>
                        </button>
                        {message && <div id={styles["payment-message"]}>{message}</div>}
                    </Card>
                </div>
            </form>
        </div>
    </section>
  );
}