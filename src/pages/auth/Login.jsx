import React, { useState } from 'react'
import { Link ,useNavigate } from 'react-router-dom'
import { Card } from '../../components/card/Card'
import { GoogleAuthProvider, signInWithEmailAndPassword , signInWithPopup} from 'firebase/auth'
import { auth } from '../../firebase/config';
import { Loader } from '../../components/loader/Loader';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectPreviousURL } from '../../redux/slice/cartSlice';
import styles from "./auth.module.scss";
import google from "../../assets/images/google.png";
import loginimg from "../../assets/images/login.png";

export const Login = () => {
  const [ email, setEmail] = useState("")
  const [ password, setPassword] = useState("")
  const [ isLoading,setIsLoading] = useState(false)
  
  const previousURL = useSelector(selectPreviousURL)
  const navigate = useNavigate()

  const redirectUser = () => {
    if(previousURL.includes("cart")){
      return navigate("/cart")
    }
    navigate("/")
  }

  

  const loginUser =(e)=>{
    e.preventDefault()
    setIsLoading(true)

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      //const user = userCredential.user;
      setIsLoading(false)
      //setIsLoggedIn(true);
      toast.success("Login Successful....")
      redirectUser()
    })
    .catch((error) => {
      setIsLoading(false)
      toast.error(error.message)
    });
  }

  //login with Google
  const provider =  new GoogleAuthProvider()
  const signInWithGoogle = (e) => {
    signInWithPopup(auth, provider)
    .then((result) => {
      //const user = result.user;
      toast.success("Login Successfully.")
      redirectUser()
      
    }).catch((error) => {
      toast.error(error.message)
    });
  }

  return (
    <>
      {isLoading && <Loader />}
      <section className={`container ${styles.auth}`}>
        <div className={styles.img}>
          <img src={loginimg} alt="Login" width="400" />
        </div>

        <Card>
          <div className={styles.form}>
            <h2>Login</h2>

            <form onSubmit={loginUser}>
              <input
                type="text"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="--btn --btn-primary --btn-block">
                Login
              </button>
              <div className={styles.links}>
                <Link to="/reset">Reset Password</Link>
              </div>
              <p>-- or --</p>
            </form>
            <button
              className="--btn --btn-danger --btn-block"
              onClick={signInWithGoogle}
            > 
              <img src={google} alt='googleicon' className='h-10'/>
              &nbsp;
              Login With Google
            </button>
            <span className={styles.register}>
              <p>Don't have an account?</p>
              <Link to="/register">Register</Link>
            </span>
          </div>
        </Card>
      </section>
    </>
  )
}
