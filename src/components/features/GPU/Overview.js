import { Container, Accordion } from '@mantine/core';
import { Outlet } from 'react-router-dom';
// import { useState } from 'react';

const uniqueCardsList = [];
const countCardsList = [];
const totalCards = [];
const date = [];

function Overview() {

    return (
        <>
            <Accordion defaultValue="report1">
                <Accordion.Item value="report1">
                    <Accordion.Control>report1</Accordion.Control>
                    <Accordion.Panel>
                        listReport
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="report2">
                    <Accordion.Control>report2</Accordion.Control>
                    <Accordion.Panel>
                        report2
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="report3">
                    <Accordion.Control>Report3</Accordion.Control>
                    <Accordion.Panel>
                        test
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>

            <Outlet />
        </>
    );
}

export default Overview
