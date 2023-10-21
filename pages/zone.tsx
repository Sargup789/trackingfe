import React from "react";
import { useQuery, UseQueryResult } from "react-query";
import axios from "axios";
import Layout from "@/components/general/Layout";
import ZoneIndex from "@/components/ZoneComponents";
import withLogin from "@/components/general/withLogin";

export interface ZoneData {
  id: string;
  name: string;
  description: string;
  maxCapacity?: string;
  occupiedLocations: string[];
  isActive: boolean;
  isFinalZone: boolean;
  locationPrefix: string;
  isParentZone: boolean;
  isSubZone: boolean;
  parentZoneId: string | null;
  createdAt: string;
  updatedAt: string;
  subZones: ZoneData[] | null
}

const fetchZones = async (page = 1, size = 10) => {
  console.log("fetchZones", process.env.ROOT_URL);
  const response = await axios.get(`/api/router?path=api/zones`, {
    params: {
      page,
      size
    }
  });
  console.log(response.data, "response.data");
  return response.data;
};


const Zone = () => {
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);

  const {
    data: zones,
    isLoading,
    refetch,
  }: UseQueryResult<ZoneData[], unknown> = useQuery(["zones", page, size], () => fetchZones(page, size), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });


  const deleteZone = async (id: string) => {
    await axios.delete(`/api/router?path=api/zones/${id}`);
    refetch()
  };

  console.log(zones, "zones");

  return (
    <Layout>
      {isLoading || !zones ? (
        "Loading..."
      ) : (
        <ZoneIndex zoneData={zones} deleteZone={deleteZone} refetch={refetch} setPage={setPage}
          setSize={setSize}
          page={page}
          size={size} />
      )}
    </Layout>
  );
};

export default withLogin(Zone);
