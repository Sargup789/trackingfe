import { Button, Typography } from "@mui/material"
import { useState } from "react";
import AddTaskDialog from "./AddTaskDialog";
import TaskTable from "./TaskTable"
import { TaskData } from "@/pages/task";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "react-query";

type Props = {
  taskData: TaskData[];
  deleteTask: (id: string) => void;
  refetch: () => void;
  setPage: (page: number) => void
  setSize: (size: number) => void
  page: number
  size: number
};

const queryClient = new QueryClient();

const TaskIndex = ({ taskData, deleteTask, refetch, setPage, setSize, page, size }: Props) => {
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [taskDialogData, setTaskDialogData] = useState<TaskData | {}>({});

  const handleClose = () => {
    setAddTaskDialogOpen(false);
    setTaskDialogData({});
  };

  const onSubmit = async (data: TaskData) => {
    console.log(data, 'data')
    if (Object.keys(taskDialogData).length > 0) {
      const { id, ...rest } = data;
      try {
        const response = await axios.put(
          `/api/router?path=api/trucktasks/${id}`,
          rest
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await axios.post(`/api/router?path=api/trucktasks`, data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    handleClose();
    refetch();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="m-6">
        <Typography align='right' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ marginLeft: '10px' }}>
          </div>
          <Button
            style={{
              borderRadius: 15,
              backgroundColor: "#E96820",
              // padding: "18px 36px",
              fontSize: "13px"
            }}
            variant="contained"
            onClick={() => setAddTaskDialogOpen(true)}
          >
            Add Task
          </Button>
        </Typography>
        <br />
        <TaskTable
          taskData={taskData}
          deleteTask={deleteTask}
          page={page}
          size={size}
          setPage={setPage}
          setSize={setSize}
        />
        <AddTaskDialog
          open={addTaskDialogOpen}
          taskDialogData={taskDialogData}
          handleClose={handleClose}
          onSubmit={onSubmit}
          refetchTask={refetch}
        />
      </div>
    </QueryClientProvider>
  )
}

export default TaskIndex