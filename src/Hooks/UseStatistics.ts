import { useState, useEffect } from 'react';
import statistics from "Components/Statistics/Statistics";

const useSettings = () => {
    const [values, setValues] = useState({ ...statistics });

    useEffect(() => {
        // @ts-ignore
        const updateValues = (newSettings) => {
            setValues({ ...newSettings });
        };

        // Subscribing to all changes from Settings
        statistics.on('change', updateValues);

        return () => {
            statistics.off('change', updateValues);
        };
    }, []);

    return values;
};

export default useSettings;
