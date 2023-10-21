import Layout from "@/components/general/Layout"
import TaskIndex from "@/components/TaskComponents"
import axios from "axios";
import React from "react";
import { useQuery, UseQueryResult } from "react-query";
import { TruckData } from "./trucks";
import { ZoneData } from "./zone";
import withLogin from "@/components/general/withLogin";

export interface TaskData {
  id: string;
  truckId: string;
  fromZoneId: string;
  toZoneId: string;
  assignedTo: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  truck: TruckData;
  zone: ZoneData;
  toZone: ZoneData;
}

const fetchTasks = async (page = 1, size = 10) => {
  console.log("fetchTasks", process.env.ROOT_URL);
  const response = await axios.get(`/api/router?path=api/trucktasks`, {
    params: {
      page,
      size
    }
  });
  console.log(response.data, "response.data");
  return response.data;
};


const Task = () => {
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);

  const {
    data: tasks,
    isLoading,
    refetch,
  }: UseQueryResult<TaskData[], unknown> = useQuery(["tasks", page, size], () => fetchTasks(page, size), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const deleteTask = async (id: string) => {
    await axios.delete(`/api/router?path=api/trucktasks/${id}`);
    refetch()
  };


  return (
    <Layout>
      {isLoading || !tasks ? (
        "Loading..."
      ) : (
        <TaskIndex
          taskData={tasks}
          deleteTask={deleteTask}
          refetch={refetch}
          page={page}
          size={size}
          setPage={setPage}
          setSize={setSize} />
      )}
    </Layout>
  )
}
export default withLogin(Task)