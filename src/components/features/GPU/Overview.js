import { Accordion, Table } from '@mantine/core';
import { useLiveQuery } from 'dexie-react-hooks';

import { gpuDB } from '../../../common/db';

//todo
// const uniqueCardsList = [];
// const countCardsList = [];
// const totalCards = [];
// const date = [];

function Overview() {
    // const [uniqueModelData, setUniqueModelData] = useState([]);
    const stocks = useLiveQuery(
        () => gpuDB.stock.toArray()
    );

    const allModels = stocks?.map(stock => stock.model);
    const uniqueModel = allModels?.filter((item, index) => allModels.indexOf(item) === index);
    const rows = uniqueModel?.map(model => (
        <tr key={model}>
            <td>{model}</td>
            <td>{stocks?.filter(stock => stock.model === model).length}</td>
            <td>{stocks?.filter(stock => stock.model === model && stock.selfState === "still-work").length}</td>
            <td>{stocks?.filter(stock => stock.model === model && stock.selfState === "broken").length}</td>
            <td>{stocks?.filter(stock => stock.model === model && stock.status === "in").length}</td>
            <td>{stocks?.filter(stock => stock.model === model && stock.status === "out").length}</td>
        </tr>
    ))

    return (
        <>
            <Accordion defaultValue="report1">
                <Accordion.Item value="report1">
                    <Accordion.Control>report1</Accordion.Control>
                    <Accordion.Panel>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Model</th>
                                    <th>qty</th>
                                    <th>still work</th>
                                    <th>broken</th>
                                    <th>remainder</th>
                                    <th>out</th>
                                </tr>
                            </thead>
                            <tbody>{rows}</tbody>
                        </Table>
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

        </>
    );
}

export default Overview
