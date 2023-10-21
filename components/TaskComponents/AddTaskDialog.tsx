import { TaskData } from "@/pages/task";
import { HighlightOff } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import TruckTable from "../TruckComponents/TruckTable";
import { FiltersState, TruckData, fetchTrucks } from "@/pages/trucks";
import React, { useState } from "react";
import { UseQueryResult, useQuery } from "react-query";
import TruckTableFilters from "./TruckTableFilters";
import axios from "axios";
import { toast } from "react-toastify";
import ZoneSelectionModal from "./ZoneSelectionModal";



interface TaskDialogProps {
  open: boolean;
  handleClose: () => void;
  refetchTask: () => void;
  taskDialogData: TaskData | {};
  onSubmit: (values: TaskData) => void;
}
const AddTaskDialog: React.FC<TaskDialogProps> = ({
  open,
  handleClose,
  refetchTask,
  taskDialogData,
  onSubmit,
}) => {
  const isEditMode = Object.keys(taskDialogData).length > 0;

  const [isZoneModalOpen, setZoneModalOpen] = useState(false);
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);

  const handleCreateTask = (zoneId: string) => {
    if (selectedTruckId) {
      const payload = {
        truckId: selectedTruckId,
        toZoneId: zoneId,
        assignedTo: "user1", // Adjust this if necessary
        status: "Pending"
      };
      axios.post('/api/router?path=api/trucktasks', payload)
        .then(() => {
          toast.success('Task created successfully.');
          handleClose();
          refetchTask()
          setZoneModalOpen(false);
        })
        .catch((error) => {
          const errmsg = error?.response?.data?.message;
          toast.error(errmsg || 'Error creating the task.');
        });
    } else {
      toast.error('Please select a truck.');
    }
  };


  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [filtersState, setFilterState] = React.useState<FiltersState>({
    zoneId: null,
    make: null,
    model: null,
    manufacturedYear: { condition: "=", value: null },
    serialNumber: null,
    fuelType: null,
    isRetailReady: null,
    status: null,
    hourMeter: { condition: "=", value: null },
    arrivalDate: null,
    batteryMake: null,
    batteryModel: null,
  })

  const {
    data: trucks,
    isLoading,
    refetch,
  }: UseQueryResult<TruckData[], unknown> = useQuery(["trucks", page, size, filtersState], () => fetchTrucks(page, size, filtersState), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });



  return (
    <Dialog maxWidth="xl" fullWidth open={open} onClose={handleClose}>
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
          {isEditMode ? "Edit" : "Add"} Task
        </Box>

        <IconButton
          children={<HighlightOff />}
          color="inherit"
          onClick={handleClose}
          sx={{ transform: "translate(8px, -8px)" }}
        />
      </DialogTitle>
      <DialogContent>
        <TruckTableFilters setFilterState={setFilterState} filtersState={filtersState} />
        <br />
        {trucks && <TruckTable
          truckData={trucks}
          deleteTruck={() => { }}
          editTruck={() => { }}
          viewTruck={() => { }}
          setPage={setPage}
          setSize={setSize}
          page={page}
          size={size}
          onRowSelect={setSelectedTruckId}
        />}
        <DialogActions>
          <Button
            style={{
              borderRadius: 15,
              backgroundColor: "#E96820",
              fontSize: "13px"
            }}
            variant="contained"
            onClick={() => setZoneModalOpen(true)}
          >
            Create Task
          </Button>
        </DialogActions>
        <ZoneSelectionModal
          open={isZoneModalOpen}
          handleClose={() => setZoneModalOpen(false)}
          onSubmit={handleCreateTask}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddTaskDialog