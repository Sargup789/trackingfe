import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton, TablePagination, Tooltip } from '@mui/material';
import { OrderApiResponse, OrderData } from '@/pages';
import { DeleteOutline, EditOutlined, RemoveRedEyeOutlined } from '@mui/icons-material';

interface Props {
  dashboardApiData: OrderApiResponse
  setPage: (page: number) => void
  editOrder: (data: OrderData) => void;
  viewOrder: (data: OrderData) => void;
  setSize: (size: number) => void
  deleteOrder: (id: string) => void;
  page: number
  size: number
}

export default function DashboardTable({ dashboardApiData, editOrder, viewOrder, deleteOrder, setPage, setSize, page, size }: Props) {
  if (!dashboardApiData.data) return (<div></div>)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);  // +1 because backend pages are 1-indexed while material-ui's pagination is 0-indexed.
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(+event.target.value);
    setPage(1);  // reset to the first page whenever the rows per page size changes.
  };


  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Quote Number</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Territory Manager</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Manager</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>No. of trucks</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Delivery Location</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dashboardApiData.data.map((orderRow) => (
              <TableRow key={orderRow.id}>
                <TableCell>{orderRow.orderId}</TableCell>
                <TableCell align='center'>{orderRow.customerName}</TableCell>
                <TableCell align='center'>{orderRow.territoryManager}</TableCell>
                <TableCell align='center'>{orderRow.manager}</TableCell>
                <TableCell align='center'>{orderRow.numberOfTrucks}</TableCell>
                <TableCell align='center'>{orderRow.deliveryLocation}</TableCell>
                <TableCell align='center'>
                  <Tooltip title="View" followCursor>
                    <IconButton
                      size="small"
                      onClick={() => viewOrder(orderRow as OrderData)}
                      children={<RemoveRedEyeOutlined fontSize="small" />}
                    />
                  </Tooltip>
                  <Tooltip title="Edit" followCursor>
                    <IconButton
                      size="small"
                      onClick={() => editOrder(orderRow as OrderData)}
                      children={<EditOutlined fontSize="small" />}
                    />
                  </Tooltip>
                  <Tooltip title="Delete" followCursor>
                    <IconButton
                      size="small"
                      onClick={() => { deleteOrder(orderRow.orderId) }}
                      children={<DeleteOutline fontSize="small" />}
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={dashboardApiData.totalCount}
        rowsPerPage={size}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}