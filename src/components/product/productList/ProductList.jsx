import React, { useEffect, useState } from 'react';
import styles from "./ProductList.module.scss";
import gridicon from "../../../assets/images/grid.png";
import listicon from "../../../assets/images/list.png";
import { Search } from '../../search/Search';
import { ProductItem } from '../productItem/ProductItem';
import { useDispatch , useSelector } from 'react-redux';
import { FILTER_BY_SEARCH  ,SORT_PRODUCTS,selectFilteredProducts } from '../../../redux/slice/filterSlice';
import { Pagination } from '../../pagination/Pagination';


export const ProductList = ({ products }) => {
  const [ grid , setGrid] = useState(true);
  const [search ,setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const filteredProducts = useSelector(selectFilteredProducts);

  //pagination states
  const [currentPage , setCurrentPage] = useState(1);
  const [productsPerPage ] = useState(9);

  //get Current Products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct  - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(SORT_PRODUCTS({products,sort}));
  },[dispatch, products, sort]);

  useEffect(() => {
    dispatch(FILTER_BY_SEARCH({products,search}));
  },[dispatch, products, search]);
  
  
  return (
    <div className={styles["product-list"]} id='product'>
      <div className={styles.top}>
        <div className={styles.icons}>
          <img src={gridicon}  alt='grid-icon' className='h-10' color='orangered' onClick={() => setGrid(true)} />
          <img src={listicon}  alt='list-icon' className='h-10' color='orangered' onClick={() => setGrid(false)} />
          <p> 
            <b>{filteredProducts.length}</b> Products found
          </p>
         </div>
         {/* Search Icon */}
         <div>
          <Search value={search} onChange={(e) => setSearch(e.target.value)}/>
         </div>
         {/* sort Product */}
         <div className={styles.sort}>
          <label>Sort by: </label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="lowest-price">lowest Price</option>
            <option value="highest-price">Highest Price</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
         </div>
      </div>
      <div className={grid ? `${styles.grid}` : `${styles.list}`}>
        {products.length === 0 ? (
          <p>No Products found.</p>
        ): (
          <>
            {currentProducts.map((product) => {
              return(
                <div key={product.id}>
                  <ProductItem {...product} grid={grid} product={product} />
                </div>
              );
            })}
          </>
        )}
      </div>
      <Pagination 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        productsPerPage={productsPerPage} 
        totalProducts={filteredProducts.length}
      />
    </div>
  );
};
