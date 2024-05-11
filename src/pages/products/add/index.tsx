import {useEffect, useRef, useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Select from "@mui/material/Select";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import baseApi from "../../../axios/baseApi";
// @ts-ignore
import {GetServerSideProps} from "../../../../next";
import cookie from "cookie";

export default function Home() {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    stock: '',
    location: '',
    model: '',
    no: '',
    gender: '',
    price: 0,
  });

  const [newProductId, setNewProductId] = useState('');

  const handleChange = (e: any) => {
    const {name, value} = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const [file, setFile] = useState<any>(); //logo

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    // Dosyanın uzantısını al
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();

    // Dosyanın uzantısını kontrol et ve sadece belirli uzantılara izin ver
    if (extension && ['jpg', 'jpeg', 'png'].includes(extension)) {
      setFile(selectedFile);
    } else {
      alert('Lütfen sadece JPG, JPEG veya PNG formatında bir resim seçin.');
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    console.log(formData);

    // Dosya seçilip seçilmediğini kontrol et
    if (!file) {
      alert('Lütfen bir dosya seçin.');
      return;
    }

// Form verilerini kontrol et
    const stockRegex = /^[0-9]+$/;
    if (!stockRegex.test(formData.stock) || !formData.stock) {
      alert('Stok sadece sayı olabilir ve zorunludur');
      return;
    }

    const priceRegex = /^[0-9]+$/;
    if (!priceRegex.test(formData.price.toString()) || !formData.price) {
      alert('Fiyat sadece sayı olabilir ve zorunludur');
      return;
    }

    if(!formData.gender) {
      alert('Lütfen cinsiyet seçiniz.');
      return;
    }

    if (formData.name === '' || formData.location === '' || formData.model === '' || formData.no === '') {
      alert('Lütfen tüm alanları doldurunuz.');
      return;
    }

    // Dosya yükleme işlemini gerçekleştir


    // Ürün ekleme işlemini gerçekleştir
    const response = await baseApi.post('/products-api', {
      data: formData,
    });

    if (response.status === 201) {
      setNewProductId(response.data.id);
      alert('Ürün başarıyla eklendi');

    }


    // Form verilerini sıfırla
    setFormData({
      name: '',
      stock: '',
      location: '',
      model: '',
      no: '',
      gender: '',
      price: 0,
    });
  };

  useEffect(() => {
    if (newProductId) {
      handleFileUpload();
    }
  }, [newProductId]);

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', newProductId);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  return (
    <Container maxWidth="md">
      <Card>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Ürün Ekle
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="İsim"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stok"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Konum Bilgisi"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Numara"
                  name="no"
                  value={formData.no}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Fiyat"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel>
                  Cinsiyet
                </InputLabel>
                <Select
                  name='gender'
                  variant="outlined"
                  value={formData.gender}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="0">Erkek</MenuItem>
                  <MenuItem value="1">Kadın</MenuItem>
                </Select>
                <Grid item xs={12}>
                  <input type="file" onChange={handleFileChange}/>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Ekle
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}


export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const {req} = context;
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

  return {
    props: {},
  };
};
