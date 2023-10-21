import TruckIndex from "@/components/TruckComponents"
import Layout from "@/components/general/Layout"
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";
import { ZoneData } from "./zone";
import React from "react";
import withLogin from "@/components/general/withLogin";

type ConditionValue = {
  condition: ">" | "=" | "<";
  value: string | null;
};

export interface FiltersState {
  zoneId: null | string,
  make: null | string,
  model: null | string,
  manufacturedYear: null | ConditionValue,
  hourMeter: null | ConditionValue,
  serialNumber: null | string,
  fuelType: null | string,
  isRetailReady: null | boolean,
  status: null | string,
  arrivalDate: null | string
  batteryMake: null | string,
  batteryModel: null | string,
};

export interface TruckData {
  id: string;
  orderId: string;
  vin: string;
  modelNumber: string;
  stockNumber: string;
  checklist: ChecklistItemData[];
  serialNumber: string;
}
export interface ChecklistItemData {
  question: string;
  answer: "Yes" | "No";
  isActive: boolean;
}

export const fetchTrucks = async (page = 1, size = 10) => {
  console.log("fetchTrucks", process.env.ROOT_URL);
  const response = await axios.get(`/api/router?path=api/truck`, {
    params: {
      // ...filters,
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
  }: UseQueryResult<TruckData[], unknown> = useQuery(["trucks", page, size, filtersState], () => fetchTrucks(page, size), {
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
          truckData={trucks}
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