import { OrderData } from "@/pages";
import { HighlightOff } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Grid, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Field, Form } from "react-final-form";
import { DropdownMaster } from "../types";
import { useEffect, useState } from "react";
import axios from "axios";
import { Checklist } from "../types";

interface UserDialogProps {
    open: boolean;
    isViewMode: boolean;
    handleClose: () => void;
    orderDialogData: OrderData | {};
    onSubmit: (values: OrderData) => void;
}
const AddOrderDialog: React.FC<UserDialogProps> = ({
    open,
    isViewMode,
    handleClose,
    orderDialogData,
    onSubmit,
}) => {
    const isEditMode = Object.keys(orderDialogData).length > 0;
    const [dropdowns, setDropdowns] = useState<DropdownMaster[]>([]);
    const [checklists, setChecklists] = useState<Checklist[]>([]);

    const toSlugFormat = (str: string) => {
        return str.toLowerCase().replace(/\s+/g, '-');
    };

    const customOnSubmit = (values: any) => {
        values.checklist = checklists.map((item) => ({
            question: item.question,
            answer: values[`checklist_${toSlugFormat(item.question)}`],
            isActive: item.isActive
        }));
        values.dropdownData = dropdowns.map((dropdown) => ({
            dropdownId: dropdown.id,
            dropdownName: dropdown.dropdownName,
            selectedValue: values[`dropdown_${dropdown.id}`]
        }));
        onSubmit(values);
    };

    const getAllDropdowns = async () => {
        const response = await axios.get(`/api/router?path=api/dropdownmaster`);
        return response.data;
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dropdownData = await getAllDropdowns();
                setDropdowns(dropdownData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, []);

    const transformOrderDataForForm = (orderData: OrderData | {}) => {
        if (Object.keys(orderData).length === 0) return {}
        const transformedData: any = { ...orderData };
        if ((orderData as OrderData).checklist) {
            (orderData as OrderData).checklist.forEach(item => {
                if (item && item.question) {
                    const slug = toSlugFormat(item.question);
                    transformedData[`checklist_${slug}`] = item.answer;
                }
            });
        }
        return transformedData;
    };

    const territoryManagerValues = dropdowns.find((dropdown: DropdownMaster) => dropdown.dropdownName === 'territoryManager')
    const managerValues = dropdowns.find((dropdown: DropdownMaster) => dropdown.dropdownName === 'manager')

    return (
        <Dialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
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
                    {isEditMode ? "Edit" : "Add"} Order
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
                        ...transformOrderDataForForm(orderDialogData)
                    }}
                    onSubmit={customOnSubmit}
                    render={({ handleSubmit, values }) => (
                        <form onSubmit={handleSubmit}>
                            <Box
                                sx={{
                                    my: 3,
                                    mx: 1,
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                    gap: 3,
                                }}
                            >
                                <Field name="orderId">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Quote Number / CRM Number</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder="Enter Quote Number / CRM Number"
                                            />
                                        </Box>
                                    )}
                                </Field>
                                <Field name="customerName">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Customer Name</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder="Enter customer name"
                                            />
                                        </Box>
                                    )}
                                </Field>
                                <Field name="numberOfTrucks">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">No. of trucks</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder="Enter no. of trucks"
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
                                <Field name="deliveryLocation">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Delivery Location</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder="Enter location"
                                            />
                                        </Box>
                                    )}
                                </Field>
                                <Field name="territoryManager">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Territory Manager</Typography>
                                            <Select {...input} fullWidth>
                                                {territoryManagerValues?.options.map(option => (
                                                    <MenuItem key={option.key} value={option.key}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Box>
                                    )}
                                </Field>
                                <Field name="manager">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Manager</Typography>
                                            <Select {...input} fullWidth>
                                                {managerValues?.options.map(option => (
                                                    <MenuItem key={option.key} value={option.key}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Box>
                                    )}
                                </Field>
                            </Box>
                            <Box mt={3}>
                                <Typography variant="h6" gutterBottom>Truck Accessories Needed</Typography>
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
                                    type="submit"
                                >
                                    Save
                                </Button>}
                            </DialogActions>
                        </form>
                    )}
                />
            </DialogContent>
        </Dialog>
    )
}

export default AddOrderDialog