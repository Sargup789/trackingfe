import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';
import { Select, TextField, Button, Box, MenuItem, Typography, FormControl, InputLabel, ListSubheader, IconButton, InputAdornment } from '@mui/material';
import { Form, Field } from 'react-final-form';
import { toast } from 'react-toastify';
import { TruckData } from '@/pages/trucks';
import { ZoneData } from '@/pages/zone';
import { useRouter } from 'next/router';
import ClearIcon from '@mui/icons-material/Clear';
import moment from 'moment';

const CheckinForm: React.FC = () => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [truckDetails, setTruckDetails] = useState<TruckData | null>(null);
    const [zones, setZones] = useState<ZoneData[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [selectedZone, setSelectedZone] = useState<string>('')
    const router = useRouter()

    const handleScan = async (result: any) => {
        const scannedCode = result?.text;
        if (scannedCode) {
            setQrCode(scannedCode);
            setIsScanning(false);
            try {
                const response = await axios.get(`api/router?path=api/truck/qrCode/${scannedCode}`);
                setTruckDetails(response.data);
            } catch (error) {
                toast.error('Error fetching truck details.');
            }
        }
    };

    useEffect(() => {
        axios.get('/api/router?path=api/zones')
            .then(res => setZones(res.data))
            .catch(() => toast.error('Error fetching zones.'));
    }, []);

    const markTruckAsRetailReady = async (truckId: string) => {
        await axios.put(
            `/api/router?path=api/truck/${truckId}`,
            { isRetailReady: true }
        );
    }

    const handleZoneChange = (selectedZone: string) => {
        console.log(selectedZone, 'selectedZone')
        setSelectedZone(selectedZone)
        axios.get(`/api/router?path=api/zones/${selectedZone}/availableLocations`)
            .then(res => setLocations(res.data))
            .catch(() => toast.error('Error fetching locations.'));
    };

    const handleSubmit = async (values: any) => {
        try {
            const { isRetailReady, ...rest } = values;
            await axios.post(`/api/router?path=api/truck/checkin/${truckDetails?.id}`, rest);
            if (isRetailReady === 'true') markTruckAsRetailReady(truckDetails?.id as string)
            toast.success('Check-in successful.');
            setTruckDetails(null)
            setQrCode(null)
        } catch (error: any) {
            const errmsg = error?.response?.data?.message;
            toast.error(errmsg || "Something went wrong");
        }
    };

    return (
        <Box p={3} bgcolor="white" boxShadow={2}>
            <Typography variant="h5">Check-In Form</Typography>
            {isScanning ? (
                <div>
                    <QrReader
                        onResult={handleScan}
                        constraints={{ facingMode: "environment" }}
                        //@ts-ignore
                        style={{ width: "40%", height: "40%" }}
                    />
                    <Button onClick={() => setIsScanning(false)}>Close Scanner</Button>
                </div>
            ) : (
                <TextField
                    label="Scan QR Code"
                    value={qrCode || ''}
                    margin='normal'
                    InputProps={{
                        endAdornment: (
                            <>
                                <InputAdornment position="end"><Button onClick={() => setIsScanning(true)}>Scan</Button></InputAdornment>
                                <InputAdornment position="end"><IconButton onClick={() => { setQrCode(null); setTruckDetails(null) }}><ClearIcon /></IconButton></InputAdornment>
                            </>
                        )
                    }}
                    fullWidth
                />
            )}
            {truckDetails && (
                <div>
                    <Box mt={2} display="flex" flexDirection="column">
                        <Typography variant="h4">Truck Details:</Typography>
                        <br />
                        <Typography variant="body1">Arrival Date: {moment(truckDetails.arrivalDate).format("MMM DD, YYYY")}</Typography>
                        <Typography variant="body1">Manufactured Year: {truckDetails.manufacturedYear}</Typography>
                        <Typography variant="body1">Is Retail Ready: {truckDetails.isRetailReady}</Typography>
                        <Typography variant="body1">Vehicle Make: {truckDetails.make}</Typography>
                        <Typography variant="body1">Vehicle Model: {truckDetails.model}</Typography>
                        <Typography variant="body1">Serial No.: {truckDetails.serialNumber}</Typography>
                        <Typography variant="body1">Fuel Type: {truckDetails.fuelType}</Typography>
                        <Typography variant="body1">Hour Meter: {truckDetails.hourMeter}</Typography>
                        <Typography variant="body1">Battery Make: {truckDetails.batteryMake}</Typography>
                        <Typography variant="body1">Battery Model: {truckDetails.batteryModel}</Typography>
                        <Typography variant="body1">Status: {truckDetails.status}</Typography>
                        <Typography variant="body1">Zone: {truckDetails.zone?.name || "-"}</Typography>
                        <Typography variant="body1">Location: {truckDetails.location}</Typography>
                        {/* <Typography variant="body1">QR Code ID: {truckDetails.qrCodeId}</Typography> */}
                        <Typography variant="body1">Created At: {moment(truckDetails.createdAt).format("MMM DD, YYYY")}</Typography>
                        <Typography variant="body1">Updated At: {moment(truckDetails.updatedAt).format("MMM DD, YYYY")}</Typography>
                    </Box>
                    {!truckDetails.zone ? <Form
                        onSubmit={handleSubmit}
                        render={({ handleSubmit, values }) => (
                            <form onSubmit={handleSubmit}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel htmlFor="zoneId">Select Zone</InputLabel>
                                    <Field name="zoneId" id="zoneId">
                                        {({ input }) => (
                                            <Select {...input} onChange={(e) => { input.onChange(e); handleZoneChange(e.target.value as string); }} label="Select Zone">
                                                {zones.flatMap(zone => {
                                                    const items = [];

                                                    if (zone.isParentZone) {
                                                        items.push(<ListSubheader key={zone.id}>{zone.name}</ListSubheader>);
                                                    } else if (!zone.isSubZone) {
                                                        items.push(<MenuItem key={zone.id} value={zone.id}>{zone.name}</MenuItem>);
                                                    }

                                                    if (zone.subZones) {
                                                        items.push(...zone.subZones.map((subZone: ZoneData) => (
                                                            <MenuItem key={subZone.id} value={subZone.id}>&nbsp;&nbsp;{subZone.name}</MenuItem>
                                                        )));
                                                    }

                                                    return items;
                                                })}
                                            </Select>
                                        )}
                                    </Field>
                                </FormControl>

                                <FormControl fullWidth margin="normal">
                                    <InputLabel htmlFor="location">Select Location</InputLabel>
                                    <Field name="location" id="location">
                                        {({ input }) => (
                                            <Select {...input} label="Select Location">
                                                {locations.map(location => (
                                                    <MenuItem key={location} value={location}>{location}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </Field>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel htmlFor="isRetailReady">Is Retail Ready? (Default true for retail ready zones)</InputLabel>
                                    <Field name="isRetailReady" id="isRetailReady">
                                        {({ input }) => (
                                            <Select {...input} defaultValue={values['zone']} label="Is Retail Ready? (Default true for retail ready zones)">
                                                {['true', 'false'].map(option => (
                                                    <MenuItem key={option} value={option}>{option.toUpperCase()}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </Field>
                                </FormControl>
                                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '15px' }}>Check-In</Button>
                            </form>
                        )}
                    /> : <div><Typography variant='h4' sx={{ color: 'red', marginTop: '2rem' }} >
                        Truck is already checkedin, Please checkout first</Typography>
                        <Button
                            style={{
                                borderRadius: 15,
                                backgroundColor: "#E96820",
                                fontSize: "13px"
                            }}
                            variant="contained"
                            onClick={() => router.push('/checkout')}
                        >
                            Checkout
                        </Button>
                    </div>}
                </div>
            )}

        </Box>
    );
};

export default CheckinForm;
