import { Box, Button, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import axios from 'axios';
import { ChecklistItemData, TruckData } from '@/pages/trucks';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';

const ViewStatus: React.FC = () => {

    const [companyName, setCompanyName] = useState('');
    const [quoteNumbers, setQuoteNumbers] = useState<string[]>([]);
    const [selectedQuoteNumber, setSelectedQuoteNumber] = useState("");
    const [truckDetails, setTruckDetails] = useState<TruckData[]>([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/router?path=api/order/customerName/${companyName}`);
            toast.success("Company order details");
            // Assuming the API response is an array of quote numbers
            if (Array.isArray(response.data) && response.data.length > 0) {
                setQuoteNumbers(response.data?.[0]);
            }
        } catch (error) {
            console.error('Error fetching truck details:', error);
            toast.error("No company order details found");
        }
    };

    useEffect(() => {
        if (selectedQuoteNumber) {
            // Fetch truck details based on the selected quoteNumber
            fetchTruckDetails(selectedQuoteNumber);
        }
    }, [selectedQuoteNumber]);

    const fetchTruckDetails = async (quoteNumber: string) => {
        try {
            const response = await axios.get(`/api/router?path=api/truck/orderId/${quoteNumber}`);
            setTruckDetails(response.data);
        } catch (error) {
            console.error('Error fetching truck details:', error);
            toast.error('No truck details found');
        }
    };

    const displayCheckListTable = (item: ChecklistItemData[]) => {
        return item?.map((singleItem) => singleItem.answer === 'yes' && <div className='flex flex-col'><p>{singleItem.question} - {singleItem.status === "DELIVERED"
            ? 'ITEM RECEIVED'
            : singleItem.status === "AWAITING DELIVERY"
                ? "WORK ORDER GENERATED"
                : singleItem.status
                    ? " PO GENERATED"
                    : "N/A"
        }</p></div>)
    }

    return (
        <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 2 }}>
            <Typography variant="h6" marginBottom={2}>Truck Status</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <TextField
                    value={companyName}
                    onChange={(e: any) => setCompanyName(e.target.value)}
                    label="Company Name"
                    size='small'
                    InputProps={{
                        endAdornment: (
                            <>
                                <IconButton onClick={() => { setCompanyName(''); setQuoteNumbers([]); setSelectedQuoteNumber(''); setTruckDetails([]) }}><ClearIcon /></IconButton>
                            </>
                        )
                    }}
                    variant="outlined"
                    sx={{ marginRight: 1, flexGrow: 0.5 }}
                />
                <Button
                    variant="contained"
                    style={{
                        borderRadius: 15,
                        backgroundColor: "#E96820",
                        fontSize: "13px"
                    }}
                    onClick={handleSearch}
                >
                    Search
                </Button>
            </Box>
            <Select
                value={selectedQuoteNumber}
                onChange={(e: any) => setSelectedQuoteNumber(e.target.value)}
                label="Select Quote Number"
                size='small'
                placeholder='Select Quote Number'
                sx={{ minWidth: 200, marginTop: '10px' }}
            >
                <MenuItem value="">Select Quote Number</MenuItem>
                {quoteNumbers?.map((quoteNumber) => (
                    <MenuItem key={quoteNumber} value={quoteNumber}>
                        {quoteNumber}
                    </MenuItem>
                ))}
            </Select>
            <br />
            <br />
            {truckDetails.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Truck No</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Model No</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Serial No</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Stock No</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 'bold' }}>Checklist Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {truckDetails.map((truck) => (
                                <TableRow key={truck.id}>
                                    <TableCell>{truck.vin}</TableCell>
                                    <TableCell align='center'>{truck.modelNumber}</TableCell>
                                    <TableCell align='center'>{truck.serialNumber}</TableCell>
                                    <TableCell align='center'>{truck.stockNumber}</TableCell>
                                    <TableCell align='center'>{truck.status}</TableCell>
                                    <TableCell align='left'>
                                        {displayCheckListTable(truck.checklist)}
                                        {/* {truck.checklist
                                            .filter((item) => item.answer === 'yes')
                                            .map((item) => item.question)
                                            .join(', ')} */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    No trucks found.
                </Typography>
            )
            }
        </Box>
    )
}

export default ViewStatus