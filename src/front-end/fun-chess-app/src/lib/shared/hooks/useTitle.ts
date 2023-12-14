import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function useTitle(defaultValue?: string): [string, Dispatch<SetStateAction<string>>] {
    const [title, setTitle] = useState(defaultValue ?? document.title);

    useEffect(() => {
        document.title = `${title} - FunChess`;
    }, [title])

    return [title, setTitle];
}