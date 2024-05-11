import TableCustomized from "../../views/tables/TableCustomized";
import {useEffect, useState} from "react";
import baseApi from "../../axios/baseApi";
// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import {styled} from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow, {TableRowProps} from '@mui/material/TableRow'
import TableCell, {TableCellProps, tableCellClasses} from '@mui/material/TableCell'
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {ThemeColor} from "../../@core/layouts/types";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// @ts-ignore
import {GetServerSideProps} from "../../../next";
import cookie from "cookie";
import Chip from "@mui/material/Chip";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  applied: {color: 'info'},
  rejected: {color: 'error'},
  current: {color: 'primary'},
  resigned: {color: 'warning'},
  professional: {color: 'success'}
}
const StyledTableCell = styled(TableCell)<TableCellProps>(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)<TableRowProps>(({theme}) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },

  // hide last border
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}))

const Orders = () => {
  const [data, setData] = useState<[]>([])
  const [open, setOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [role, setRole] = useState<any>(null)

  useEffect(() => {
    const user = localStorage.getItem('user');
    const userObj = JSON.parse(user || '{}');
    setRole(userObj.role)

    const fetchData = async () => {
      const response = await baseApi.get('/order')
      setData(response.data)
    }
    fetchData()
  }, []);


  const getDateFormat = (date: string) => {
    const newDate = new Date(date)
    return newDate.toLocaleDateString()
  }

  const getStatusBadge = (status: number) => {
    if (status === 0) {
      return (
        <Chip label="Onay Bekliyor" color="warning"/>
      )
    } else if (status === 1) {
      return (
        <Chip label="Onaylandı" color="success"/>
      )
    } else {
      return (
        <Chip label="Reddedildi" color="error"/>
      )
    }
  }

  const handleConfirmedOrder = async (row: any, status: number, type: string) => {
    const body = {
      status: status,
      role: role,
      product_id: row.id,
      quantity: row.quantity
    }

    const response = await baseApi.put(`/order/${row.order_id}`, body)
    if (response.status == 200 && type === 'confirm') {
      alert('Sipariş onaylandı');
      window.location.reload();
    } else if (response.status == 200 && type === 'unconfirm') {
      alert('Sipariş reddedildi');
      window.location.reload();
    }
  }


  return (
    <div>
      <Card>
        <TableContainer>
          <Table sx={{minWidth: 800}} aria-label='table in dashboard'>
            <TableHead>
              <TableRow>
                <TableCell>File</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Status</TableCell>
                {
                  role === 0 && <TableCell>Action</TableCell>
                }

              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row: any) => (
                <TableRow hover key={row.name} sx={{'&:last-of-type td, &:last-of-type th': {border: 0}}}>
                  <TableCell>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                      <Box
                        component='img'
                        src={row.file_path}
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell sx={{py: theme => `${theme.spacing(0.5)} !important`}}>
                    <Typography sx={{fontWeight: 500, fontSize: '0.875rem !important'}}>{row.name}</Typography>
                  </TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.total_price}</TableCell>
                  <TableCell>{getDateFormat(row.order_date)}</TableCell>
                  <TableCell>{row.model}</TableCell>
                  <TableCell>{row.no}</TableCell>


                  <TableCell>{row.gender === '0' ? 'erkek' : 'kadın'}</TableCell>
                  <TableCell>{getStatusBadge(row.status)}</TableCell>
                  {
                    role === 0 && (
                      <TableCell>
                        <CheckIcon color='primary' style={{cursor: "pointer"}}
                                   onClick={() => {
                                     if (row.status === 3 || row.status === 0){
                                       handleConfirmedOrder(row, 1, 'confirm')
                                     } else if (row.status === 1) {
                                       alert('Bu sipariş zaten onaylandı')
                                     }
                                   }}/>
                        <ClearIcon color='error' style={{cursor: "pointer"}}
                                   onClick={() => {
                                      if (row.status === 1 || role.status === 0) {
                                        handleConfirmedOrder(row, 3, 'unconfirm')
                                      } else if (row.status === 3) {
                                        alert('Bu sipariş zaten reddedildi')
                                      }
                                   }}/>
                      </TableCell>
                    )
                  }

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
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
export default Orders;
