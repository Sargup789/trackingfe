import { Box, Button, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import axios from 'axios';
import { ChecklistItemData, TruckData } from '@/pages/trucks';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

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
        return item?.map((singleItem) => singleItem.answer === 'yes' && <div className='flex flex-col'><p>{singleItem.question} - {singleItem.status}</p></div>)
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
            {truckDetails.length > 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Truck No</TableCell>
                                <TableCell>Model No</TableCell>
                                <TableCell>Serial No</TableCell>
                                <TableCell>Stock No</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Checklist Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {truckDetails.map((truck) => (
                                <TableRow key={truck.id}>
                                    <TableCell>{truck.vin}</TableCell>
                                    <TableCell>{truck.modelNumber}</TableCell>
                                    <TableCell>{truck.serialNumber}</TableCell>
                                    <TableCell>{truck.stockNumber}</TableCell>
                                    <TableCell>{truck.status}</TableCell>
                                    <TableCell>
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
            )}
        </Box>
    )
}

export default ViewStatus