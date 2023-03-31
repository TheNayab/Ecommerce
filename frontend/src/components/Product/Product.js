import React, { useState } from "react";
import "./Product.css";
import ProductCard from "../Home/ProductCard.js";
import { clearErrors, getProduct } from "../../actions/productActions";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Loader from "../layout/loader/loader.js";
import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
// import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

const Product = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const [currentPage, setcurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 25000]);
  const dispatch = useDispatch();
  const {
    loading,
    error,
    products,
    productCount,
    resultPerPage,
  } = useSelector((state) => state.products);
  const { keyword } = useParams();

  const setCurrentPageNo = (e) => {
    setcurrentPage(e);
  };
  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };
  // const fetchMoreData = async () => {
  //   setcurrentPage(currentPage + 1);
  // };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price));
  }, [dispatch, error, alert, keyword, currentPage, price]);


  return (
    <>
      {/* <InfiniteScroll
        dataLength={products.length}
        next={fetchMoreData}
        hasMore={products.length != productCount}
        loader={<Loader />}
      > */}
      {loading ? (
        <Loader />
      ) : (
        <>
          <h2 className="productsHeading">Products</h2>
          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
          <div className="filterBox">
            <Typography> Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-lavelladby="range-slider"
              min={0}
              max={25000}
            />
          </div>
          {/* </InfiniteScroll> */}
          {resultPerPage < productCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Product;
