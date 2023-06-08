import React from "react";
import { useEffect, useState } from "react";
import {
  ExtraActionsWrapper,
  ProductStyle,
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

export default function SingleProduct({ product, matches }) {
  const [ProductDetailDialog, showProductDetailDialog, closeProductDialog] =
    useDialogModal(ProductDetail);

  const [addedItem, setAddedItem] = useState(false)
  const [showOptions, setShowOptions] = useState(false);
  const user = useSelector((state) => state.auth.me);
  const dispatch = useDispatch();
  const cart = useSelector(selectCart)
  const { cartInfo, orderItems } = cart
  const handleMouseEnter = () => {
    setShowOptions(true);
  };
  const handleMouseLeave = () => {
    setShowOptions(false);
  };

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

  return (
    <>
      <ProductStyle onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <ProductImage src={product.imgUrl} />
        <ProductMeta product={product} matches={matches} />
        <ProductActionsWrapper>
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
      <ProductAddToCart variant="contained" onClick={() => handleAddToCart(product.id)}>Add to cart</ProductAddToCart>
      <ProductDetailDialog product={product} />
    </>
  );
}
