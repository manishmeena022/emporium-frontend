import React from 'react';
import styles from "./NotFound.module.scss";
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className={styles["not-found"]}>
        <div>
            <h2>404</h2>
            <p>Oppppssss, Page not found.</p>
            <button className='--btn'>
                <Link to="/">
                    &larr;Back to Home
                </Link>
            </button>
        </div>
    </div>
  )
}
