import { TruckData } from '@/pages/trucks';
import { DeleteOutline, EditOutlined, RemoveRedEyeOutlined } from '@mui/icons-material';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material';
import * as React from 'react';
interface Props {
    truckData: TruckData[];
    deleteTruck: (id: string) => void;
    editTruck: (data: TruckData) => void;
    setPage: (page: number) => void;
    setSize: (size: number) => void;
    page: number;
    viewTruck: (data: TruckData) => void;
    size: number;
    onRowSelect?: (id: string) => void;
}

export default function Truck({
    truckData, deleteTruck, editTruck, setPage, setSize, page, size, viewTruck, onRowSelect
}: Props) {

    if (!truckData) return (<div></div>)

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
                            <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>VIN</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Vehicle Model</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Serial Number</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Stock Number</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {truckData.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.orderId}</TableCell>
                                <TableCell align='center'>{row.vin}</TableCell>
                                <TableCell align='center'>{row.modelNumber}</TableCell>
                                <TableCell align='center'>{row.serialNumber}</TableCell>
                                <TableCell align='center'>{row.stockNumber}</TableCell>
                                <TableCell align='center'>{row.status}</TableCell>
                                <TableCell align='center'>
                                    <Tooltip title="View" followCursor>
                                        <IconButton
                                            size="small"
                                            onClick={() => viewTruck(row as TruckData)}
                                            children={<RemoveRedEyeOutlined fontSize="small" />}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Edit" followCursor>
                                        <IconButton
                                            size="small"
                                            onClick={() => editTruck(row as TruckData)}
                                            children={<EditOutlined fontSize="small" />}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Delete" followCursor>
                                        <IconButton
                                            size="small"
                                            onClick={() => { deleteTruck(row.id) }}
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
                count={truckData.length}
                rowsPerPage={size}
                page={page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}