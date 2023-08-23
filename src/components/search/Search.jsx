import React from 'react'
import styles from "./Search.module.scss";

export const Search = ({ value, onChange }) => {
  return (
    <div className={styles.search}>
        <input type='text' placeholder='Search by name' value={value}  onChange={onChange} />
    </div>
  )
}
