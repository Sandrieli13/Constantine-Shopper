import React, { useState } from "react";
import {
  ProductStyle,
  ExtraActionsWrapper,
  ProductActionButton,
  ProductActionsWrapper,
  ProductAddToCart,
  ProductImage,
  ProductMetaWrapper,
} from "../../styles/product";
import { Stack, Tooltip, Typography } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import useDialogModal from "../../hooks/useDialogModal";
import ProductDetail from "../productdetail";
import ProductMeta from "./ProductMeta";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, addToCart, selectCart } from "../cart/cartSlice";
import DeleteProduct from "../products/DeleteProduct";
import { selectMe } from '../auth/authSlice'

export default function SingleProductDesktop({ product, matches }) {
  const [ProductDetailDialog, showProductDetailDialog, closeProductDialog] =
    useDialogModal(ProductDetail);
  const isAdmin = useSelector((state) => state.auth.me.isAdmin);
  const cart = useSelector(selectCart)
  const { cartInfo, orderItems } = cart
  const [addedItem, setAddedItem] = useState(false)
  const user = useSelector(selectMe)
  const dispatch = useDispatch()
  const handleAddToCart = (productId) => {
    const newOrder = {
      id: user.id,
      quantity: 1,
      productId,
      orderId: cartInfo.id,
    }
    dispatch(addToCart(newOrder))
    setAddedItem(true)
  }
  const [showOptions, setShowOptions] = useState(false);
  
  const handleMouseEnter = () => {
    setShowOptions(true);
  };
  const handleMouseLeave = () => {
    setShowOptions(false);
  };
  

  return (
    <>
      <ProductStyle onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <ProductImage src={product.imgUrl} />
        {(showOptions || matches) && (<div>
        <ProductAddToCart variant="contained" onClick={() => handleAddToCart(product.id)}>
            Add to cart</ProductAddToCart>
            {isAdmin ? (
                <DeleteProduct className="deleteButton" product={product} />
              ) : (
                ""
              )}</div>)}
        <ProductActionsWrapper show={showOptions || matches}>
          <Stack direction={matches ? "row" : "column"}>
            <ProductActionButton>
              <Tooltip placement="left" title="share this product">
                <ShareIcon color="primary" />
              </Tooltip>
            </ProductActionButton>
            <ProductActionButton onClick={() => showProductDetailDialog()}>
              <Tooltip placement="left" title="Full view">
                <FitScreenIcon color="primary" />
              </Tooltip>
            </ProductActionButton>
          </Stack>
        </ProductActionsWrapper>
      </ProductStyle>
      <ProductMeta product={product} />
      <ProductDetailDialog product={product} />
    </>
  );
}