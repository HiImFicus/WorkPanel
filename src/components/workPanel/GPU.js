import { Container, SimpleGrid, Group, Button, Autocomplete, Space, Accordion, Slider } from '@mantine/core';
import { useForm } from '@mantine/form';
import { MultiSelect } from '@mantine/core';
import { useState } from 'react';
import { FileButton, Text } from '@mantine/core';

const marks = [
    { value: 0, label: 1 },
    { value: 25, label: 2 },
    { value: 50, label: 3 },
    { value: 75, label: 4 },
    { value: 100, label: 5 },
];

function GPU() {

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
        validate: {
            name: (value) => value.trim().length < 2,
            email: (value) => !/^\S+@\S+$/.test(value),
            subject: (value) => value.trim().length === 0,
        },
    });

    const [data, setData] = useState([
        { value: 'react', label: 'React' },
        { value: 'ng', label: 'Angular' },
    ]);

    const [file, setFile] = useState(null);

    return (
        <Container miw="100%">
            <Accordion defaultValue="setting">
                <Accordion.Item value="setting">
                    <Accordion.Control>Setting</Accordion.Control>
                    <Accordion.Panel>
                        <SimpleGrid cols={3} mt="xl" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                            <Group>
                                <MultiSelect width="100%"
                                    label="Creatable MultiSelect"
                                    data={data}
                                    placeholder="Select items"
                                    searchable
                                    creatable
                                    getCreateLabel={(query) => `+ Create ${query}`}
                                    onCreate={(query) => {
                                        const item = { value: query, label: query };
                                        setData((current) => [...current, item]);
                                        return item;
                                    }}
                                />
                                <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                                    <Button>Download</Button>
                                    <Group position="center">
                                        <FileButton onChange={setFile} accept="image/png,image/jpeg">
                                            {(props) => <Button {...props}>Upload File</Button>}
                                        </FileButton>
                                        {file && (
                                            <Text size="sm" align="center" mt="sm">
                                                Picked file: {file.name}
                                            </Text>
                                        )}
                                    </Group>
                                </SimpleGrid>
                            </Group>

                        </SimpleGrid>
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="addNew">
                    <Accordion.Control>Add graphics card information</Accordion.Control>
                    <Accordion.Panel>
                        <form onSubmit={form.onSubmit(() => { })}>
                            <SimpleGrid cols={2} mt="xl" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                                <Autocomplete
                                    label="SILICON"
                                    placeholder="Pick one"
                                    data={['React', 'Angular', 'Svelte', 'Vue']}
                                    name="name"
                                />
                                <Autocomplete
                                    label="BRAND"
                                    placeholder="Pick one"
                                    data={['React', 'Angular', 'Svelte', 'Vue']}
                                    name="name"
                                />
                            </SimpleGrid>

                            <Autocomplete
                                label="MODEL CODE"
                                placeholder="Pick one"
                                data={['React', 'Angular', 'Svelte', 'Vue']}
                                name="subject"
                            />

                            <SimpleGrid cols={2} mt="xl" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                                <Autocomplete
                                    label="MEMORY"
                                    placeholder="Pick one"
                                    data={['React', 'Angular', 'Svelte', 'Vue']}
                                    name="message"
                                />
                                <Autocomplete
                                    label="FORM FACTOR"
                                    placeholder="Pick one"
                                    data={['React', 'Angular', 'Svelte', 'Vue']}
                                    name="name"
                                />
                            </SimpleGrid>

                            <Space h="md" />
                            <div>
                                <label>NUMBER of PORTS</label>
                                <Slider
                                    label={(number) => marks.find((mark) => number === mark.value).label}
                                    marks={marks}
                                    step={25}
                                    mb="md"
                                    labelAlwaysOn
                                />
                            </div>
                            <Space h="md" />

                            <MultiSelect
                                data={['React', 'Angular', 'Svelte', 'Vue', 'Riot', 'Next.js', 'Blitz.js']}
                                label="PORTS"
                                placeholder="Pick all that you like"
                                maxSelectedValues={1}
                                clearButtonLabel="Clear selection"
                                clearable
                                searchable
                                nothingFound="Nothing found"
                                disableSelectedItemFiltering
                            />

                            <Autocomplete
                                label="PART #"
                                placeholder="Pick one"
                                data={['React', 'Angular', 'Svelte', 'Vue']}
                                name="message"
                            />

                            <Group position="center" mt="xl">
                                <Button type="submit" size="md">
                                    Sumbit
                                </Button>
                            </Group>
                        </form>
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

export default GPU
