import { KeyOff } from '@mui/icons-material';
import React from 'react';
import EmptyRoute from '../components/organism/EmptyRoute';
import { useAppSelector } from '../store/hook';

interface CanProps {
    permissions: string[];
    children: React.ReactNode;
}
export default function Unauthorized({ permissions, children }: CanProps) {
    const user = useAppSelector(state => state.auth.user);


    const userPermissions = user?.permissions || [];

    const hasPermission = permissions.some((p) => userPermissions.includes(p));

    if (!hasPermission) {
        return <EmptyRoute
            icon={<KeyOff />}
            title="Access Denied"
            message="You don't have permission to access this page. Please contact your administrator if you believe this is an error."
        />
    };

    return <>{children}</>;
}
