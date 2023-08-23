import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import styles from "./Contact.module.scss";
import { Card } from '../../components/card/Card';

import oldphone from "../../assets/images/old-typical-phone.png";
import email from "../../assets/images/email.png";
import location from "../../assets/images/location.png";
import twitter from "../../assets/images/twitter.png";
import { toast } from 'react-toastify';

export const Contact = () => {
  const form = useRef();


  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(process.env.REACT_APP_EMAILJS_SERVICE_ID, 'template_94khots', form.current, 'Kc7ja4nCvLI2IkFBgXuje')
      .then((result) => {
        toast.success("Message send successfully");
      }, (error) => {
        toast.success(error.text);
      });
      e.target.reset();
  }
  return (
    <section>
      <div className={`container ${styles.contact}`}>
        <h2>Contact</h2>
        <div className={styles.section}>
          <form ref={form} onSubmit={sendEmail}>
            <Card cardClass={styles.card}>
              <label>Name:</label>
              <input type="text" name="user_name" placeholder='Full Name' required />
              <label>Email:</label>
              <input type="email" name="user_email" placeholder='Your active email' required />
              <label>Subject:</label>
              <input type="text" name="subject" placeholder='Subject' required />
              <label>Your Message:</label>
              <textarea name='message' cols="30" rows="10"></textarea>
              <button className='--btn --btn-primary'>Send Message</button>
            </Card>
          </form>
          <div className={styles.details}>
            <Card cardClass={styles.card2}>
              <h3>Our Contact Information</h3>
              <p>Fill the form or conatct us via other channels listed below</p>
              <div className={styles.icons}>
                <span>
                  <img src={oldphone} alt="phone" className='h-7'/>
                  <p>+91 987654321</p>
                </span>
                <span>
                  <img src={email} alt="email" className='h-7'/>
                  <p> emporium@gmail.com</p>
                </span>
                <span>
                  <img src={location} alt="location" className='h-7'/>
                  <p>Dwarka, Delhi</p>
                </span>
                <span>
                  <img src={twitter} alt="twitter" className='h-7'/>
                  <p> @Emporium </p>
                </span>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </section>
  )
}
