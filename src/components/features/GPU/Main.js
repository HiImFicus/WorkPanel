import { Container, Accordion } from '@mantine/core';
// import { useState } from 'react';
import Setting from './Setting';
import Add from './Add';

function GPUMain() {

    return (
        <Container miw="100%">
            <Accordion defaultValue="setting">
                <Accordion.Item value="setting">
                    <Accordion.Control>Setting</Accordion.Control>
                    <Accordion.Panel>
                        <Setting />
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="addNew">
                    <Accordion.Control>Add graphics card information</Accordion.Control>
                    <Accordion.Panel>
                        <Add />
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="report">
                    <Accordion.Control>Report</Accordion.Control>
                    <Accordion.Panel>
                        test
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
}

export default GPUMain
