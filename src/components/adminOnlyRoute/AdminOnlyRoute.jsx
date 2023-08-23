import React from 'react';
import { useSelector } from 'react-redux';
import { selectEmail } from '../../redux/slice/authSlice';
import { Link } from 'react-router-dom';

export const AdminOnlyRoute = ({children}) => {
    const userEmail = useSelector(selectEmail)

    if(userEmail === process.env.REACT_APP_ADMIN_USER){
        return children;
    }
    return (
        <section className={{ height : "80vh" }}>
            <div className='container'>
                <h2>Access Denied</h2>
                <p>This page can only be accessed by Admin user !</p>
                <br />
                <Link to="/">
                <button className="--btn">&larr; Back To Home </button>
                </Link>
            </div>
        </section>
    );
};

export const AdminOnlyLink = ({children}) => {
    const userEmail = useSelector(selectEmail)

    if(userEmail === process.env.REACT_APP_ADMIN_USER){
        return children;
    }
    return null;
}
