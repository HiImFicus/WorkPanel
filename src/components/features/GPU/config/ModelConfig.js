import { TextInput, SimpleGrid, Title, Table, Card, Select, Button, Group, Divider, FileButton } from '@mantine/core';
import { useState, useEffect } from 'react';
import { gpuDB } from '../../../../common/db';
import { useLiveQuery } from 'dexie-react-hooks';
import csvDownload from 'json-to-csv-export';
import Papa from "papaparse";

//props: tableName, dependTableName, label

function ModelConfig(props) {
    const dependTable = gpuDB[props.dependTableName];
    const [selectData, setSelectData] = useState([]);
    const [isAvailable, setIsAvailable] = useState(false);

    useEffect(() => {
        async function getDependData() {
            return await dependTable.toArray();
        }
        getDependData()
            .then((result) => {
                let currentValue = [];
                let newData = [];
                result.map((element) => {
                    if (!currentValue.includes(element.name)) {
                        currentValue.push(element.name)
                        newData.push({ value: element.name, label: element.name })
                    }
                }, currentValue, newData)
                return newData;
            }).then((result) => {
                setSelectData(result);
                if (result.length) {
                    setIsAvailable(true)
                }
            });
        return () => {
            setIsAvailable(false);
            setSelectData([]);
        }
    }, [])

    const table = gpuDB[props.tableName];
    const data = useLiveQuery(async () => table.toArray());
    const [value, setValue] = useState("");
    const [dependValue, setDependValue] = useState("");

    async function addValueToDB() {
        try {
            if (value?.trim() === "" || dependValue?.trim() === "") return;
            //check duplicate
            const count = await table.where(`[name+${props.dependTableName}]`).equals([value, dependValue]).count();
            if (count) return;

            let newData = { name: value };
            newData[props.dependTableName] = dependValue;
            await table.add(newData);
            console.log('Success saved!');
        } catch (error) {
            throw error
        }
    }

    async function clearTable() {
        try {
            if (data?.length) {
                await table.clear()
                console.log('Success cleared!');
            }
        } catch (error) {
            throw error
        }
    }

    function toCVS() {
        if (data.length) {
            const currentDate = new Date();
            const filename = `Ficus_GPU_Work_Config_${props.label}_${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}`;
            const dataToConvert = {
                data: data,
                filename: filename,
                delimiter: ',',
            }

            return csvDownload(dataToConvert);
        }
    }

    function handleFile(file) {
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: async function (results) {
                    await gpuDB.transaction('rw', [table], async () => {
                        await table.clear();
                        await table.bulkAdd(results.data);
                    });
                },
            });
        }
    }

    async function deleteOne(id) {
        try {
            if (id) {
                await table.delete(id);
                console.log('Success deleted!')
            }
        } catch (error) {
            throw error
        }
    }

    return (
        <Card shadow="md" p="md" withBorder>
            <Card.Section>
                <Table horizontalSpacing="xl" verticalSpacing="xs" highlightOnHover>
                    <caption>
                        <Title order={1}>{props.label} list</Title>
                    </caption>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>{props.dependTableName}</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.length ? data?.map((element) => (
                            <tr key={element.id}>
                                <td>{element.id}</td>
                                <td>{element.name}</td>
                                <td>{element[props.dependTableName]}</td>
                                <td>
                                    <Button compact color="red" onClick={() => { deleteOne(element.id) }}>
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4}>No data</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <Divider mb={10} />
            </Card.Section>

            {isAvailable && (
                <>
                    <SimpleGrid
                        cols={2}
                        breakpoints={[
                            { maxWidth: 600, cols: 1, spacing: 'sm' },
                        ]}
                    >
                        <div>
                            <TextInput
                                placeholder="type new one"
                                label={props.label}
                                value={value}
                                onChange={(event) => setValue(event.currentTarget.value)}
                            />
                        </div>
                        <div>
                            <Select label={props.dependTableName} value={dependValue} onChange={setDependValue} data={selectData} />
                        </div>
                    </SimpleGrid>
                    <Button.Group mt={10}>
                        <Button onClick={toCVS}>Download</Button>
                        <Group position="center">
                            <FileButton onChange={handleFile} accept=".csv">
                                {(props) => <Button {...props}>Overwrite by File</Button>}
                            </FileButton>
                        </Group>
                        <Button onClick={addValueToDB}>Add</Button>
                        <Button onClick={clearTable} color="dark">Clear</Button>
                    </Button.Group>
                </>
            )}
        </Card>
    );
}

export default ModelConfig
