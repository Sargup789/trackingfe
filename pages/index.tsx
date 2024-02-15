import DashboardIndex from "@/components/DashboardComponents"
import Layout from '@/components/general/Layout'
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";
import { useState } from "react";
import withLogin from "@/components/general/withLogin";
import React from "react";

export interface FiltersState {
  orderId: null | string,
  customerName: null | string,
  deliveryLocation: null | string,
};
export interface OrderData {
  id: string;
  orderId: string;
  customerName: string;
  territoryManager: string;
  deliveryLocation: string;
  manager: string;
  numberOfTrucks: number;
}

export interface OrderApiResponse {
  totalCount: number;
  page: number;
  currentPage: number;
  data: OrderData[];
}

const fetchOrders = async (page = 1, size = 10, filters = {}) => {
  console.log("fetchOrders", process.env.ROOT_URL);
  const response = await axios.get(`/api/router?path=api/order`, {
    params: {
      ...filters,
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
  const [filtersState, setFilterState] = React.useState<FiltersState>({
    orderId: null,
    customerName: null,
    deliveryLocation: null
  })

  const {
    data: orders,
    isLoading,
    refetch,
  }: UseQueryResult<OrderApiResponse, unknown> = useQuery(["zones", page, size, filtersState], () => fetchOrders(page, size, filtersState), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const deleteOrder = async (orderId: string) => {
    await axios.delete(`/api/router?path=api/order/${orderId}`);
    refetch()
  };

  return (
    <Layout>
      {isLoading || !orders ? (
        "Loading..."
      ) : (
        <DashboardIndex
          dashboardApiData={orders}
          deleteOrder={deleteOrder}
          setPage={setPage}
          setSize={setSize}
          filtersState={filtersState}
          setFilterState={setFilterState}
          refetch={refetch}
          page={page}
          size={size} />
      )}    </Layout>
  )
}

export default withLogin(index)