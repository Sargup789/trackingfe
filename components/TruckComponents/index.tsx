import { Box, Button, Tooltip, Typography } from "@mui/material"
import { useState } from "react";
import AddTruckDialog from "./AddTruckDialog";
import TruckTable from "./TruckTable"
import { FiltersState, TruckData } from "@/pages/trucks";
import { QueryClient, QueryClientProvider } from "react-query";
import axios from "axios";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import xlsx from "json-as-xlsx"
import { toast } from "react-toastify";
import TruckTableFilters from "../TaskComponents/TruckTableFilters";

type Props = {
    truckData: TruckData[];
    deleteTruck: (id: string) => void;
    refetch: () => void;
    setPage: (page: number) => void
    setSize: (size: number) => void
    page: number
    size: number
    setFilterState: (values: any) => void;
    filtersState: FiltersState
};
const queryClient = new QueryClient();

const TruckIndex = ({ truckData, deleteTruck, refetch, setPage, setSize, page, size, filtersState, setFilterState }: Props) => {
    const [addTruckDialogOpen, setAddTruckDialogOpen] = useState(false);
    const [truckDialogData, setTruckDialogData] = useState<TruckData | {}>({});
    const [showFilters, setShowFilters] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);

    const viewTruck = (zone: TruckData) => {
        setTruckDialogData(zone);
        setAddTruckDialogOpen(true);
        setIsViewMode(true);
    }


    const editTruck = (zone: TruckData) => {
        setTruckDialogData(zone);
        setAddTruckDialogOpen(true);
    };

    const handleClose = () => {
        setAddTruckDialogOpen(false);
        setTruckDialogData({});
        setIsViewMode(false);
    };


    const onSubmit = async (data: TruckData) => {
        if (Object.keys(truckDialogData).length > 0) {
            const { id, ...rest } = data;
            try {
                const response = await axios.put(
                    `/api/router?path=api/truck/${id}`,
                    rest
                );
                toast.success("Successfully updated truck");
                console.log(response.data);
            } catch (error: any) {
                const errmsg = error?.response?.data?.message;
                toast.error(errmsg || "Something went wrong");
            }
        } else {
            try {
                const response = await axios.post(`/api/router?path=api/truck`, data);
                toast.success("Successfully created truck");
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
                        onClick={() => setAddTruckDialogOpen(true)}
                    >
                        Add Truck
                    </Button>
                    {/* <Tooltip style={{
                        margin: "18px 20px",
                    }} title="Export to Excel" onClick={downloadFile}>
                        <FileDownloadIcon />
                    </Tooltip> */}
                </Typography>
            </Box>
            {(showFilters || ifFilterStateObjectNotNull(filtersState)) && (
                <Box sx={{ background: 'white', width: '100%', marginTop: '20px' }}>
                    <TruckTableFilters setFilterState={setFilterState} filtersState={filtersState} />
                </Box>
            )}
            <br />
            <TruckTable
                truckData={truckData}
                deleteTruck={deleteTruck}
                editTruck={editTruck}
                viewTruck={viewTruck}
                setPage={setPage}
                setSize={setSize}
                page={page}
                size={size}
            />
            <AddTruckDialog
                open={addTruckDialogOpen}
                isViewMode={isViewMode}
                truckDialogData={truckDialogData}
                handleClose={handleClose}
                onSubmit={onSubmit}
            />
        </QueryClientProvider>
    );
}

export default TruckIndex