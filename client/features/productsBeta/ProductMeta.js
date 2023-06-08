import React from "react";
import { Typography } from "@mui/material";
import { ProductMetaWrapper } from "../../styles/product";
import { Link } from "react-router-dom";
export default function ProductMeta({ product, matches }) {
    return (
      <ProductMetaWrapper>
        <Typography variant={matches ? "h6" : "h5"} lineHeight={2}>
          <Link style={{ textDecoration: 'none', color: 'inherit', fontFamily: 'sans-serif' }} to={`/products/${product.id}`}>{product.name}</Link>
        </Typography>
        <Typography variant={matches ? "caption" : "body1"}>
          ${product.price}
        </Typography>
      </ProductMetaWrapper>
    );
}