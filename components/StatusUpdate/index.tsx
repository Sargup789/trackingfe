import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Box, FormControlLabel, Checkbox, Paper } from '@mui/material';
import axios from 'axios';

const StatusUpdate: React.FC = () => {
    const [vin, setVin] = useState<string>('');
    const [truckDetails, setTruckDetails] = useState<any>(null);
    const [leadTimes, setLeadTimes] = useState<any>({});

    const hardcodedStatuses = [
        "RETAIL_ORDER_GENERATED",
        "IN_PRODUCTION_WITH_TMH",
        "SHIPPED_TO_TLNW",
        "WORK_ORDER_RELEASED",
        "PDI",
        "IN_TRANSPORTATION",
        "RECEIVED_BY_CUSTOMER"
    ];

    const headerMappings: any = {
        status: "Status Update",
        leadTime: "Lead Time (No. of Days)"
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/router?path=api/truck/vin/${vin}`);
            setTruckDetails(response.data);
            // Initialize lead times with the values from the response
            setLeadTimes(response.data.leadTime);
        } catch (error) {
            console.error('Error fetching truck details:', error);
        }
    };

    const handleUpdateStatus = async (status: string, isChecked: boolean) => {
        if (truckDetails) {
            // Check if the status is one of the hardcoded statuses
            if (hardcodedStatuses.includes(status)) {
                // Update the local state
                const updatedStatus = { ...truckDetails.status };
                updatedStatus[status] = isChecked;
                setTruckDetails({ ...truckDetails, status: updatedStatus });

                try {
                    await axios.put(`/api/router?path=api/truck/${truckDetails.id}`, { status: updatedStatus });
                } catch (error) {
                    console.error('Error updating truck details:', error);
                }
            } else {
                console.error('Invalid status:', status);
            }
        }
    };

    const handleLeadTimeChange = (status: string, value: number) => {
        // Update the local state with the new lead time value
        setLeadTimes({ ...leadTimes, [status]: value });
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
                            {hardcodedStatuses.map((status, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={truckDetails.status[status]}
                                                    onChange={(e) => handleUpdateStatus(status, e.target.checked)}
                                                />
                                            }
                                            label={status}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <input
                                            type="number"
                                            value={leadTimes[status] || ''}
                                            onChange={(e) => handleLeadTimeChange(status, parseInt(e.target.value, 10))}
                                        />
                                    </TableCell>
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
