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
import ProductModal from "./partial/Modal";
// @ts-ignore
import {GetServerSideProps} from "../../../next";
import cookie from "cookie";

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

const Products = () => {
  const [data, setData] = useState<[]>([])
  const [open, setOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  useEffect(() => {
    const fetchData = async () => {
      const response = await baseApi.get('/products-api')
      setData(response.data)
    }
    fetchData()
  }, []);

  const handleOpenModal = (row: any) => {
    setSelectedProduct(row)
    setOpen(true)
  }

  const handleClosedModal = () => {
    setOpen(false)
  }

  const handleDelete = async (id: number) => {
    const response = await baseApi.delete(`/products-api/${id}`)
    if(response.status == 200) {
      alert('Ürün başarıyla silindi');
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
                <TableCell>Name</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Action</TableCell>
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
                  <TableCell>{row.stock}</TableCell>
                  <TableCell>{row.model}</TableCell>
                  <TableCell>{row.no}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.gender === '0' ? 'erkek' : 'kadın'}</TableCell>
                  <TableCell>
                    <EditIcon color='primary' style={{cursor: "pointer"}} onClick={() => handleOpenModal(row)}/>
                    <DeleteIcon color='error' style={{cursor: "pointer"}} onClick={() => handleDelete(row.id)}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <ProductModal open={open} handleClose={handleClosedModal} data={selectedProduct}/>
    </div>
  );
}

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

  return {
    props: {

    },
  };
};
export default Products;
