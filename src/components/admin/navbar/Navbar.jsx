import React from 'react';
import styles from "./Navbar.module.scss";
import { useSelector } from 'react-redux';
import { selectUserName } from '../../../redux/slice/authSlice';
import user from "../../../assets/images/user.png";
import { NavLink } from 'react-router-dom';


const activeLink= ({isActive}) => (isActive ? `${styles.active}` : "");

export const Navbar = () => {
  const userName = useSelector(selectUserName);
  return(
    <div className={styles.navbar}>
      <div className={styles.user}>
          <img src={user} alt='user' className='h-20'/>
          <h4> {userName} </h4>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/admin/home" className={activeLink}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/all-products" className={activeLink}>
              All Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/add-product/ADD" className={activeLink}>
              Add Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" className={activeLink}>
              Orders
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  )
}
