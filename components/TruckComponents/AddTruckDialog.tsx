import { TruckData } from "@/pages/trucks";
import { HighlightOff } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Field, Form } from "react-final-form";
import { useEffect, useState } from "react";
import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
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
    const [orderIds, setOrderIds] = useState([]);

    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const fetchOrderIds = async () => {
        try {
            const response = await axios.get('/api/router?path=api/order/all/ids');
            setOrderIds(response.data);
        } catch (error) {
            console.error('Error fetching order IDs:', error);
        }
    };

    useEffect(() => {
        fetchOrderIds();
    }, [handleClose]);

    const customHandleClose = () => {
        handleClose();
    };

    const customOnSubmit = (values: any) => {
        onSubmit(values);
    };

    return (
        <Dialog maxWidth="sm" fullWidth open={open} onClose={customHandleClose}>
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
                    initialValues={truckDialogData}
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
                                <Field name="orderId">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Quote Number / CRM Number</Typography>
                                            <FormControl fullWidth>
                                                <Select
                                                    {...input}
                                                    value={input.value}
                                                    disabled={isEditMode}
                                                >
                                                    {orderIds.map((orderId) => (
                                                        <MenuItem key={orderId} value={orderId}>
                                                            {orderId}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    )}
                                </Field>
                                <Field name="vin">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Truck Number / VIN / SR Number</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder="Truck Number / VIN / SR Number"
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