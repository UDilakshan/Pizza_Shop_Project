import React, {useEffect} from 'react';
import {Banners, Recommended, Offers, MainLoader} from '../components';
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../api';
import { setAllProducts } from '../context/actions/productActions';


function HomeContainer() {

  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(!products){
      <MainLoader />
      getAllProducts().then((data) =>{
        dispatch(setAllProducts(data));
      })
    }
  }, [])

  return (
    <div className='backgroundHome backdrop-blur-md pt-28'>
        <div className='w-full pb-40'>
       <Banners /> 
       <Offers />
       <Recommended/> 
    </div>
    </div>
    
  )
}

export default HomeContainer