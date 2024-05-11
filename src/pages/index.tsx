import Grid from '@mui/material/Grid';
import ProductCard from "../@core/components/product-card";
import { useEffect, useState } from 'react';
import baseApi from 'src/axios/baseApi';
// @ts-ignore
import { GetServerSideProps } from "next";
import cookie from 'cookie'; // cookie-parser yerine cookie modülünü kullanıyoruz

// @ts-ignore
const Dashboard = ({ products }) => {
  return (
    <Grid container spacing={3}>
      {products.map((product: any, index: any) => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
          <ProductCard data={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { req } = context;
  const cookies = cookie.parse(req.headers.cookie || ''); // cookies nesnesini oluştur

  const token = cookies['token'];

  if (!token) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  // Örnek: API'den ürünleri alın
  const response = await baseApi.get('products-api');
  const products = response.data;

  return {
    props: {
      products,
    },
  };
};

export default Dashboard;
