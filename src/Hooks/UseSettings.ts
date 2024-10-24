import { useState, useEffect } from 'react';
import settings from 'Components/settings/Settings';

const useSettings = () => {
    const [values, setValues] = useState({ ...settings });

    useEffect(() => {
        // @ts-ignore
        const updateValues = (newSettings) => {
            setValues({ ...newSettings });
        };

        // Subscribing to all changes from settings
        settings.on('change', updateValues);

        return () => {
            settings.off('change', updateValues);
        };
    }, []);

    return values;
};

export default useSettings;