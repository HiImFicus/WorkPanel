import { Outlet } from 'react-router-dom';
import { Container } from '@mantine/core';

export default function Root() {

    return (
        <Container miw="100%">
            <Outlet />
        </Container>
    );
}
