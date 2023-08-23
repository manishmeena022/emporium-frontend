import React, { useState } from 'react'
import styles from "./AddProduct.module.scss";
import {Card} from "../../card/Card";
import {ref  ,uploadBytesResumable, getDownloadURL, deleteObject }  from "firebase/storage";
import { toast } from 'react-toastify';
import { addDoc ,collection ,doc, setDoc,Timestamp} from "firebase/firestore";
import { db , storage } from "../../../firebase/config";
import { useNavigate ,useParams } from 'react-router-dom';
import { Loader }from "../../../components/loader/Loader";
import { selectProducts } from '../../../redux/slice/productSlice';
import { useSelector } from 'react-redux';


const categories = [
  { id: 1, name : "Mobile"},
  { id: 2, name : "Computers"},
  { id: 3, name : "Tv"},
  { id: 4, name: "Appliances"},
  { id: 5, name: "Electronics"},
  { id: 6, name: "Men's Fashion"},
  { id: 7, name: "Women's Fashion"},
  { id: 8, name: "Jewelery"}
]

const initialState = {
    name : "",
    imageURL : "",
    price : 0,
    category : "",
    brand : "",
    desc : "",
}

export const AddProduct = () => {
  const { id } = useParams()
  const products = useSelector(selectProducts)
  const productEdit = products.find((item) => item.id === id)
  const [ product , setProduct] = useState( () => {
    const newState = detectForm(id , 
      {...initialState},
      productEdit
      )
      return newState;
  });


  const [uploadProgress , setUploadProgress] = useState(0);
  const [isLoading , setIsLoading] = useState(false);

  const navigate = useNavigate()
  

  function detectForm(id ,f1 ,f2){
    if(id === "ADD"){
      return f1;
    }
    return f2;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({...product, [name]: value})
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const storageRef = ref(storage, `emporium/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress)
        
      }, 
      (error) => {
        toast.error(error.message);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProduct({...product, imageURL : downloadURL})
          toast.success("Image uploaded successfully.")
        });
      }
    );
  }

  const addProduct = (e) => {
      e.preventDefault();
      setIsLoading(true)

      try{
        const docRef = addDoc(collection(db, "products"), {
          name: product.name,
          imageURL : product.imageURL,
          price : Number(product.price),
          category : product.category,
          brand : product.brand,
          desc : product.desc,
          createdAt : Timestamp.now().toDate()
        });
        setIsLoading(false);
        setUploadProgress(0);
        setProduct({...initialState })
        toast.success("Product uploaded successfully.");
        navigate("/admin/all-products")
      }catch(error){
          setIsLoading(false);
          toast.error(error.message);
      }
  }

  const editProduct = (e) => {
    e.preventDefault()
    setIsLoading(true)

    if(product.imageURL !== productEdit.imageURL){
      const storageRef = ref(storage, productEdit.imageURL);
      deleteObject(storageRef)
    }

    try{
      setDoc(doc(db, "products", id), {
          name: product.name,
          imageURL : product.imageURL,
          price : Number(product.price),
          category : product.category,
          brand : product.brand,
          desc : product.desc,
          createdAt : productEdit.createdAt,
          editedAt : Timestamp.now().toDate()
      });
      setIsLoading(false);
      toast.success("Product Edited Successfully")
      navigate("/admin/all-products")
      
    }catch(error){
      setIsLoading(false);
      toast.error(error.message)
    }

  }
  return (
    <>
    {isLoading && <Loader />}
    <div className={styles.product}>
      <h2>{detectForm(id, "Add New Product" ,"Edit Product")}</h2>
      <Card cardClass = {styles.card}>
        <form onSubmit={detectForm(id, addProduct , editProduct)}>
          <label>Product name : </label>
          <input type="text" placeholder= "Product"  name="name" value={product.name} onChange={(e) => handleInputChange(e)} required />
          <label>Product image : </label>
          <Card cardClass={styles.group}>
            {uploadProgress === 0 ? null : ( 
              <div className={styles.progress}>
                <div className={styles["progress-bar"]}
                  style={{width : `${uploadProgress}%` }}>
                  {uploadProgress < 100 ? `Uploading ${uploadProgress}` : `Upload Complete ${uploadProgress}%`}
                </div>
              </div>
            ) }
            
              <input type="file" accept="image/*" placeholder="Product image"  name="image" onChange={(e) => handleImageChange(e)}/>
              {product.imageURL === "" ? null : (
                  <input type='text' name="imageURL"  value={product.imageURL} required   disabled />
              )}

          </Card>
          <label>Product price : </label>
          <input type="number" placeholder= "Product price"  name="price" value={product.price} onChange={(e) => handleInputChange(e)} required />
          <label>Product Category : </label>
          <select name="category" value={product.category} onChange={(e) => handleInputChange(e) } required >
            <option value="" disabled >
              -- choose product category --
            </option>
            {categories.map((cate) => {
              return(
                <option key={cate.id} value={cate.name}>
                  {cate.name}
                </option>
              );
            })}
          </select>
          <label>Product Brand : </label>
          <input type="text" placeholder="Product Brand"  name="brand" value={product.brand} onChange={(e) => handleInputChange(e)} required />
          <label>Product Description : </label>
          <textarea name="desc" value={product.desc} cols="30" rows="10" onChange={(e) => handleInputChange(e)} required ></textarea>
          <button className="--btn --btn-primary" >{detectForm(id, "Save Product","Edit Product")}</button>
        </form>
      </Card>
    </div>
    </>
  )
}
