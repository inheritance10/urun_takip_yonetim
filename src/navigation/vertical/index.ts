// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import {useEffect, useState} from 'react'

const navigation = (): VerticalNavItemsType => {
  const [userRole, setUserRole] = useState(0)
  useEffect(() => {
    const user = localStorage.getItem('user');
    const userObj = JSON.parse(user || '{}');
    setUserRole(userObj.role)
  }, [])

  if(userRole === 0) {
    return [
      {
        title: 'Anasayfa',
        icon: HomeOutline,
        path: '/'
      },
      /*{
        title: 'Hesap Ayarları',
        icon: AccountCogOutline,
        path: '/account-settings'
      },*/
      {
        sectionTitle: 'Ürün Yönetimi'
      },
      {
        title: 'Ürünler',
        icon: AccountCogOutline,
        path: '/products'
      },
      {
        title: 'Ürün Ekle',
        icon: AccountCogOutline,
        path: '/products/add'
      },
      {
        sectionTitle: 'Sipariş Yönetimi'
      },
      {
        title: 'Siparişler',
        icon: AccountCogOutline,
        path: '/orders'
      },
    ]
  }else {
    return [
      {
        title: 'Anasayfa',
        icon: HomeOutline,
        path: '/'
      },
      {
        sectionTitle: 'Sipariş Yönetimi'
      },
      {
        title: 'Siparişler',
        icon: AccountCogOutline,
        path: '/orders'
      }
    ]
  }


}

export default navigation
