import { Box, Button, Typography } from "@mui/material";
import DashboardTable from "./DashboardTable";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import { FiltersState, OrderData } from "@/pages";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AddOrderDialog from "./AddOrderDialog";
import OrderTableFilters from "../FilterComponents/OrderTableFilters";

type Props = {
    dashboardData: OrderData[];
    refetch: () => void;
    deleteOrder: (id: string) => void;
    setPage: (page: number) => void
    setSize: (size: number) => void
    page: number
    size: number
    setFilterState: (values: any) => void;
    filtersState: FiltersState
};

const queryClient = new QueryClient();
const DashboardIndex = ({ dashboardData, deleteOrder, refetch, setSize, setPage, page, size, filtersState, setFilterState }: Props) => {
    const [addOrderDialogOpen, setAddOrderDialogOpen] = useState(false);
    const [orderDialogData, setOrderDialogData] = useState<OrderData | {}>({});
    const [showFilters, setShowFilters] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);

    const viewOrder = (order: OrderData) => {
        setOrderDialogData(order);
        setAddOrderDialogOpen(true);
        setIsViewMode(true);
    }

    const editOrder = (order: OrderData) => {
        setOrderDialogData(order);
        setAddOrderDialogOpen(true);
    };

    const handleClose = () => {
        setAddOrderDialogOpen(false);
        setOrderDialogData({});
        setIsViewMode(false);
    };

    const onSubmit = async (data: OrderData) => {
        if (Object.keys(orderDialogData).length > 0) {
            const { id, orderId, ...rest } = data;
            try {
                const response = await axios.put(
                    `/api/router?path=api/order/${orderId}`,
                    rest
                );
                toast.success("Successfully updated order");
                console.log(response.data);
            } catch (error: any) {
                const errmsg = error?.response?.data?.message;
                toast.error(errmsg || "Something went wrong");
            }
        } else {
            try {
                const response = await axios.post(`/api/router?path=api/order`, data);
                toast.success("Successfully created order");
            } catch (error: any) {
                const errmsg = error?.response?.data?.message;
                toast.error(errmsg || "Something went wrong");
            }
        }
        handleClose();
        refetch();
    };

    const ifFilterStateObjectNotNull = (obj: FiltersState) => {
        return Object.entries(obj).some(([key, value]) => {
            if (value === null || value === '') return false;
            if (typeof value === 'object' && value.condition === "=" && value.value === null) return false;
            return true;
        });
    }

    const router = useRouter()
    return (
        <QueryClientProvider client={queryClient}>
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button
                    style={{
                        borderRadius: 15,
                        backgroundColor: "#E96820",
                        fontSize: "13px"
                    }}
                    variant="contained"
                    onClick={() => setShowFilters(prev => !prev)}
                >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
                <Typography align='left' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button
                        style={{
                            borderRadius: 15,
                            backgroundColor: "#E96820",
                            fontSize: "13px"
                        }}
                        variant="contained"
                        onClick={() => setAddOrderDialogOpen(true)}
                    >
                        Add Order
                    </Button>
                </Typography>
            </Box>
            {(showFilters || ifFilterStateObjectNotNull(filtersState)) && (
                <Box sx={{ background: 'white', width: '100%', marginTop: '20px' }}>
                    <OrderTableFilters setFilterState={setFilterState} filtersState={filtersState} />
                </Box>
            )}
            <br />
            <DashboardTable
                dashboardData={dashboardData}
                setPage={setPage}
                setSize={setSize}
                editOrder={editOrder}
                viewOrder={viewOrder}
                deleteOrder={deleteOrder}
                page={page}
                size={size}
            />
            <AddOrderDialog
                open={addOrderDialogOpen}
                isViewMode={isViewMode}
                orderDialogData={orderDialogData}
                handleClose={handleClose}
                onSubmit={onSubmit}
            />
        </QueryClientProvider>
    )
}

export default DashboardIndex