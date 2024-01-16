import TruckIndex from "@/components/TruckComponents"
import Layout from "@/components/general/Layout"
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";
import React from "react";
import withLogin from "@/components/general/withLogin";

export interface FiltersState {
  vin: null | string,
  modelNumber: null | string,
  stockNumber: null | string,
  serialNumber: null | string,
  orderId: null | string
};

export interface TruckApiResponse {
  totalCount: number;
  page: number;
  currentPage: number;
  data: TruckData[];
}

export interface TruckData {
  id: string;
  orderId: string;
  vin: string;
  modelNumber: string;
  stockNumber: string;
  checklist: ChecklistItemData[];
  serialNumber: string;
  status: string;
  leadTime: number;
}
export interface ChecklistItemData {
  question: string;
  answer: "yes" | "no";
  leadTime: number;
  status: "PO GENERATED" | "AWAITING DELIVERY" | "DELIVERED"
  isActive: boolean;
}

export const fetchTrucks = async (page = 1, size = 10, filters = {}) => {
  console.log("fetchTrucks", process.env.ROOT_URL);
  const response = await axios.get(`/api/router?path=api/truck`, {
    params: {
      ...filters,
      page,
      size
    }
  });
  return response.data;
};

const Trucks = () => {
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [filtersState, setFilterState] = React.useState<FiltersState>({
    orderId: null,
    vin: null,
    modelNumber: null,
    stockNumber: null,
    serialNumber: null
  })

  const {
    data: trucks,
    isLoading,
    refetch,
  }: UseQueryResult<TruckApiResponse, unknown> = useQuery(["trucks", page, size, filtersState], () => fetchTrucks(page, size, filtersState), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });


  const deleteTruck = async (id: string) => {
    await axios.delete(`/api/router?path=api/truck/${id}`);
    refetch()
  };

  return (
    <Layout>

      {isLoading || !trucks ? (
        "Loading..."
      ) : (
        <TruckIndex
          truckApiData={trucks}
          deleteTruck={deleteTruck}
          refetch={refetch}
          setPage={setPage}
          setSize={setSize}
          filtersState={filtersState}
          setFilterState={setFilterState}
          page={page}
          size={size}
        />
      )}
    </Layout>
  )
}

export default withLogin(Trucks)