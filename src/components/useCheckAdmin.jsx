import { useEffect, useState } from 'react'

const useCheckAdmin = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem('user'));
        if (userData?.isAdmin) {
            setIsAdmin(true);
        }
    }, [])

    return { isAdmin, setIsAdmin };
}

export default useCheckAdmin