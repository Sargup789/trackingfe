import { Box, FormControl, IconButton, Input, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import axios from 'axios';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useCallback } from 'react';
import { UseQueryResult, useQuery } from 'react-query';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import debounce from 'lodash/debounce';
import { FiltersState } from '@/pages/trucks';

type Props = {
    setFilterState: (values: any) => void;
    filtersState: FiltersState
}

export interface FiltersData {
    zones: { zoneId: string, zoneName: string }[];
    manufacturerdYearsData: string[]
    serialNumbersData: string[]
    makeData: string[]
    modelData: string[],
    fuelTypeData: string[],
    isRetailReady: boolean[],
    statusData: string[],
    hourMeterData: string[],
    arrivalDates: string[]
    batteryMakes: string[],
    batteryModels: string[]
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

    const [manufacturedYearValue, setManufacturedYearValue] = React.useState(filtersState.manufacturedYear?.value || "");
    const [hourMeterValue, setHourMeterValue] = React.useState(filtersState.hourMeter?.value || "");


    const handleDateChange = (date: Date) => {
        if (!date) handleFilterStateChange('arrivalDate', null);
        else handleFilterStateChange('arrivalDate', moment(date).format("DD-MM-YYYY"));
    }

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
                    label="Zone Name"
                    values={filters?.zones}
                    selectedValue={filtersState?.zoneId}
                    onFilterChange={(value) => handleFilterStateChange('zoneId', value)}
                    onClearClick={() => handleClearClick('zoneId')}
                />
                <FilterFormControl
                    label="Vehicle Make"
                    values={filters?.makeData}
                    selectedValue={filtersState?.make}
                    onFilterChange={(value) => handleFilterStateChange('make', value)}
                    onClearClick={() => handleClearClick('make')}
                />
                <FilterFormControl
                    label="Serial Number"
                    values={filters?.serialNumbersData}
                    selectedValue={filtersState?.serialNumber}
                    onFilterChange={(value) => handleFilterStateChange('serialNumber', value)}
                    onClearClick={() => handleClearClick('serialNumber')}
                />
            </Box>
            <br />
            <Box sx={{ display: 'flex', width: '100%' }}>
                <FilterFormControl
                    label="Vehicle Model"
                    values={filters?.modelData}
                    selectedValue={filtersState?.model}
                    onFilterChange={(value) => handleFilterStateChange('model', value)}
                    onClearClick={() => handleClearClick('model')}
                />
                <FilterFormControl
                    label="Fuel Type"
                    values={filters?.fuelTypeData}
                    selectedValue={filtersState?.fuelType}
                    onFilterChange={(value) => handleFilterStateChange('fuelType', value)}
                    onClearClick={() => handleClearClick('fuelType')}
                />
                <FilterFormControl
                    label="Is Retail Ready"
                    values={filters?.isRetailReady}
                    selectedValue={filtersState?.isRetailReady}
                    onFilterChange={(value) => handleFilterStateChange('isRetailReady', value)}
                    onClearClick={() => handleClearClick('isRetailReady')}
                />
            </Box>
            <br />
            <Box sx={{ display: 'flex', width: '100%' }}>

                <FilterFormControl
                    label="Status"
                    values={filters?.statusData}
                    selectedValue={filtersState?.status}
                    onFilterChange={(value) => handleFilterStateChange('status', value)}
                    onClearClick={() => handleClearClick('status')}
                />
                <FilterFormControl
                    label="Battery Make"
                    values={filters?.batteryMakes}
                    selectedValue={filtersState?.batteryMake}
                    onFilterChange={(value) => handleFilterStateChange('batteryMake', value)}
                    onClearClick={() => handleClearClick('batteryMake')}
                />
                <FilterFormControl
                    label="Battery Model"
                    values={filters?.batteryModels}
                    selectedValue={filtersState?.batteryModel}
                    onFilterChange={(value) => handleFilterStateChange('batteryModel', value)}
                    onClearClick={() => handleClearClick('batteryModel')}
                />
            </Box>
            <br />
            <Box sx={{ display: 'flex', width: '100%' }}>
                <div style={{ width: '50%', marginRight: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <InputLabel sx={{ width: '40%' }}>Arrival Date</InputLabel>
                    <DatePicker
                        className='date-component'
                        dateFormat="dd-MM-yyyy"
                        selected={filtersState?.arrivalDate ? moment(filtersState?.arrivalDate, "DD-MM-YYYY").toDate() : null}
                        onChange={handleDateChange}
                        isClearable
                    />
                </div>
                <FormControl variant="outlined" sx={{ width: '12%', backgroundColor: '#f5f5f5' }}>
                    <InputLabel size='small'>Operator</InputLabel>
                    <Select
                        size='small'
                        value={filtersState?.manufacturedYear?.condition || "="}
                        onChange={(e) => {
                            const newManufacturedYear = {
                                ...filtersState.manufacturedYear,
                                condition: e.target.value
                            };
                            handleFilterStateChange('manufacturedYear', newManufacturedYear);
                        }}
                        label="Condition"
                    >
                        <MenuItem value=">">{'>'}</MenuItem>
                        <MenuItem value="=">=</MenuItem>
                        <MenuItem value="<">{'<'}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ width: '30%', marginRight: '10px' }}>
                    <InputLabel size='small'>Manufactured Year</InputLabel>
                    <OutlinedInput
                        size='small'
                        value={manufacturedYearValue}
                        onChange={(e) => {
                            setManufacturedYearValue(e.target.value);
                            const newManufacturedYear = {
                                ...filtersState.manufacturedYear,
                                value: e.target.value
                            };
                            debouncedChange('manufacturedYear', newManufacturedYear);
                        }}
                        label="Year"
                    />
                </FormControl>
                <FormControl variant="outlined" sx={{ width: '12%', backgroundColor: '#f5f5f5' }}>
                    <InputLabel size='small'>Operator</InputLabel>
                    <Select
                        size='small'
                        value={filtersState?.hourMeter?.condition || "="}
                        onChange={(e) => {
                            const newHourMeter = {
                                ...filtersState.hourMeter,
                                condition: e.target.value
                            };
                            handleFilterStateChange('hourMeter', newHourMeter);
                        }}
                        label="Condition"
                    >
                        <MenuItem value=">">{'>'}</MenuItem>
                        <MenuItem value="=">=</MenuItem>
                        <MenuItem value="<">{'<'}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ width: '30%', marginRight: '10px' }}>
                    <InputLabel size='small'>Hour Meter</InputLabel>
                    <OutlinedInput
                        size='small'
                        value={hourMeterValue}
                        onChange={(e) => {
                            setHourMeterValue(e.target.value);
                            const newHourMeter = {
                                ...filtersState.hourMeter,
                                value: e.target.value
                            };
                            debouncedChange('hourMeter', newHourMeter);
                        }}
                        label="Hour Meter"
                    />
                </FormControl>
            </Box>
        </div>
    )
}

export default TruckTableFilters;
