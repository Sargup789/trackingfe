import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import jwtDecode from 'jwt-decode';
import { getTokenCookie } from '@/lib/auth-cookie';

type DecodedToken = {
    username: string;
    roles: string;
    iat: number;
    exp: number;
    applicationName?: string;
}

const withLogin = (WrappedComponent: React.ComponentType<any>): React.FC<any> => {
    return (props) => {
        const router = useRouter();

        useEffect(() => {
            const token = getTokenCookie(null);
            if (!token) {
                router.push('/login');
                return;
            }

            let decodedToken: DecodedToken;
            try {
                decodedToken = jwtDecode(token);
            } catch (error: any) {
                router.push('/login');
                return;
            }
        }, []);

        return <WrappedComponent {...props} />;
    }
}

export default withLogin;
