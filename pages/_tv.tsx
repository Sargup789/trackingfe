import Layout from "@/components/general/Layout"
import withLogin from "@/components/general/withLogin";
import TvIndex from "@/components/TvDashboard";
import axios from "axios";
import { useState } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { ZoneData } from "./zone";

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

const Tv = () => {

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);

    const {
        data: zones,
        isLoading,
        refetch,
    }: UseQueryResult<ZoneData[], unknown> = useQuery(["zones", page, size], () => fetchZones(page, size), {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return (
        <Layout>
            {isLoading || !zones ? (
                "Loading..."
            ) : (
                <TvIndex tvData={zones} />
            )}
        </Layout>
    )
}

export default withLogin(Tv);
