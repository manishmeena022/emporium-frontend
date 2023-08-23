import React, { useEffect } from 'react';
import styles from "./Product.module.scss";
import { ProductFilter } from './productFilter/ProductFilter';
import { ProductList } from './productList/ProductList';
import { useDispatch, useSelector } from 'react-redux';
import useFetctCollection from '../../customHooks/useFetchCollection';
import { STORE_PRODUCTS, selectProducts } from '../../redux/slice/productSlice';
import loader from "../../assets/images/loader.gif";
import { GET_PRICE_RANGE } from '../../redux/slice/productSlice';

export const Product = () => {
  const { data , isLoading } = useFetctCollection("products");
  const products = useSelector(selectProducts);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products : data,
      })
    );
    dispatch(GET_PRICE_RANGE({
      products : data
    }))
  },[dispatch,data]);

  return (
    <section>
      <div className={`container ${styles.product}`}>
        <aside className={styles.filter}>
          {isLoading  ? null : <ProductFilter /> }
        </aside>
        <div className={styles.content}>
          { isLoading ? (<img src={loader} alt='loading...' style={{width: "500px"}} className='align-center' />
          ) : (
            <ProductList products ={products}/>
          )}
          
        </div>
      </div>
    </section>
  )
}
