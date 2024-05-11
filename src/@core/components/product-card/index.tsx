import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {ProductCardProps} from "./types";
import baseApi from "../../../axios/baseApi";
import {useEffect, useState} from "react";

export default function ProductCard(props: {data: ProductCardProps}) {
  const {data} : any  = props;
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const user = localStorage.getItem('user');
    const userObj = JSON.parse(user || '{}');
    setUserId(userObj?.id);
  }, []);


  const addToCart = async (id: string) => {
    try {
      const body = {
        productId: id,
        userId: userId,
      }
      const response = await baseApi.post("/cart", body);
      if(response.status === 200) {
        alert(response?.data?.message || "Product added to cart")
        localStorage.setItem('user_cart', JSON.stringify(response?.data?.data))
        window.location.reload()
      }else {
         alert(response?.data?.message || "Something went wrong")
      }
    }catch (e: any) {
      console.log(e);
      alert(e?.response?.data?.message)
    }
  }



  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={data.file_path}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {data?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: {data?.price}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stock: {data?.stock}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location: {data?.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Model: {data?.model}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No: {data?.no}
        </Typography>

      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => addToCart(data.id)}>Add To Cart</Button>
      </CardActions>
    </Card>
  );
}
