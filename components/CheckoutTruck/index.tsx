import React, { useState } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';
import { TextField, Button, Box, Typography, IconButton, InputAdornment } from '@mui/material';
import { toast } from 'react-toastify';
import { TruckData } from '@/pages/trucks';
import ClearIcon from '@mui/icons-material/Clear';
import moment from 'moment';

const CheckoutForm: React.FC = () => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [truckDetails, setTruckDetails] = useState<TruckData | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleScan = async (result: any) => {
        const scannedCode = result?.text;
        if (scannedCode) {
            setQrCode(scannedCode);
            setIsScanning(false);
            try {
                const response = await axios.get(`api/router?path=api/truck/qrCode/${scannedCode}`);
                setTruckDetails(response.data);
                if (response.data.zoneId) {
                    setShowConfirmDialog(true);
                } else {
                    toast.warn('Truck is not checked in.');
                }
            } catch (error: any) {
                const errmsg = error?.response?.data?.message;
                toast.error(errmsg || "Something went wrong");
            }
        }
    };

    console.log(showConfirmDialog, "dialog");

    const handleCheckout = async () => {
        try {
            await axios.get(`/api/router?path=api/truck/checkout/${truckDetails?.id}`);
            toast.success('Truck checked out successfully.');
            setShowConfirmDialog(false);
            setTruckDetails(null)
            setQrCode(null)
        } catch (error: any) {
            const errmsg = error?.response?.data?.message;
            toast.error(errmsg || 'Error during checkout.');
        }
    };

    return (
        <Box p={3} bgcolor="white" boxShadow={2}>
            <Typography variant="h5">Checkout Form</Typography>
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
                <Box mt={2} display="flex" flexDirection="column">
                    <Typography variant="h4">Truck Details:</Typography>
                    <br />
                    <Typography variant="body1">Arrival Date: {moment(truckDetails.arrivalDate).format("MMM DD, YYYY")}</Typography>
                    <Typography variant="body1">Manufactured Year: {truckDetails.manufacturedYear}</Typography>
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
                    <Typography variant="body1">Created At: {moment(truckDetails.createdAt).format("MMM DD, YYYY")}</Typography>
                    <Typography variant="body1">Updated At: {moment(truckDetails.updatedAt).format("MMM DD, YYYY")}</Typography>

                    <br />
                    <Typography sx={{ fontWeight: 'bold' }}>Do you want to checkout this truck?</Typography>
                    <Button type="submit" variant="contained" color="primary" style={{ marginTop: '15px' }} onClick={handleCheckout}>Confirm</Button>
                </Box>

            )}
            {/* <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
                <DialogTitle>Confirm Checkout</DialogTitle>
                <DialogContent>
                    <Typography>Do you want to checkout this truck?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowConfirmDialog(false)} color="primary">Cancel</Button>
                    <Button onClick={handleCheckout} color="primary">Yes</Button>
                </DialogActions>
            </Dialog> */}
        </Box>
    );
};

export default CheckoutForm;
