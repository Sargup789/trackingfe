import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Box, FormControlLabel, Radio, RadioGroup, Paper } from '@mui/material';
import axios from 'axios';
import { ChecklistItemData, TruckData } from '@/pages/trucks';


const VendorSourcing: React.FC = () => {
    const [vin, setVin] = useState<string>('');
    const [truckDetails, setTruckDetails] = useState<TruckData | null>(null);

    const headerMappings: any = {
        question: "Checklist Item",
        leadTime: "Lead Time",
        status: "Status"
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/router?path=api/truck/vin/${vin}`);
            setTruckDetails(response.data);
        } catch (error) {
            console.error('Error fetching truck details:', error);
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
                    label="Enter VIN"
                    variant="outlined"
                    size='medium'
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSearch}
                    style={{ marginLeft: '20px' }}>
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
                            {truckDetails.checklist.map((item, index) => (<TableRow key={index}>
                                {Object.entries(item).map(([key, value], idx) => {
                                    if (key === 'isActive') return null;
                                    if (key === 'answer') return null;
                                    if (key === 'leadTime') {
                                        return (
                                            <TableCell key={idx}>
                                                <TextField
                                                    value={value}
                                                    type="number"
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
                                                    <FormControlLabel value="ORDERED" control={<Radio />} label="ORDERED" />
                                                    <FormControlLabel value="FULFILLED" control={<Radio />} label="FULFILLED" />
                                                </RadioGroup>
                                            </TableCell>
                                        );
                                    } else {
                                        return <TableCell key={idx}>{value}</TableCell>;
                                    }
                                })}
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </Box>
    );
};

export default VendorSourcing;

