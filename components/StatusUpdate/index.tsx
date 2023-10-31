import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Box, FormControlLabel, Checkbox, Paper } from '@mui/material';
import axios from 'axios';

const StatusUpdate: React.FC = () => {
    const [vin, setVin] = useState<string>('');
    const [truckDetails, setTruckDetails] = useState<any>(null);

    const headerMappings: any = {
        question: "Statuses",
        leadTime: "Lead Time (No. of Days)",
        status: "Status Update"
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/router?path=api/truck/vin/${vin}`);
            setTruckDetails(response.data);
        } catch (error) {
            console.error('Error fetching truck details:', error);
        }
    };

    const handleUpdateChecklist = async (status: string, isChecked: boolean) => {
        if (truckDetails) {
            // Update the local state
            const updatedChecklist = { ...truckDetails.leadTime };
            updatedChecklist[status] = isChecked;
            setTruckDetails({ ...truckDetails, leadTime: updatedChecklist });

            try {
                await axios.put(`/api/router?path=api/truck/${truckDetails.id}`, { leadTime: updatedChecklist });
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
                    style={{
                        borderRadius: 15,
                        backgroundColor: "#E96820",
                        fontSize: "13px",
                        marginLeft: '20px'
                    }}>
                    Search
                </Button>
            </Box>

            {truckDetails && truckDetails.leadTime && (
                <Paper elevation={3} style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{headerMappings.status}</TableCell>
                                <TableCell>{headerMappings.leadTime}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(truckDetails.leadTime).map(([status, leadTime], index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    // checked={leadTime}
                                                    onChange={(e) => handleUpdateChecklist(status, e.target.checked)}
                                                />
                                            }
                                            label={status}
                                        />
                                    </TableCell>
                                    <TableCell>{leadTime}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </Box>
    );
};

export default StatusUpdate;
