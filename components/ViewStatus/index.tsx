import { Box, Button, MenuItem, Select, TextField, Typography } from '@mui/material'
import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const ViewStatus: React.FC = () => {

    const [companyName, setCompanyName] = useState('');
    const [quoteNumbers, setQuoteNumbers] = useState<string[]>([]);
    const [selectedQuoteNumber, setSelectedQuoteNumber] = useState("");

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/router?path=api/order/customerName/${companyName}`);
            toast.success("Status details registered with this VIN");
            // Assuming the API response is an array of quote numbers
            if (Array.isArray(response.data) && response.data.length > 0) {
                setQuoteNumbers(response.data?.[0]);
            }
        } catch (error) {
            console.error('Error fetching truck details:', error);
            toast.error("Truck not found registered with this VIN");
        }
    };

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
            {console.log(quoteNumbers, 'quote')}
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
        </Box>
    )
}

export default ViewStatus