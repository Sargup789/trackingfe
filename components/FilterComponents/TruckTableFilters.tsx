import { Box, FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useCallback } from 'react';
import { UseQueryResult, useQuery } from 'react-query';
import "react-datepicker/dist/react-datepicker.css";
import debounce from 'lodash/debounce';
import { FiltersState } from '@/pages/trucks';

type Props = {
    setFilterState: (values: any) => void;
    filtersState: FiltersState
}
export interface FiltersData {
    vinData: string[],
    orderIdData: string[],
    modelNumberData: string[],
    stockNumberData: string[],
    serialNumberData: string[]
}

const fetchFilter = async () => {
    const response = await axios.get(`/api/router?path=api/truck/filters`);
    return response.data;
};

type FilterFormControlProps = {
    label: string;
    values: Array<any> | undefined;
    selectedValue: string | null | boolean;
    onFilterChange: (value: string) => void;
    onClearClick: () => void;
}

const FilterFormControl = ({ label, values, selectedValue, onFilterChange, onClearClick }: FilterFormControlProps) => (
    <FormControl sx={{ width: '50%', marginRight: '10px' }}>
        <InputLabel className="label" size='small'>{label}</InputLabel>
        <Select
            fullWidth
            size='small'
            label
            onChange={(e: any) => onFilterChange(e.target.value)}
            value={selectedValue}
            endAdornment={
                <IconButton sx={{ display: selectedValue ? "" : "none" }}
                    onClick={onClearClick}>
                    <ClearIcon />
                </IconButton>
            }>
            {values && values?.map((value, index) =>
                <MenuItem key={index} value={value.zoneId || value}>
                    {value.zoneName || value}
                </MenuItem>
            )}
        </Select>
    </FormControl>
)

const TruckTableFilters = ({ filtersState, setFilterState }: Props) => {

    const {
        data: filters,
    }: UseQueryResult<FiltersData, unknown> = useQuery(["filters"], () => fetchFilter(), {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const handleFilterStateChange = (key: string, value: any) => {
        const newState: any = { ...filtersState };
        newState[key] = value;
        setFilterState(newState);
    }

    const handleClearClick = (key: string) => {
        const newState: any = { ...filtersState };
        newState[key] = null;
        setFilterState(newState);
    }

    const debouncedChange = useCallback(
        debounce((key, value) => {
            handleFilterStateChange(key, value);
        }, 1000),
        []
    );

    return (
        <div style={{ padding: '10px' }}>
            <Box sx={{ display: 'flex', width: '100%' }}>
                <FilterFormControl
                    label="Quote Number"
                    values={filters?.orderIdData}
                    selectedValue={filtersState?.orderId}
                    onFilterChange={(value) => handleFilterStateChange('orderId', value)}
                    onClearClick={() => handleClearClick('orderId')}
                />
                <FilterFormControl
                    label="Truck Number / VIN / SR Number"
                    values={filters?.vinData}
                    selectedValue={filtersState?.vin}
                    onFilterChange={(value) => handleFilterStateChange('vin', value)}
                    onClearClick={() => handleClearClick('vin')}
                />
                <FilterFormControl
                    label="Serial Number"
                    values={filters?.serialNumberData}
                    selectedValue={filtersState?.serialNumber}
                    onFilterChange={(value) => handleFilterStateChange('serialNumber', value)}
                    onClearClick={() => handleClearClick('serialNumber')}
                />
            </Box>
            <br />
            <Box sx={{ display: 'flex', width: '100%' }}>
                <FilterFormControl
                    label="Stock Number"
                    values={filters?.stockNumberData}
                    selectedValue={filtersState?.stockNumber}
                    onFilterChange={(value) => handleFilterStateChange('stockNumber', value)}
                    onClearClick={() => handleClearClick('stockNumber')}
                />
                <FilterFormControl
                    label="Model Number"
                    values={filters?.modelNumberData}
                    selectedValue={filtersState?.modelNumber}
                    onFilterChange={(value) => handleFilterStateChange('modelNumber', value)}
                    onClearClick={() => handleClearClick('modelNumber')}
                />
            </Box>
        </div>
    )
}

export default TruckTableFilters;
