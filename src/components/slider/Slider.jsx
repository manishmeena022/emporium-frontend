import React, { useEffect, useState } from 'react'
import lefticon from "../../assets/images/left-chevron.png";
import righticon from "../../assets/images/right-chevron.png";
import { sliderData }from "./slider-data";
import "./Slider.scss";

export const Slider = () => {
  const [ currentSlide, setCurrentSlide] = useState(0);
  const slideLength = sliderData.length;

  const autoScroll = true;
  let slideInterval;
  let intervalTime = 5000;

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slideLength - 1  ? 0 :  currentSlide + 1);
  }
  
  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slideLength - 1 :  currentSlide - 1);
  }

  useEffect(() => {
    setCurrentSlide(0)
  },[])

  
  useEffect ( () => {
    if(autoScroll){
      const auto =() =>{
        slideInterval = setInterval(nextSlide,intervalTime)
      };
      auto();
    }
    return () => clearInterval(slideInterval)
  },[currentSlide , slideInterval , autoScroll ]);

  return (
    <div className='slider'>
        <img src={lefticon} alt='lefticon' className='arrow prev' onClick={prevSlide} />
        <img src={righticon} alt='righticon' className='arrow next' onClick={nextSlide} />

      {sliderData.map((slide,index) => {
        const {image, heading , desc} = slide
        return(
          <div key={index} className={index === currentSlide ? "slide current" : "slide"}>
            {index === currentSlide && (
              <>
                <img src={image} alt='slide' />
                <div className='content' >
                  <h2>{heading}</h2>
                  <p>{desc}</p>
                  <hr />
                  <a href='#product' className='--btn --btn-primary'>Buy now</a>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

