import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Box, FormControlLabel, Radio, RadioGroup, Paper, IconButton } from '@mui/material';
import axios from 'axios';
import { ChecklistItemData, TruckData } from '@/pages/trucks';
import { toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';

const VendorSourcing: React.FC = () => {
    const [stockNumber, setStockNumber] = useState<string>('');
    const [truckDetails, setTruckDetails] = useState<TruckData | null>(null);

    const headerMappings: any = {
        question: "Components",
        leadTime: "Lead Time (No. of Days)",
        status: "Status"
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/router?path=api/truck/stockNumber/${stockNumber}`);
            toast.success("Accessories details registed with this stock number");
            setTruckDetails(response.data);
        } catch (error) {
            console.error('Error fetching truck details:', error);
            toast.error("Truck not found registed with this stock number")
        }
    };

    const handleUpdateChecklist = async (index: number, key: keyof ChecklistItemData, value: any) => {
        if (truckDetails) {
            // Update the local state
            const updatedChecklist = [...truckDetails.checklist] as any
            updatedChecklist[index][key] = value;
            setTruckDetails({ ...truckDetails, checklist: updatedChecklist });

            try {
                await axios.put(`/api/router?path=api/truck/${truckDetails.id}`, { checklist: updatedChecklist });
            } catch (error) {
                console.error('Error updating truck details:', error);
            }
        }
    };

    return (
        <Box style={{
            display: 'flex', flexDirection: 'column', margin: 6,
            width: '100%',
            padding: 60, backgroundColor: 'white'
        }}>
            <Box style={{ display: 'flex', padding: '24px', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <TextField
                    label="Enter Stock Number"
                    variant="outlined"
                    size='medium'
                    value={stockNumber}
                    InputProps={{
                        endAdornment: (
                            <>
                                <IconButton onClick={() => { setStockNumber(''); setTruckDetails(null) }}><ClearIcon /></IconButton>
                            </>
                        )
                    }}
                    onChange={(e) => setStockNumber(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSearch}
                    style={{
                        borderRadius: 15,
                        backgroundColor: "#E96820",
                        fontSize: "13px",
                        marginLeft: '20px'
                    }}>
                    Search
                </Button>
            </Box>

            {truckDetails && truckDetails.checklist && (
                <Paper elevation={3} style={{ marginTop: '20px' }}>

                    <Table>
                        <TableHead>
                            <TableRow>
                                {Object.keys(truckDetails.checklist[0]).map((key) => {
                                    if (key !== 'answer' && key !== 'isActive') {
                                        return <TableCell key={key} style={{ fontWeight: 'bold' }}>{headerMappings[key] || key}</TableCell>;
                                    }
                                    return null;
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {truckDetails.checklist.map((item, index) => {
                                if (item.answer === 'no') return null;
                                return <TableRow key={index}>
                                    {Object.entries(item).map(([key, value], idx) => {
                                        if (key === 'isActive') return null;
                                        if (key === 'answer') return null;
                                        if (key === 'leadTime') {
                                            return (
                                                <TableCell key={idx}>
                                                    <TextField
                                                        value={value}
                                                        type="number"
                                                        disabled={item.status === 'DELIVERED'}
                                                        onChange={(e) => handleUpdateChecklist(index, key as keyof ChecklistItemData, e.target.value)}
                                                    />
                                                </TableCell>
                                            );
                                        } else if (key === 'status') {
                                            return (
                                                <TableCell key={idx}>
                                                    <RadioGroup
                                                        value={value}
                                                        onChange={(e) => handleUpdateChecklist(index, key as keyof ChecklistItemData, e.target.value)}
                                                    >
                                                        <FormControlLabel value="PO GENERATED" control={<Radio />} label="PO GENERATED" />
                                                        <FormControlLabel value="AWAITING DELIVERY" control={<Radio />} label="AWAITING DELIVERY" />
                                                        <FormControlLabel value="DELIVERED" control={<Radio />} label="ITEM RECEIVED" />
                                                    </RadioGroup>
                                                </TableCell>
                                            );
                                        } else {
                                            return <TableCell key={idx}>{value}</TableCell>;
                                        }
                                    })}
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </Box>
    );
};

export default VendorSourcing;

