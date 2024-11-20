import React, { useEffect } from 'react';
import { Banners, Recommended, Offers, MainLoader, FullMenuContainer } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../api';
import { setAllProducts } from '../context/actions/productActions';

function HomeContainer() {

  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!products) {
      getAllProducts().then((data) => {
        dispatch(setAllProducts(data));
      });
    }
  }, [dispatch, products]);

  return (
    <div className="backdrop-blur-md pt-32">
      {/* Make sure no header here */}
      <div className="w-full gap-8">
        <Banners />
        <Offers />
        <Recommended />
      </div>
    </div>
  );
}

export default HomeContainer;
