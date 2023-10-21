import { ZoneData } from "@/pages/zone";
import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";

type Props = {
    tvData: ZoneData[];
};

const queryClient = new QueryClient();

const TvIndex = ({ tvData }: Props) => {

    const sumOfValue = (array: number[]) => {
        let sum = 0
        for (let i = 0; i < array.length; i++) {
            sum += array[i];
        }
        return sum
    }

    const allSubZones = tvData.map((zone) => zone.subZones).flat().filter(Boolean)

    return (
        <QueryClientProvider client={queryClient}>
            <Typography sx={{ fontSize: 18 }}>Parent Zones</Typography>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                        lg: "1fr 1fr 1fr",
                        xl: "1fr 1fr 1fr",
                    },
                    gap: 5,
                    columnGap: 4,
                    pt: 2,
                }}
            >
                {tvData.map((row) => (
                    <Card key={row.id}>
                        <CardContent>
                            <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
                                Name: <b>{row.name}</b>
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Typography sx={{ fontSize: 18, marginLeft: 1 }} color="text.secondary" gutterBottom>
                                Occupied: <b>{row?.isParentZone && row.subZones ? sumOfValue(row.subZones.map((zone) => zone.occupiedLocations.length)) : row.occupiedLocations.length}</b>
                            </Typography>
                            <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
                                | Available: <b>{(row?.isParentZone && row.subZones ? sumOfValue(row.subZones.map((zone: any) => zone.maxCapacity ? parseInt(zone.maxCapacity) : 0)) : (parseInt(row.maxCapacity as string))) - (row?.isParentZone && row.subZones ? sumOfValue(row.subZones.map((zone) => zone.occupiedLocations.length)) : row.occupiedLocations.length)}</b>
                            </Typography>
                            <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
                                | Total: <b>{row?.isParentZone && row.subZones ? sumOfValue(row.subZones.map((zone: any) => zone.maxCapacity ? parseInt(zone.maxCapacity) : 0)) : (parseInt(row.maxCapacity as string))}</b>
                            </Typography>
                        </CardActions>
                    </Card>
                ))}
            </Box>
            <br />
            <Typography sx={{ fontSize: 18 }}>Sub Zones</Typography>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                        lg: "1fr 1fr 1fr",
                        xl: "1fr 1fr 1fr",
                    },
                    gap: 5,
                    columnGap: 4,
                    pt: 2,
                }}
            >
                {allSubZones?.map((subRow: any) => (
                    <Card key={subRow?.id}>
                        <CardContent>
                            <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
                                Name: <b>{subRow?.name}</b>
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Typography sx={{ fontSize: 18, marginLeft: 1 }} color="text.secondary" gutterBottom>
                                Occupied: <b>{subRow?.occupiedLocations?.length || 0}</b>
                            </Typography>
                            <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
                                | Available: <b>{(parseInt(subRow.maxCapacity ? subRow.maxCapacity : "0") - (subRow.occupiedLocations.length || 0))}</b>
                            </Typography>
                            <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
                                | Total: <b>{subRow.maxCapacity}</b>
                            </Typography>
                        </CardActions>
                    </Card>
                ))
                }
            </Box>
        </QueryClientProvider>
    )
}
export default TvIndex;

