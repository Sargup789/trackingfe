import React from 'react';
import { Button } from '@mui/material';

const TvButton: React.FC = () => {
    const handleView = () => {
        window.location.href = '/_tv';
    };
    return (
        <Button
            style={{
                borderRadius: 15,
                backgroundColor: "#000",
                fontSize: "13px"
            }}
            variant="contained"
            onClick={handleView}
        >
            TV View
        </Button>
    );
}

export default TvButton;