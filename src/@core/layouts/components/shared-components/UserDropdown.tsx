// ** React Imports
import {useState, SyntheticEvent, Fragment, useEffect} from 'react'

// ** Next Import
import {useRouter} from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import CogOutline from 'mdi-material-ui/CogOutline'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import {useAuth} from 'src/@core/context/AuthContext'

// ** Styled Components
const BadgeContentSpan = styled('span')(({theme}) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = () => {
  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const user = localStorage.getItem('user');
    const userObj = JSON.parse(user || '{}');
    console.log(userObj.name)
    setUser(userObj)
  },[])

  // ** Hooks
  const router = useRouter()
  const {logout} = useAuth()

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    logout().then(() => {
      router.push('/auth/login')
    })
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  return user && (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ml: 2, cursor: 'pointer'}}
        badgeContent={<BadgeContentSpan/>}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      >
        <Avatar
          alt={user?.name || 'İsimsiz'}
          onClick={handleDropdownOpen}
          sx={{width: 40, height: 40}}
          src='/images/avatars/1.png'
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{'& .MuiMenu-paper': {width: 230, marginTop: 4}}}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
      >
        <Box sx={{pt: 2, pb: 3, px: 4}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan/>}
              anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            >
              <Avatar alt={user.name + ' ' + user.surname} src='/images/avatars/1.png' sx={{width: '2.5rem', height: '2.5rem'}}/>
            </Badge>
            <Box sx={{display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column'}}>
              <Typography sx={{fontWeight: 600}}>{user.name + ' ' + user.surname}</Typography>
              <Typography variant='body2' sx={{fontSize: '0.8rem', color: 'text.disabled'}}>
                {
                  user.role === 0 ? 'Admin' : 'Satış Elemanı'
                }
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{mt: 0, mb: 1}}/>
        <MenuItem sx={{py: 2}} onClick={() => handleDropdownClose()}>
          <LogoutVariant sx={{marginRight: 2, fontSize: '1.375rem', color: 'text.secondary'}}/>
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
