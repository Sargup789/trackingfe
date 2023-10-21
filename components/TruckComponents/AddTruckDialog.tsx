import { TruckData } from "@/pages/trucks";
import { HighlightOff } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { Field, Form } from "react-final-form";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useEffect, useState } from "react";
import React from 'react';
import { QrReader } from "react-qr-reader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClearIcon from '@mui/icons-material/Clear';
import { Checklist } from "../types";
import axios from "axios";

interface TruckDialogProps {
    open: boolean;
    handleClose: () => void;
    isViewMode: boolean;
    truckDialogData: TruckData | {};
    onSubmit: (values: TruckData) => void;
}

const AddTruckDialog: React.FC<TruckDialogProps> = ({
    open,
    handleClose,
    isViewMode,
    truckDialogData,
    onSubmit,
}) => {
    const isEditMode = Object.keys(truckDialogData).length > 0;
    const [isScanning, setIsScanning] = useState(false);
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [checklists, setChecklists] = useState<Checklist[]>([]);

    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const toSlugFormat = (str: string) => {
        return str.toLowerCase().replace(/\s+/g, '-');
    };

    const handleScan = (result: any, error: any) => {
        if (!!result) {
            setScannedCode(result?.text);
            setIsScanning(false);
        }
        if (!!error) {
            console.info(error);
        }
    };

    const customHandleClose = () => {
        handleClose();
        setIsScanning(false);
        setScannedCode(null);
    };

    const customOnSubmit = (values: any) => {
        values.qrCodeId = scannedCode || values.qrCodeId;
        values.arrivalDate = formatDate(startDate!);
        values.checklist = checklists.map((item) => ({
            question: item.question,
            answer: values[`checklist_${toSlugFormat(item.question)}`],
            isActive: item.isActive
        }));
        setScannedCode(null);
        onSubmit(values);
    };

    useEffect(() => {
        if (!open) {
            setScannedCode(null);
        }
    }, [open]);

    const getAllChecklists = async () => {
        const response = await axios.get(`/api/router?path=api/checklist`);
        return response.data;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const checklistData = await getAllChecklists();
                setChecklists(checklistData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, []);

    // const transformTruckDataForForm = (truckData: TruckData | {}) => {
    //     if (Object.keys(truckData).length === 0) return {}
    //     const transformedData: any = { ...truckData };
    //     if ((truckData as TruckData).checklist) {
    //         (truckData as TruckData).checklist.forEach(item => {
    //             if (item && item.question) {
    //                 const slug = toSlugFormat(item.question);
    //                 transformedData[`checklist_${slug}`] = item.answer;
    //             }
    //         });
    //     }
    //     return transformedData;
    // };

    return (
        <Dialog maxWidth="lg" fullWidth open={open} onClose={customHandleClose}>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {isEditMode ? "Edit" : "Add"} Truck
                </Box>
                <IconButton
                    children={<HighlightOff />}
                    color="inherit"
                    onClick={handleClose}
                    sx={{ transform: "translate(8px, -8px)" }}
                />
            </DialogTitle>
            <DialogContent>
                <Form
                    // initialValues={{
                    //     ...transformTruckDataForForm(truckDialogData),
                    //     qrCodeId: scannedCode ? scannedCode : (isEditMode ? (truckDialogData as TruckData).qrCodeId : null)
                    // }}
                    onSubmit={customOnSubmit}
                    render={({ handleSubmit, values }) => {
                        return <form onSubmit={handleSubmit}>
                            <Box
                                sx={{
                                    my: 3,
                                    mx: 1,
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "1fr", lg: "1fr 1fr" },
                                    gap: 3,
                                }}
                            >
                                <Field name="qrCodeId">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Order ID</Typography>
                                            {/* <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                disabled={isEditMode}
                                                placeholder="Order ID"
                                                value={scannedCode || input.value}
                                            /> */}
                                        </Box>
                                    )}
                                </Field>
                                {isScanning && <div>
                                    <QrReader
                                        onResult={handleScan}
                                        constraints={{ facingMode: "environment" }}
                                        //@ts-ignore
                                        style={{ width: "40%", height: "40%" }}
                                    />
                                    <Button onClick={() => setIsScanning(false)}>Close Scanner</Button>
                                </div>}
                                {/* <Field name="arrivalDate">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Arrival Date</Typography>
                                            <DatePicker className='date-component'
                                                selected={startDate}
                                                onChange={(date) => setStartDate(date as Date)}
                                                dateFormat="dd-MM-yyyy" />
                                        </Box>
                                    )}
                                </Field> */}
                                <Field name="vin">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">VIN</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder="VIN"
                                            />
                                        </Box>
                                    )}
                                </Field>
                                <Field name="modelNumber">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Model Number</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder="Model Number"
                                            />
                                        </Box>
                                    )}
                                </Field>
                                <Field name="stockNumber">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Stock Number</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder="Stock Number"
                                            />
                                        </Box>
                                    )}
                                </Field>
                                <Field name="serialNumber">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Serial Number</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder="Enter serial number"
                                            />
                                        </Box>
                                    )}
                                </Field>
                            </Box>
                            <Box mt={3}>
                                <Typography variant="h6" gutterBottom>Truck Accessories</Typography>
                                <Grid container spacing={2}>
                                    {checklists.map((checklistItem) => (
                                        <Grid item xs={12} key={checklistItem.question}>
                                            <FormControl component="fieldset">
                                                <FormLabel component="legend" style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                                                    {checklistItem.question}
                                                </FormLabel>
                                                <Field name={`checklist_${toSlugFormat(checklistItem.question)}`} type="radio">
                                                    {({ input }) => (
                                                        <div>
                                                            {checklistItem.options.map(option => {
                                                                const isValueMatching = values[`checklist_${toSlugFormat(checklistItem.question)}`] === option;
                                                                return (
                                                                    <label key={option}>
                                                                        <input
                                                                            type="radio"
                                                                            name={input.name}
                                                                            value={option}
                                                                            checked={isValueMatching}
                                                                            onChange={input.onChange}
                                                                        />
                                                                        {option}
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </Field>

                                            </FormControl>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                            <DialogActions>
                                {!isViewMode && <Button
                                    style={{
                                        borderRadius: 15,
                                        backgroundColor: "#E96820",
                                        fontSize: "13px"
                                    }}
                                    variant="contained"
                                    type="submit">
                                    Save
                                </Button>}
                            </DialogActions>
                        </form>
                    }
                    }
                />
            </DialogContent>
        </Dialog>
    );
}

export default AddTruckDialog