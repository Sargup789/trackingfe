import { TruckApiResponse, TruckData } from '@/pages/trucks';
import { DeleteOutline, EditOutlined, RemoveRedEyeOutlined } from '@mui/icons-material';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
interface Props {
    truckApiData: TruckApiResponse;
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
    truckApiData, deleteTruck, editTruck, setPage, setSize, page, size, viewTruck, onRowSelect
}: Props) {

    if (!truckApiData.data) return (<div></div>)

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage + 1);  // +1 because backend pages are 1-indexed while material-ui's pagination is 0-indexed.
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(+event.target.value);
        setPage(1);  // reset to the first page whenever the rows per page size changes.
    };

    const [accessoryStatus, setAccessoryStatus] = useState<number[]>(Array(truckApiData?.data?.length).fill(0));

    const calculateAccessoryStatus = (checklist: any) => {
        if (!checklist || checklist.length === 0) {
            return 0;
        }
        return checklist.filter((item: { answer: string; status: string; }) => item.answer === "yes" && item.status === "DELIVERED").length;
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Quote Number</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Truck Number</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Vehicle Model</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Serial Number</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Stock Number</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Accessory Count</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Accessory Status (Received)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {truckApiData.data.map((row, index) => {
                            let statusCount = 0;
                            row.checklist.forEach(checklistItem => {
                                if (checklistItem.answer === 'yes') {
                                    statusCount++;
                                }
                            });
                            accessoryStatus[index] = statusCount;
                            return (
                                <TableRow key={row.id}>
                                    <TableCell>{row.orderId}</TableCell>
                                    <TableCell align='center'>{row.customerName}</TableCell>
                                    <TableCell align='center'>{row.vin}</TableCell>
                                    <TableCell align='center'>{row.modelNumber}</TableCell>
                                    <TableCell align='center'>{row.serialNumber}</TableCell>
                                    <TableCell align='center'>{row.stockNumber}</TableCell>
                                    <TableCell align='center'>{statusCount}</TableCell>
                                    <TableCell align='center'>{calculateAccessoryStatus(row.checklist)}</TableCell>
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
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={truckApiData.totalCount}
                rowsPerPage={size}
                page={page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}