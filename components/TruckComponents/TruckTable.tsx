import { TruckData } from '@/pages/trucks';
import { DeleteOutline, EditOutlined, RemoveRedEyeOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import PrintDialog from '../QRCodeComponents/PrintDialog';
import moment from "moment";
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
    const [printDialogOpen, setPrintDialogOpen] = useState(false);
    const [printCode, setPrintCode] = useState('');

    const router = useRouter();
    const isTaskPage = router.pathname.includes('task');

    const handlePrint = (code: string) => {
        setPrintCode(code);
        setPrintDialogOpen(true);
    };

    const renderActionButton = (params: GridCellParams) => (
        <>
            <Tooltip title="View" followCursor>
                <IconButton
                    size="small"
                    onClick={() => viewTruck(params.row as TruckData)}
                    children={<RemoveRedEyeOutlined fontSize="small" />}
                />
            </Tooltip>
            <Tooltip title="Edit" followCursor>
                <IconButton
                    size="small"
                    onClick={() => editTruck(params.row as TruckData)}
                    children={<EditOutlined fontSize="small" />}
                />
            </Tooltip>
            <Tooltip title="Delete" followCursor>
                <IconButton
                    size="small"
                    onClick={() => deleteTruck(params.row.id as string)}
                    children={<DeleteOutline fontSize="small" />}
                />
            </Tooltip>
        </>
    );

    const columns: GridColDef[] = [
        // {
        //     field: ' ',
        //     headerName: 'Arrival Date',
        //     width: 150,
        //     sortable: true,
        //     headerAlign: 'center',
        //     valueGetter: (params) => moment(params.value as string, "DD-MM-YYYY").format("MMM DD, YYYY"),
        // },
        {
            field: 'orderId',
            headerName: 'Order ID',
            width: 150,
            align: 'center',
            sortable: true,
        },
        {
            field: 'vin',
            headerName: 'VIN',
            width: 150,
            align: 'center',
            sortable: true,

        },
        {
            field: 'modelNumber',
            headerName: 'Vehicle Model',
            width: 150,

            align: 'center',
            sortable: true,
        },
        {
            field: 'serialNumber',
            headerName: 'Serial Number',
            width: 150,

            align: 'center',
            sortable: true,
        },
        {
            field: 'stockNumber',
            headerName: 'Stock Number',
            width: 150,

            align: 'center',
            sortable: true,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: renderActionButton,
            headerAlign: 'center',
        }
    ];

    return (
        <div style={{ height: 450, width: '100%', backgroundColor: 'white' }}>
            <DataGrid
                rows={truckData}
                columns={columns}
                pageSize={size}
                rowsPerPageOptions={[10, 25, 100]}
                paginationMode="server"
                rowCount={10}
                page={page - 1}
                onPageChange={(val) => setPage(val + 1)}
                onPageSizeChange={(val) => setSize(val)}
                checkboxSelection={isTaskPage}
                onSelectionModelChange={(ids: any) => {
                    if (onRowSelect)
                        onRowSelect(ids[0])
                }}
                sx={{
                    '& .MuiDataGrid-cell': {
                        textAlign: 'center',
                        justifyContent: 'center',
                        display: 'flex'
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: '700'
                    },
                    '& .MuiDataGrid-columnHeaderTitleContainer': {
                        justifyContent: 'center'
                    }
                }}
            />
            {printDialogOpen && (
                <PrintDialog open={printDialogOpen} handleClose={() => setPrintDialogOpen(false)} code={printCode} />
            )}
        </div>
    );
}