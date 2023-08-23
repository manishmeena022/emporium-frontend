import React, { useEffect } from 'react';
import { Link , NavLink } from "react-router-dom";
import { useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import  shoppingCart  from "../../assets/images/add-cart.png";
import logoimg from "../../assets/images/pngwing.com.png";
import userimg from "../../assets/images/user.png";
import hidemenuicon from "../../assets/images/menu-bar.png";
import { SET_ACTIVE_USER,REMOVE_ACTIVE_USER } from '../../redux/slice/authSlice';
import { ShowOnLogin, ShowOnLogout } from '../hiddenLink/HiddenLink';
import { CALCULATE_TOTALQUANTITY ,selectCartTotalQuantity } from "../../redux/slice/cartSlice";
import { AdminOnlyLink} from '../adminOnlyRoute/AdminOnlyRoute';
import styles from "./Header.module.scss";


const logo = (
  <>
  
  <div className={styles.logo}>
    <Link to ="/">
      <img src={logoimg} alt='logo' className='h-20' />
    </Link>
  </div>
  </>
);

const activeLink= ({isActive}) => (isActive ? `${styles.active}` : "")

export const Header = () => {

  const [showMenu , setShowMenu] = useState(false);
  const [userName , setUserName] = useState("");
  const [scrollPage , setScrollPage] = useState(false);

  const carTotalQuantity = useSelector(selectCartTotalQuantity);

  useEffect(() => {
    dispatch(CALCULATE_TOTALQUANTITY());
  },[]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fixNavbar = () => {
    if(window.scrollY > 50){
      setScrollPage(true);
    }else{
      setScrollPage(false);
    }
  };
  window.addEventListener("scroll", fixNavbar);

  //Monitor currently sign in user
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        
        if(user.displayName == null){
          const u1 = user.email.substring(0, user.email.indexOf("@"));
          const uName = u1.charAt(0).toUpperCase() + u1.slice(1)
          setUserName(uName)
        }else {
          setUserName(user.displayName); 
        }

        dispatch(SET_ACTIVE_USER({
          email : user.email,
          userName : user.displayName ? user.displayName : userName,
          userId : user.uid,

        }));
      } else {
        setUserName("")
        dispatch(REMOVE_ACTIVE_USER())
      }
    });
  },[dispatch,userName])

  /*const toggleMenu =()=>{
    setShowMenu(!showMenu)
  };
*/
  
  const hideMenu = () => {
    setShowMenu(false)
  };
  
  const logoutUser = () => {
    signOut(auth).then(() => {
      toast.success("Logout Successfully.");
      navigate("/");
    }).catch((error) => {
      toast.error(error.message);
    });
  };

  const cart = (
    <span className={styles.cart}>
      <Link to="/cart">Cart &nbsp;
        <img src={shoppingCart}  alt='logo' className='h-10' />
        <p>{carTotalQuantity}</p>
      </Link>
    </span>
  );

 return(
  <header className={scrollPage ? `${styles.fixed}` : null }>
    <div className={styles.header}>
      {logo}
      <nav className={ showMenu ? `${styles["show-nav"]}` : `${styles["hide-nav"]}`}>
        <div className={ showMenu ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}` : `${styles["nav-wrapper"]}`} onClick={hideMenu}></div>
        <ul onClick={hideMenu}>
          <li className={styles["logo-mobile"]}>
            {logo}
            <img src={hidemenuicon} alt='hidemenu' className='h-8'  onClick={hideMenu}/>
          </li>
          <li>
            <AdminOnlyLink>
              <NavLink to="/admin/home" className={activeLink}>
                  Admin  
              </NavLink>
            </AdminOnlyLink>
          </li>
          <li>
            <NavLink to="/" className={activeLink}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className={activeLink}>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={activeLink}>
              Contact Us
            </NavLink>
          </li>
        </ul>
        
        <div className={styles["header-right"]} onClick={hideMenu}>
        <img src={userimg} alt='userimg'  className='h-12'/>
          <span className={styles.links}>
              <ShowOnLogout>
                <NavLink to="/login" className={activeLink}>
                  Login
                </NavLink>
              </ShowOnLogout>
              
              <ShowOnLogin> 
                <a href='#home' style={{color : "#ff7722"}}>                 
                    hi , {userName}
                </a>
              </ShowOnLogin>

              <ShowOnLogin>
                <NavLink  to="/order-history" className={activeLink}> 
                  My Orders
                </NavLink >
              </ShowOnLogin>
              <ShowOnLogin>
                <NavLink  to="/" onClick={logoutUser} >
                    Logout
                </NavLink>
              </ShowOnLogin>
          </span>
          {cart}
        </div>
      </nav>

      <div className={styles["menu-icon"]}>
        {cart}
      </div>
    </div>
  </header>
  )
}
