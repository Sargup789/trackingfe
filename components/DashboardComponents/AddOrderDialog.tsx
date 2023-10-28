import { OrderData } from "@/pages";
import { HighlightOff } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Field, Form } from "react-final-form";



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
    return (
        <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
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
                    initialValues={orderDialogData}
                    onSubmit={onSubmit}
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
                                            <Typography className="label">Order ID</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder="Enter order id"
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
                                <Field name="customerAddress">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Customer Address</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder="Enter address"
                                            />
                                        </Box>
                                    )}
                                </Field>
                                <Field name="customerPhone">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Customer Phone</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder="Enter phone no."
                                            />
                                        </Box>
                                    )}
                                </Field>
                                <Field name="customerEmail">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Customer Email</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder="Enter email id"
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