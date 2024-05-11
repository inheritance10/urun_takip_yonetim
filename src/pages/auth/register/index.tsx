import {useState, Fragment, ChangeEvent, MouseEvent, ReactNode} from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import {styled, useTheme} from '@mui/material/styles'
import MuiCard, {CardProps} from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, {FormControlLabelProps} from '@mui/material/FormControlLabel'
import themeConfig from 'src/configs/themeConfig'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import axios from 'axios'
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import {useRouter} from "next/router";
import baseApi from "../../../axios/baseApi";
// @ts-ignore
import {GetServerSideProps} from "../../../../next";
import cookie from "cookie";

interface State {
  name: string
  surname: string
  email: string
  password: string
  showPassword: boolean
}

const Card = styled(MuiCard)<CardProps>(({theme}) => ({
  [theme.breakpoints.up('sm')]: {width: '28rem'}
}))

const LinkStyled = styled('a')(({theme}) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({theme}) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const RegisterPage = () => {
  const [values, setValues] = useState<State>({
    name: '',
    surname: '',
    email: '',
    password: '',
    showPassword: false
  })

  const {push} = useRouter()

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({...values, [prop]: event.target.value})
  }

  const handleClickShowPassword = () => {
    setValues({...values, showPassword: !values.showPassword})
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleRegister = async () => {
    const body = {
      name: values.name,
      surname: values.surname,
      email: values.email,
      password: values.password
    }
    try {
      if (!body.name || !body.surname || !body.email || !body.password) {
        alert('Tüm alanlar zorunludur!')
        return
      }
      const response = await baseApi.post('/auth/register', body)
      if (response.status === 201) {
        push('/auth/login')
      }
      console.log('Registration successful!')
    } catch (error: any) {
      alert(error.response.data.message)
      console.error('Registration failed:', error)
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{zIndex: 1}}>
        <CardContent sx={{padding: theme => `${theme.spacing(12, 9, 7)} !important`}}>
          <Box sx={{mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              URUN YONETIM
            </Typography>
          </Box>
          <Box sx={{mb: 6}}>
            <Typography variant='h5' sx={{fontWeight: 600, marginBottom: 1.5}}>UYE OL</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <TextField autoFocus fullWidth id='name' label='Name' value={values.name} onChange={handleChange('name')}
                       sx={{marginBottom: 4}}/>
            <TextField autoFocus fullWidth id='surname' label='Surname' value={values.surname}
                       onChange={handleChange('surname')} sx={{marginBottom: 4}}/>
            <TextField fullWidth type='email' label='Email' value={values.email} onChange={handleChange('email')}
                       sx={{marginBottom: 4}}/>
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-register-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-register-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline fontSize='small'/> : <EyeOffOutline fontSize='small'/>}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Button
              fullWidth
              size='large'
              type='submit'
              variant='outlined'
              sx={{marginBottom: 7, marginTop: 7}}
              onClick={handleRegister}
            >
              Kayıt Ol
            </Button>
            <Box sx={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center'}}>
              <Typography variant='body2' sx={{marginRight: 2}}>Already have an account?</Typography>
              <Typography variant='body2'>
                <Link passHref href='/auth/login'><LinkStyled>Sign in</LinkStyled></Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>


export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const {req} = context;
  const cookies = cookie.parse(req.headers.cookie || ''); // cookies nesnesini oluştur

  const token = cookies['token'];

  if (token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }


  return {
    props: {},
  };
};

export default RegisterPage
