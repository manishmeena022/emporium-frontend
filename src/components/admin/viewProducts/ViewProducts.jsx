import React, { useEffect, useState } from 'react'
import styles from "./ViewProducts.module.scss";
import { toast } from 'react-toastify';
import { db, storage } from "../../../firebase/config";
import { deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import edit from "../../../assets/images/edit.png";
import deleteicon from "../../../assets/images/bin.png";
import {Loader} from "../../../components/loader/Loader";
import { deleteObject, ref } from 'firebase/storage';
import Notiflix from 'notiflix';
import { useDispatch, useSelector } from 'react-redux';
import { STORE_PRODUCTS ,selectProducts } from '../../../redux/slice/productSlice';
import useFetctCollection from '../../../customHooks/useFetchCollection';
import { FILTER_BY_SEARCH, selectFilteredProducts } from '../../../redux/slice/filterSlice';
import { Search } from '../../search/Search';
import { Pagination } from '../../pagination/Pagination';

export const ViewProducts = () => {
  const [search ,setSearch] = useState("");
  const { data , isLoading } = useFetctCollection("products");
  const products = useSelector(selectProducts)
  const filteredProducts = useSelector(selectFilteredProducts)

  const [currentPage , setCurrentPage] = useState(1);
  const [productsPerPage ] = useState(9);

  //get Current Products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct  - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products : data,
      })
    );
  },[dispatch,data]);

  useEffect(() => {
    dispatch(FILTER_BY_SEARCH({products,search}));
  },[dispatch, products, search]);
 
  const confirmDelete = (id, imageURL) =>{
    Notiflix.Confirm.show(
      'Delete Product!!!',
      'You about to delete this product?',
      'Delete',
      'Cancel',
      function okCb() {
        deleteProduct(id, imageURL)
      },
      function cancelCb() {
        console.log("Delete Cancelled")
      },
      {
        width: '320px',
        borderRadius: '3px',
        titleColor: "orangered",
        okButtonBackground: "orangedred",
        cssAnimationStyle: "zoom",

      },
    );
  }

  const deleteProduct = async (id, imageURL ) => {
    try{  
     await deleteDoc(doc(db, "products", id));
     const storageRef = ref(storage, imageURL);
     await deleteObject(storageRef)
     toast.success('Product deleted successfully.')

    }catch(error){
      toast.error(error.message)
    }
  }
  return (
    <>
      { isLoading && <Loader /> }
      <div className={styles.table}>
        <h2>All Products</h2>
        <div className={styles.search}>
          <p>
            <b>{filteredProducts.length}</b> products found
          </p>
          <div>
          <Search value={search} onChange={(e) => setSearch(e.target.value)}/>
         </div>
        </div>
        { filteredProducts.length === 0 ? (
        <p>No Product found </p>) : (
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody >
            {currentProducts.map((product , index) => {
              const { id, name, price, imageURL , category } = product
              return(
                  <tr key={id}>
                    <td>
                      {index+1}
                    </td>
                    <td>
                      <img src={imageURL} alt={name} style={{ width: "100px"}} />
                    </td>
                    <td>
                      {name}
                    </td>
                    <td>
                      {category}
                    </td>
                    <td>
                      {`₹${price}`}
                    </td>
                    <td className={styles.icon}>
                      <Link to={`/admin/add-product/${id}`} >
                      <img src={edit} alt='edit' className='h-10' />
                      &nbsp;
                      <img src={deleteicon} alt='bin' className='h-10' onClick={() => confirmDelete(id, imageURL)}/>
                      </Link>
                    </td>
                  </tr>
              )
            })}
            </tbody>
          </table>
        )}
        <Pagination 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        productsPerPage={productsPerPage} 
        totalProducts={filteredProducts.length}
      />
      </div>
    </>
  )
}
