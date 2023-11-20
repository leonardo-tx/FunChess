import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function useTitle(defaultValue: string): [string, Dispatch<SetStateAction<string>>] {
    const [title, setTitle] = useState(defaultValue);

    useEffect(() => {
        document.title = title;
    }, [title])

    return [title, setTitle];
}