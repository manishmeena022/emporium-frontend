import React, { useEffect } from 'react'
import styles from "./Home.module.scss";
import { InfoBox } from '../../infoBox/InfoBox';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrderHistory ,CALC_TOTAL_ORDER_AMOUNT , selectTotalOrderAmount ,STORE_ORDERS} from "../../../redux/slice/orderSlice";
import  useFetchCollection from "../../../customHooks/useFetchCollection";
import { STORE_PRODUCTS,selectProducts } from '../../../redux/slice/productSlice';
import { Chart } from '../../chart/Chart';
//icons
import  earningimg from "../../../assets/images/savings.png";
import productimg from "../../../assets/images/trolley-cart.png";
import orderimg from "../../../assets/images/order.png";

export const Home = () => {
  const products = useSelector(selectProducts);
  const orders = useSelector(selectOrderHistory);
  const totalOrderAmount = useSelector(selectTotalOrderAmount);

  const fbProducts = useFetchCollection("products");
  const {data} = useFetchCollection("orders");

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(STORE_PRODUCTS({
      products: fbProducts.data
    }));
    dispatch(STORE_ORDERS(data));
    dispatch(CALC_TOTAL_ORDER_AMOUNT());
  },[dispatch, data, fbProducts])

  return (
    <div className={styles.home}>
      <h2>Admin Home</h2>
      <div className={styles["info-box"]}>
        <InfoBox cardClass={`${styles.card} ${styles.card1}`} 
        title={"Earnings"}
        count={`$${totalOrderAmount}`}
        icon={<img src={earningimg} alt='earning' className='h-10' />}
        />
        <InfoBox cardClass={`${styles.card} ${styles.card2}`} 
        title={"Products"}
        count={products.length}
        icon={<img src={productimg} alt='earning' className='h-10' />}
        />
        <InfoBox cardClass={`${styles.card} ${styles.card3}`} 
        title={"Orders"}
        count={orders.length}
        icon={<img src={orderimg} alt='earning' className='h-10' />}
        />
      </div>
      <div >
        <Chart />
      </div>
    </div>    
  )
}