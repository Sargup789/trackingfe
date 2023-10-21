import React, { useState, useEffect } from 'react';
import { ZoneData } from "@/pages/zone";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, ListSubheader, MenuItem, Select, IconButton, Box } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { HighlightOff } from '@mui/icons-material';

const ZoneDropdown: React.FC<{
    zones: ZoneData[];
    selectedZoneId: string | null;
    onZoneChange: (zoneId: string) => void;
}> = ({ zones, selectedZoneId, onZoneChange }) => {

    const renderZoneItems = (zone: ZoneData) => {
        const items = [];

        if (zone.isParentZone) {
            items.push(<ListSubheader key={zone.id}>{zone.name}</ListSubheader>);
        } else {
            items.push(<MenuItem key={zone.id} value={zone.id}>{zone.name}</MenuItem>);
        }

        if (zone.subZones) {
            zone.subZones.forEach((subZone: ZoneData) => {
                items.push(<MenuItem key={subZone.id} value={subZone.id}>&nbsp;&nbsp;{subZone.name}</MenuItem>);
            });
        }

        return items;
    };

    return (
        <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="zoneId">Select Zone</InputLabel>
            <Select
                id="zoneId"
                value={selectedZoneId || ""}
                onChange={(e) => onZoneChange(e.target.value as string)}
            >
                {zones.map(zone => renderZoneItems(zone))}
            </Select>
        </FormControl>
    );
};

const ZoneSelectionModal: React.FC<{
    open: boolean;
    handleClose: () => void;
    onSubmit: (zoneId: string) => void;
}> = ({ open, handleClose, onSubmit }) => {
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
    const [zones, setZones] = useState<ZoneData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setIsLoading(true);
            axios.get('/api/router?path=api/zones')
                .then(res => {
                    setZones(res.data);
                    setIsLoading(false);
                })
                .catch(() => {
                    toast.error('Error fetching zones.');
                    setIsLoading(false);
                });
        }
    }, [open]);

    const handleZoneSubmit = () => {
        if (selectedZoneId) {
            onSubmit(selectedZoneId);
        } else {
            // You can display a toast message here, if required.
        }
    };

    return (
        <Dialog maxWidth="xs" fullWidth open={open} onClose={handleClose}>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    Select a Zone
                </Box>
                <IconButton
                    children={<HighlightOff />}
                    color="inherit"
                    onClick={handleClose}
                    sx={{ transform: "translate(8px, -8px)" }}
                />
            </DialogTitle>
            <DialogContent>
                {isLoading ? (
                    <p>Loading zones...</p>
                ) : (
                    <ZoneDropdown
                        zones={zones}
                        selectedZoneId={selectedZoneId}
                        onZoneChange={(value) => setSelectedZoneId(value)}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    style={{
                        borderRadius: 15,
                        backgroundColor: "#E96820",
                        fontSize: "13px"
                    }}
                    onClick={handleZoneSubmit}
                    variant="contained" >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ZoneSelectionModal;
