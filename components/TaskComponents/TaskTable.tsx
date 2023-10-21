import { TaskData } from '@/pages/task';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';

interface Props {
    taskData: TaskData[]
    deleteTask: (id: string) => void
    setPage: (page: number) => void
    setSize: (size: number) => void
    page: number
    size: number
}

export default function TaskTable({ taskData, deleteTask, setPage, setSize, page, size }: Props) {
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage + 1);  // Backend might be 1-indexed, but Material-UI pagination is 0-indexed.
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(+event.target.value);
        setPage(1);  // Reset to the first page when rows per page change.
    };

    if (!taskData) return (<div>Loading...</div>)

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Arrival Date</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Manufactured Year</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Vehicle Make</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Vehicle Model</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Serial No.</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Fuel Type</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Hour Meter</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Battery Make</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Battery Model</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Truck. Status</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Task Status</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Current Zone</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Current Loc.</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Destination Zone</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {taskData.map((taskRow) => (
                            <TableRow key={taskRow.id}>
                                <TableCell>{moment(taskRow.truck?.arrivalDate).format("MMM DD, YYYY")}</TableCell>
                                <TableCell align='center'>{taskRow.truck?.manufacturedYear}</TableCell>
                                <TableCell component="th" scope="row">{taskRow.truck?.make}</TableCell>
                                <TableCell align='center'>{taskRow.truck?.model}</TableCell>
                                <TableCell align='center'>{taskRow.truck?.serialNumber}</TableCell>
                                <TableCell align='center'>{taskRow.truck?.fuelType}</TableCell>
                                <TableCell align='center'>{taskRow.truck?.hourMeter}</TableCell>
                                <TableCell align='center'>{taskRow.truck?.batteryMake}</TableCell>
                                <TableCell align='center'>{taskRow.truck?.batteryModel}</TableCell>
                                <TableCell align='center'>{taskRow.truck?.status}</TableCell>
                                <TableCell align='center' style={{ color: taskRow?.status === "Completed" ? 'green' : 'red' }}>{taskRow?.status}</TableCell>
                                <TableCell align='center'>{taskRow.truck?.zone?.name || "-"}</TableCell>
                                <TableCell align='center'>{taskRow.truck?.location || "-"}</TableCell>
                                <TableCell align='center'>{taskRow?.toZone?.name}</TableCell>
                                <TableCell align='center'>
                                    <Tooltip title="Delete" followCursor>
                                        <IconButton
                                            size="small"
                                            onClick={() => deleteTask(taskRow.id)}
                                            children={<DeleteOutline fontSize="small" />}
                                        />
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))} */}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={taskData.length}
                rowsPerPage={size}
                page={page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
