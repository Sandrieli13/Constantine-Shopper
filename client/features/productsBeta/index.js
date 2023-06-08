import { Box, Button, Container, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts, selectProducts } from "../products/productsSlice";
import { Link, Routes, Route, useParams, useNavigate } from "react-router-dom";
import DeleteProduct from "../products/DeleteProduct";
import { fetchCart, addToCart, selectCart } from "../cart/cartSlice";
import SingleProduct from "./SingleProduct";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import SingleProductDesktop from "./SingleProductDesktop";
import { ProductAddToCart, ProductStyle } from "../../styles/product"


export default function Products() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const products = useSelector(selectProducts);
  const isAdmin = useSelector((state) => state.auth.me.isAdmin);
  const user = useSelector((state) => state.auth.me)
  const cart = useSelector(selectCart)
  const { cartInfo, orderItems } = cart

  const [addedItem, setAddedItem] = useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchCart(user.id))
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCart(user.id))
  }, [user, addedItem])

  // const handleAddToCart = (productId) => {
  //   const newOrder = {
  //     id: user.id,
  //     quantity: 1,
  //     productId,
  //     orderId: cartInfo.id,
  //   }
  //   dispatch(addToCart(newOrder))
  //   setAddedItem(true)
  // }
  // const [showOptions, setShowOptions] = useState(false);
  
  // const handleMouseEnter = () => {
  //   setShowOptions(true);
  // };
  // const handleMouseLeave = () => {
  //   setShowOptions(false);
  // };

  const renderProducts = products.map((product) => (
    <Grid item key={product.id} xs={2} sm={4} md={4} display="flex" flexDirection={'column'} alignItems="center">
      {matches ? (
        <>
        <SingleProduct product={product} matches={matches} />
        {isAdmin ? (
            <DeleteProduct className="deleteButton" product={product} />
          ) : (
            ""
          )}
          </>
      ) : (
        
        <SingleProductDesktop product={product} matches={matches} />

      )}
    </Grid>
  ));
  return (
    <Container>
    {isAdmin ? <Link to="/products/add">Add a Product</Link> : ""}
      <Grid        
        container
        spacing={{ xs: 2, md: 3 }}
        justifyContent="center"
        sx={{ margin: `20px 4px 10px 4px` }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {renderProducts}
      </Grid>
    </Container>
  );
}