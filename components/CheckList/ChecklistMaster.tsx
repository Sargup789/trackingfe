import React, { useState, useEffect } from 'react';
import {
    Box, Table, TableBody, TableCell, TableHead, TableRow,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Tooltip, IconButton, FormControlLabel, Switch
} from '@mui/material';
import { EditOutlined, DeleteOutline, Add, HighlightOff } from '@mui/icons-material';
import axios from 'axios';

export interface Checklist {
    id: string;
    question: string;
    options: string[];
    isActive: boolean;
}

const ChecklistMaster: React.FC = () => {
    const [checklists, setChecklists] = useState<Checklist[]>([]);
    const [currentChecklist, setCurrentChecklist] = useState<Checklist | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    useEffect(() => {
        fetchChecklists();
    }, []);

    const fetchChecklists = async () => {
        const response = await axios.get('/api/router?path=api/checklist');
        setChecklists(response.data);
    };

    const handleEdit = (checklist: Checklist) => {
        setCurrentChecklist(checklist);
        setModalOpen(true);
    };

    const handleCreate = () => {
        setCurrentChecklist({
            id: '',
            question: '',
            options: ['yes', 'no'],
            isActive: true
        });
        setModalOpen(true);
    }

    const handleSave = async () => {
        if (currentChecklist) {
            if (currentChecklist.id) {
                await axios.put(`/api/router?path=api/checklist/${currentChecklist.id}`, { question: currentChecklist.question });
            } else {
                const { id, ...rest } = currentChecklist;
                await axios.post('/api/router?path=api/checklist', rest);
            }
            fetchChecklists();
            setModalOpen(false);
        }
    };

    const handleDelete = async (id: string) => {
        await axios.delete(`/api/router?path=api/checklist/${id}`);
        fetchChecklists();
    };

    return (
        <Box p={3} bgcolor="white" boxShadow={2}>
            <Box display="flex" justifyContent="space-between" marginBottom={2}>
                <strong>Checklist Master</strong>
                <Button
                    startIcon={<Add />}
                    variant="contained"
                    style={{
                        borderRadius: 15,
                        backgroundColor: "#E96820",
                        fontSize: "13px"
                    }}
                    onClick={handleCreate}
                >
                    Add New
                </Button>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Sl No.</TableCell>
                        <TableCell>Question</TableCell>
                        <TableCell>Options</TableCell>
                        <TableCell>Is Active</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {checklists.map((checklist, index) => (
                        <TableRow key={checklist.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{checklist.question}</TableCell>
                            <TableCell>{checklist.options.join(', ')}</TableCell>
                            <TableCell>{checklist.isActive ? 'Yes' : 'No'}</TableCell>
                            <TableCell>
                                <Tooltip title="Edit">
                                    <IconButton size="small" onClick={() => handleEdit(checklist)}>
                                        <EditOutlined fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton size="small" onClick={() => handleDelete(checklist.id)}>
                                        <DeleteOutline fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
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
                        {currentChecklist?.id ? 'Edit Checklist' : 'Create Checklist'}
                    </Box>
                    <IconButton
                        children={<HighlightOff />}
                        color="inherit"
                        onClick={() => setModalOpen(false)}
                        sx={{ transform: "translate(8px, -8px)" }}
                    />
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Question"
                        value={currentChecklist?.question || ''}
                        sx={{ margin: "6px 3px" }}
                        onChange={e => setCurrentChecklist({ ...currentChecklist!, question: e.target.value })}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={currentChecklist?.isActive || false}
                                onChange={e => setCurrentChecklist({ ...currentChecklist!, isActive: e.target.checked })}
                                color="primary"
                            />
                        }
                        label="Is Active"
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" style={{
                        borderRadius: 15,
                        backgroundColor: "#E96820",
                        fontSize: "13px"
                    }} onClick={handleSave}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ChecklistMaster;
