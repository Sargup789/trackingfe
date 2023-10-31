import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Box, FormControlLabel, Checkbox, Paper } from '@mui/material';
import axios from 'axios';

const StatusUpdate: React.FC = () => {
    const [vin, setVin] = useState<string>('');
    const [truckDetails, setTruckDetails] = useState<any>(null);
    const [leadTime, setLeadTime] = useState<any>({});
    const [truckStatus, setStatus] = useState<any>('Retail Order Generated');

    const possibleStatuses = {
        RETAIL_ORDER_GENERATED: "Retail Order Generated",
        IN_PRODUCTION_WITH_TMH: "In Production with TMH",
        SHIPPED_TO_TLNW: "Shipped to Toyota Lift Northwest",
        WORK_ORDER_RELEASED: "Work Order Released",
        PDI: "PDI",
        IN_TRANSPORTATION: "In Transportation",
        RECEIVED_BY_CUSTOMER: "Received By Customer",
    }

    const headerMappings: any = {
        status: "Status Update",
        leadTime: "Lead Time (No. of Days)"
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/router?path=api/truck/vin/${vin}`);
            setTruckDetails(response.data);
            setStatus(response.data.status)
            setLeadTime(response.data.leadTime);
        } catch (error) {
            console.error('Error fetching truck details:', error);
        }
    };

    const handleUpdateStatus = async (status: string, isChecked: boolean) => {
        if (truckDetails) {
            console.log('status', status)
            // Update the local state
            setTruckDetails({ ...truckDetails, status });
            try {
                await axios.put(`/api/router?path=api/truck/${truckDetails.id}`, { status });
                handleSearch()
            } catch (error) {
                console.error('Error updating truck details:', error);
            }
        }
    };

    const handleLeadTimeChange = async (status: string, value: number) => {
        console.log('status', status, 'value', value)
        // Update the local state with the new lead time value
        setLeadTime({ ...leadTime, [status]: value });
        try {
            await axios.put(`/api/router?path=api/truck/${truckDetails.id}`, { leadTime: { ...leadTime, [status]: value } });
            handleSearch()
        } catch (error) {
            console.error('Error updating truck details:', error);
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
                            {Object.values(possibleStatuses).map((status, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={truckDetails.status === status}
                                                    onChange={(e) => handleUpdateStatus(status, e.target.checked)}
                                                />
                                            }
                                            label={status}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <input
                                            type="number"
                                            value={leadTime[status] || ''}
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
