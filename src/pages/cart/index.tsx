// pages/sepetim.js

import {useState} from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
// @ts-ignore
import {GetServerSideProps} from 'next';
import cookie from 'cookie';
import baseApi from '../../axios/baseApi';
import Card from "@mui/material/Card";

// @ts-ignore
const Sepetim = ({cart}) => {
  const [cartItems, setCartItems] = useState(cart);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);


  const removeFromCart = async (id: any) => {
    // Sepetten ürünü kaldır
    await baseApi.delete(`cart/${id}`);
    setCartItems(cartItems.filter((item: any) => item.product_id !== id));
    localStorage.setItem('user_cart', JSON.stringify(cartItems.filter((item: any) => item.product_id !== id)));
    window.location.reload();
  };

  const getTotalPrice = (): any => {
    let total = 0;
    cartItems.forEach((item: any) => {
      total += item.productPrice * item.quantity;
    });
    return total;
  };

  const handleBuy = async () => {
    try {
      const user = localStorage.getItem('user');
      const userObj = JSON.parse(user || '{}');
      const body = {
        userId: userObj?.id,
        cartItems
      }
      const response = await baseApi.post("/order", body);
      if(response.status === 200) {
        alert(response?.data?.message || "Order is successful")
        localStorage.setItem('user_cart', JSON.stringify([]))
        window.location.reload()
      }
    }catch (e: any) {
      console.log(e);
      alert(e?.response?.data?.message)
    }
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Sepetim
      </Typography>
      <Card>
        {cartItems.length > 0 ? (

          <Grid container spacing={2} style={{padding: 12}}>
            {cartItems.map((item: any, index: number) => (
              <Grid item xs={12} key={item.id}>
                <Typography variant="subtitle1">
                  <img src={item.file} alt={item.productName}
                       style={{marginRight: '16px', width: '50px', height: 'auto'}}/>
                  {item.productName} - {item.productPrice * item.quantity } TL - {item.quantity} adet
                  <IconButton onClick={() => removeFromCart(item.product_id)}>
                    <DeleteIcon/>
                  </IconButton>
                </Typography>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Typography variant="h6">
                Toplam: {getTotalPrice()} TL
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={() => handleBuy()} variant="contained" color="primary" fullWidth>
                Satın Al
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="subtitle1" align="center">
            Sepetiniz boş.
          </Typography>
        )}
      </Card>

    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { req } = context;
  const cookies = cookie.parse(req.headers.cookie || '');

  const token = cookies['token'];

  if (!token) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  try {
    const response = await baseApi.get('cart', {
      headers: {
        Authorization: token
      },
    });

    const cart = response.data;
    const groupedCartItems: any[] = [];

    cart.forEach((item: any) => {
      // Gruplanmış sepetteki ürünler listesi oluştur
      const existingItem = groupedCartItems.find((groupedItem) => groupedItem.product_id === item.product_id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        groupedCartItems.push({ ...item, quantity: 1 });
      }
    });

    return {
      props: {
        cart: groupedCartItems,
      },
    };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return {
      props: {
        cart: [],
      },
    };
  }
};

export default Sepetim;
