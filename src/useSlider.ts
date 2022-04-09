import {useState} from "react";


export function useSlider(defaultValue: number = 0): [number, number, (n: number) => void] {
    const [visualValue, setVisualValue] = useState(defaultValue);
    const [realValue, setRealValue] = useState(defaultValue);

    let timeout: NodeJS.Timeout | undefined = undefined;
    const setValue = (n: number) => {
        setVisualValue(n);
        if(timeout)
            clearTimeout(timeout);
        timeout = setTimeout(() => setRealValue(n), 500);
    }

    return [visualValue, realValue, setValue];
}
