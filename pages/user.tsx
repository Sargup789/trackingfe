import Layout from "@/components/general/Layout"
import withLogin from "@/components/general/withLogin"
import UserIndex from "@/components/UserComponents"
import axios from "axios";
import React from "react";
import { useQuery, UseQueryResult } from "react-query";

export interface UserData {
    id: string;
    username: string;
    password: string;
    role: string;
    allowedApplication: string;
}

export interface UserApiResponse {
    totalCount: number;
    page: number;
    currentPage: number;
    data: UserData[];
}

const fetchUsers = async (page = 1, size = 10) => {
    console.log("fetchUsers", process.env.ROOT_URL);
    const response = await axios.get(`/api/router?path=api/auth/users`, {
        params: {
            page,
            size
        }
    });
    console.log(response.data, "response.data");
    return response.data;
};

const Users = () => {
    const [page, setPage] = React.useState(1);
    const [size, setSize] = React.useState(10);

    const {
        data: users,
        isLoading,
        refetch,
    }: UseQueryResult<UserApiResponse, unknown> = useQuery(["users", page, size], () => fetchUsers(page, size), {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const deleteUser = async (id: string) => {
        await axios.delete(`/api/router?path=api/auth/${id}`);
        refetch()
    };

    return (
        <Layout>
            {isLoading || !users ? (
                "Loading..."
            ) : (
                <UserIndex
                    userApiData={users}
                    deleteUser={deleteUser}
                    refetch={refetch}
                    page={page}
                    size={size}
                    setPage={setPage}
                    setSize={setSize} />
            )}
        </Layout>
    )
}

export default withLogin(Users)