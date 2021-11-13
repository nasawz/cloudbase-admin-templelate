import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../hook/useUser';

export interface IRequireAuthProps {
}

export default function RequireAuth({ children }: { children: JSX.Element }) {

    let location = useLocation();
    const { user } = useUser();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
}
