import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../api";
import { setAllProducts } from "../context/actions/productActions";
import { CChart } from "@coreui/react-chartjs";

const DBHome = () => {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const drinks = products?.filter((item) => item.product_category === "drinks");
  const non_veg_pizza = products?.filter((item) => item.product_category === "non veg pizza");
  const starters = products?.filter((item) => item.product_category === "starters");
  const dessert = products?.filter((item) => item.product_category === "dessert");
  const premium_non_veg = products?.filter((item) => item.product_category === "premium non veg");

  useEffect(() => {
    if (!products) {
      getAllProducts().then((data) => {
        dispatch(setAllProducts(data));
      });
    }
  }, [products, dispatch]);

  return (
    <div className='flex items-center justify-center flex-col pt-6 w-full h-full'>
      <div className='grid w-full grid-cols-1 md:grid-cols-2 gap-4 h-full'>
        <div className='flex items-center justify-center gap-8 ml-4'>
          <div className='w-full md:w-2/3 lg:w-1/2 mb-6'>
            <CChart
              type="bar"
              data={{
                labels: ["drinks", "non_veg_pizza", "starters", "dessert", "premium_non_veg"],
                datasets: [
                  {
                    label: 'O Pizza Monthly Sales',
                    backgroundColor: '#f87979',
                    data: [drinks?.length, non_veg_pizza?.length, starters?.length, dessert?.length, premium_non_veg?.length],
                  },
                ],
              }}
              labels="months"
            />
          </div>

          <div className='w-full md:w-2/3 lg:w-1/2'>
            <CChart
              type="doughnut"
              data={{
                labels: ['Orders', 'Cancellend', 'Delivered' ],
                datasets: [
                  {
                    backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
                    data: [40, 20,20 ]
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBHome;
