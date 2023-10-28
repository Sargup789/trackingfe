import { TruckData } from "@/pages/trucks";
import { HighlightOff } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Grid, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Field, Form } from "react-final-form";
import { useEffect, useState } from "react";
import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
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
    const [checklists, setChecklists] = useState<Checklist[]>([]);
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
    }, []);

    const toSlugFormat = (str: string) => {
        return str.toLowerCase().replace(/\s+/g, '-');
    };

    const customHandleClose = () => {
        handleClose();
    };

    const customOnSubmit = (values: any) => {
        values.checklist = checklists.map((item) => ({
            question: item.question,
            answer: values[`checklist_${toSlugFormat(item.question)}`],
            isActive: item.isActive
        }));
        onSubmit(values);
    };

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

    const transformTruckDataForForm = (truckData: TruckData | {}) => {
        if (Object.keys(truckData).length === 0) return {}
        const transformedData: any = { ...truckData };
        if ((truckData as TruckData).checklist) {
            (truckData as TruckData).checklist.forEach(item => {
                if (item && item.question) {
                    const slug = toSlugFormat(item.question);
                    transformedData[`checklist_${slug}`] = item.answer;
                }
            });
        }
        return transformedData;
    };

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
                    initialValues={{
                        ...transformTruckDataForForm(truckDialogData),
                    }}
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
                                            <Typography className="label">Order ID</Typography>
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