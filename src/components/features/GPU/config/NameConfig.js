import { TextInput, Title, Table, Card, Button, Group, Divider, FileButton } from '@mantine/core';
import { useState } from 'react';
import { gpuDB } from '../../../../common/db';
import { useLiveQuery } from 'dexie-react-hooks';
import csvDownload from 'json-to-csv-export';
import Papa from "papaparse";


function NameConfig(props) {
    const table = gpuDB[props.tableName];
    const [value, setValue] = useState("");
    const [error, setError] = useState(null);
    const data = useLiveQuery(() => table.toArray());

    async function addValueToDB() {
        try {
            if (value?.trim() === "") return;
            //check duplicate
            const count = await table.where('name').equalsIgnoreCase(value).count();
            if (count) return;

            await table.add({
                name: value
            });
            setError(null);
            console.log('Success saved!');
        } catch (error) {
            setError(error.inner.message)
        }
    }

    async function clearTable() {
        try {
            if (data?.length) {
                await table.clear()
                console.log('Success cleared!');
            }
        } catch (error) {
            setError(error.inner.message)
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
            setError(error.inner.message)

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
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.length ? data?.map((element) => (
                            <tr key={element.id}>
                                <td>{element.id}</td>
                                <td>{element.name}</td>
                                <td>
                                    <Button compact color="red" onClick={() => { deleteOne(element.id) }}>
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={3}>No data</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <Divider mb={10} />
            </Card.Section>

            <TextInput
                placeholder="type new one"
                label={props.label}
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
                error={error}
            />

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
        </Card>
    );
}

export default NameConfig
