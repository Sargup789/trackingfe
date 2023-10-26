import DashboardIndex from "@/components/DashboardComponents"
import Layout from '@/components/general/Layout'
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";
import { useState } from "react";
import withLogin from "@/components/general/withLogin";


export interface OrderData {
  id: string;
  orderId: string;
  customerName: string;
  customerAddress: string;
  deliveryLocation: string;
  customerPhone: string;
  customerEmail: string;
  numberOfTrucks: number;
}

const fetchOrders = async (page = 1, size = 10) => {
  console.log("fetchOrders", process.env.ROOT_URL);
  const response = await axios.get(`/api/router?path=api/order`, {
    params: {
      page,
      size
    }
  });
  console.log(response.data, "response.data");
  return response.data;
};


const index = () => {

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);


  const {
    data: orders,
    isLoading,
    refetch,
  }: UseQueryResult<OrderData[], unknown> = useQuery(["zones", page, size], () => fetchOrders(page, size), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const deleteOrder = async (id: string) => {
    await axios.delete(`/api/router?path=api/order/${id}`);
    refetch()
  };


  return (
    <Layout>
      {isLoading || !orders ? (
        "Loading..."
      ) : (
        <DashboardIndex
          dashboardData={orders}
          deleteOrder={deleteOrder}
          setPage={setPage}
          setSize={setSize}
          refetch={refetch}
          page={page}
          size={size} />
      )}    </Layout>
  )
}

export default withLogin(index)