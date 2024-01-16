import { Button, Typography } from "@mui/material"
import { useState } from "react";
import AddUserDialog from "./AddUserDialog";
import UserTable from "./Usertable"
import { UserApiResponse, UserData } from "@/pages/user";
import { QueryClient, QueryClientProvider } from "react-query";
import axios from "axios";

type Props = {
    userApiData: UserApiResponse;
    deleteUser: (id: string) => void;
    refetch: () => void;
    setPage: (page: number) => void
    setSize: (size: number) => void
    page: number
    size: number
}

const queryClient = new QueryClient();

const UserIndex = ({ userApiData, deleteUser, refetch, setPage, setSize, page, size }: Props) => {
    const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
    const [userDialogData, setUserDialogData] = useState<UserData | {}>({});

    const handleClose = () => {
        setAddUserDialogOpen(false);
        setUserDialogData({});
    };

    const onSubmit = async (data: UserData) => {
        console.log(data, 'data')
        if (Object.keys(userDialogData).length > 0) {
            const { id, ...rest } = data;
            try {
                const response = await axios.put(
                    `/api/router?path=api/auth/users/${id}`,
                    rest
                );
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const response = await axios.post(`/api/router?path=api/auth/register`, data);
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
                        onClick={() => setAddUserDialogOpen(true)}
                    >
                        Add User
                    </Button>
                </Typography>
                <br />
                <UserTable
                    userApiData={userApiData}
                    deleteUser={deleteUser}
                    page={page}
                    size={size}
                    setPage={setPage}
                    setSize={setSize}
                />
                <AddUserDialog
                    open={addUserDialogOpen}
                    userDialogData={userDialogData}
                    handleClose={handleClose}
                    onSubmit={onSubmit}
                />
            </div>
        </QueryClientProvider>
    )
}

export default UserIndex