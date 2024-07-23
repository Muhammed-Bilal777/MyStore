import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductDetailsQuery } from "../../../Redux_Store/api/productApis";
import toast from "react-hot-toast";
import { Loader } from "../layout/Loader";
import StarRatings from "react-star-ratings";
export const ProductDeails = () => {
  const params = useParams();

  const { data, isError, isLoading, error, isSuccess } =
    useGetProductDetailsQuery(params?.id);
  const product = data?.product;

  const [activeImg, setActiveImg] = useState("");

  useEffect(() => {
    setActiveImg(
      product?.images[0]
        ? product?.images[0].url
        : "/images/default_product.png"
    );
  }, [product]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      toast.success("Product details fetched successfully");
    }
  }, [isError]);

  if (isLoading) return <Loader />;

  return (
    <div className="row d-flex justify-content-around">
      <div className="col-12 col-lg-5 img-fluid" id="product_image">
        <div className="p-3 border rounded">
          <img
            className="d-block w-100"
            src={activeImg}
            alt={product.name}
            width="340"
            height="390"
          />
        </div>
        <div className="row justify-content-evenly mt-5  ">
          {product?.images?.map((img) => (
            <div className="col-2 ms-1 mt-2 w-auto">
              <a role="button">
                <img
                  className={`d-block border rounded p-3 cursor-pointer   ${
                    img.url === activeImg ? "border-success" : ""
                  }`}
                  height="100"
                  width="100"
                  src={img.url}
                  alt={img.url}
                  onClick={(e) => setActiveImg(img.url)}
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 col-lg-5 mt-5">
        <h3>{product?.name}</h3>
        <p id="product_id">ID : {product?._id}</p>

        <hr />

        <div className="d-flex">
          <StarRatings
            rating={product?.ratings}
            starRatedColor="#ffb829"
            starDimension="20px"
            numberOfStars={5}
            name="rating"
            starSpacing="1px"
          />
          <span id="no-of-reviews" className="pt-1 ps-2">
            {product?.numOfReviews}
          </span>
        </div>
        <hr />

        <p id="product_price">${product?.price}</p>
        <div className="stockCounter d-inline">
          <span className="btn btn-danger minus">-</span>
          <input
            type="number"
            className="form-control count d-inline"
            value="1"
            readOnly
          />
          <span className="btn btn-primary plus">+</span>
        </div>
        <button
          type="button"
          id="cart_btn"
          className="btn btn-primary d-inline ms-4"
          disabled=""
        >
          Add to Cart
        </button>

        <hr />

        <p>
          Status:{" "}
          <span
            id="stock_status"
            className={product?.stock > 0 ? "greenColor" : "redColor"}
          >
            {product?.stock > 0 ? "In Stock" : "Out Of Stock"}
          </span>
        </p>

        <hr />

        <h4 className="mt-2">Description:</h4>
        <p>{product?.description}</p>
        <hr />
        <p id="product_seller mb-3">
          Sold by: <strong>{product?.seller}</strong>
        </p>

        <div className="alert alert-danger my-5" type="alert">
          Login to post your review.
        </div>
      </div>
    </div>
  );
};
