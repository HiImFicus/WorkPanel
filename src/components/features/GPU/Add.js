import {
    Text, Grid, Mark, Highlight,
    createStyles, SimpleGrid, Group, Button,
    Switch, Autocomplete, ActionIcon, Select, List,
    RingProgress, SegmentedControl, MultiSelect
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm, isNotEmpty } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { gpuDB } from '../../../common/db';

const selfStateGood = "still-work";
const selfStateBad = "broken";

const selfStateMap = [
    { label: "still-working", value: selfStateGood },
    { label: "broken", value: selfStateBad, },
];

const statusInStock = "in";
const statusOut = "out";

const statusMap = [
    { label: "into-stock", value: statusInStock },
    { label: "out", value: statusOut, },
];

const useStyles = createStyles((theme) => ({
    wrapper: {
        backgroundImage: `linear-gradient(-60deg, ${theme.colors[theme.primaryColor][4]} 0%, ${theme.colors[theme.primaryColor][7]
            } 100%)`,
        padding: theme.spacing.xl * 1.5,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            padding: theme.spacing.xl * 0.8,
        },
    },

    text: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        color: theme.white,
    },
}));

function Add() {
    const table = gpuDB.stock;
    const record = gpuDB.record;
    const { classes } = useStyles();
    const [partNumberData, setPartNumberData] = useState([
        { value: 'react', label: 'React' },
        { value: 'ng', label: 'Angular' },
    ]);

    const currentDate = new Date();

    const form = useForm({
        initialValues: {
            silicon: '',
            brand: '',
            model: '',
            memory: '',
            formFactor: '',
            date: new Date(),
            state: selfStateGood,
            status: statusInStock,
            ports: [
                // { type: '', active: true, key: randomId() }
            ],
            partNumber: [],
        },
        validate: {
            silicon: isNotEmpty('required'),
            model: isNotEmpty('required'),
            memory: isNotEmpty('required'),
            formFactor: isNotEmpty('required'),
            date: isNotEmpty('required'),
            state: isNotEmpty('required'),
            status: isNotEmpty('required'),
        },
    });

    const portsFields = form.values.ports.map((item, index) => (
        <Group key={item.key} mt="xs">
            <Select
                placeholder="Port type"
                searchable
                nothingFound="No options"
                data={['React', 'Angular', 'Svelte', 'Vue']}
                clearable
                {...form.getInputProps(`ports.${index}.type`)}
            />
            <Switch
                label="Active"
                {...form.getInputProps(`ports.${index}.active`, { type: 'checkbox' })}
            />
            <ActionIcon color="red" onClick={() => form.removeListItem('ports', index)}>
                <IconTrash size={16} />
            </ActionIcon>
        </Group>
    ));

    const circleSize = 120;
    const circleThickness = 10;

    function getPortString(ports) {
        return ""
    }

    function getPartNumberString(partNumber) {
        return ""
    }

    async function save() {
        try {
            //check form data

            //save     stock: '++id, silicon, brand, model, memory, formFactor, *ports, *partNumbers, date, selfState, status',
            const cardInfo = {
                silicon: form.silicon,
                brand: form.brand,
                model: form.model,
                memory: form.memory,
                formFactor: form.formFactor,
                ports: getPortString(form.ports),
                partNumber: getPartNumberString(form.partNumber),
            }

            const newCard = { ...cardInfo, date: form.date, selfState: form.state, status: form.status, }

            // save     record: '++id, [silicon+brand+model+memory+formFactor+ports+partNumbers]'
            const count = await table.where('[silicon+brand+model+memory+formFactor+ports+partNumbers]')
                .equals([
                    cardInfo.silicon, cardInfo.brand,
                    cardInfo.model, cardInfo.memory,
                    cardInfo.formFactor, cardInfo.ports, cardInfo.partNumber
                ]).count();

            // use Transaction when save
            if (!count) {
                record.add(cardInfo)
            }
            const newId = await table.add(newCard);
            console.log('Success saved! id is ' + newId);
        } catch (error) {
            throw error
        }
    }

    return (
        <form onSubmit={form.onSubmit(() => {
            console.log(form.values)
        })}>
            <Grid grow>
                <Grid.Col span={12} className={classes.wrapper}>
                    <Grid className={classes.text} align="center" justify="space-between">
                        <Grid.Col span={5}>
                            <List className={classes.text}>
                                <List.Item>
                                    2/28/2023:
                                </List.Item>
                                <List.Item>
                                    <Highlight highlight={['40', 'can work', 'non-working']}>
                                        40 can work
                                    </Highlight>

                                </List.Item>
                                <List.Item>
                                    40 non-working
                                </List.Item>
                            </List>
                        </Grid.Col>
                        <Grid.Col span={5}>
                            <List className={classes.text}>
                                <List.Item>Last Record: <Mark color="red">Rx 430</Mark>, 1.</List.Item>
                                <List.Item>Number:</List.Item>
                            </List>
                        </Grid.Col>
                        <Grid.Col span={2}>
                            <RingProgress
                                size={circleSize}
                                thickness={circleThickness}

                                label={
                                    <Text size="xs" align="center" px="xs" sx={{ pointerEvents: 'none' }}>
                                        Total: 500
                                    </Text>
                                }
                                sections={[
                                    { value: 40, color: 'cyan', tooltip: 'Documents - 40 Gb' },
                                    { value: 25, color: 'orange', tooltip: 'Apps - 25 Gb' },
                                    { value: 15, color: 'grape', tooltip: 'Other - 15 Gb' },
                                ]}
                            />
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Autocomplete
                        label="Template"
                        placeholder="Pick one"
                        data={['React', 'Angular', 'Svelte', 'Vue']}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Autocomplete
                        label="SILICON"
                        placeholder="Pick one"
                        data={['React', 'Angular', 'Svelte', 'Vue']}
                        name="silicon"
                        {...form.getInputProps('silicon')}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Autocomplete
                        label="BRAND"
                        placeholder="Pick one"
                        data={['React', 'Angular', 'Svelte', 'Vue']}
                        name="brand"
                        {...form.getInputProps('brand')}
                    />
                </Grid.Col>
                <Grid.Col span={12}>
                    <Autocomplete
                        label="MODEL CODE"
                        placeholder="Pick one"
                        data={['React', 'Angular', 'Svelte', 'Vue']}
                        name="model"
                        {...form.getInputProps('model')}

                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Autocomplete
                        label="MEMORY"
                        placeholder="Pick one"
                        data={['React', 'Angular', 'Svelte', 'Vue']}
                        name="memory"
                        {...form.getInputProps('memory')}

                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Autocomplete
                        label="FORM FACTOR"
                        placeholder="Pick one"
                        data={['React', 'Angular', 'Svelte', 'Vue']}
                        name="form"
                        {...form.getInputProps('formFactor')}

                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <DatePicker
                        placeholder="Pick date"
                        label="TEST DATE"
                        inputFormat="MM/DD/YYYY"
                        labelFormat="MM/YYYY"
                        {...form.getInputProps('date')}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Grid>
                        <Grid.Col span={6}>
                            {form.errors.state ? (
                                <Text fz="sm" fw={500} c="red" >STATE*</Text>
                            ) : (
                                <Text fz="sm" fw={500} >STATE</Text>
                            )}
                            <SegmentedControl
                                fullWidth
                                data={selfStateMap}
                                {...form.getInputProps('state')}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            {form.errors.status ? (
                                <Text fz="sm" fw={500} c="red" >STATUS*</Text>
                            ) : (
                                <Text fz="sm" fw={500} >STATUS</Text>
                            )}
                            <SegmentedControl
                                fullWidth
                                data={statusMap}
                                {...form.getInputProps('status')}
                            />
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col span={12}>
                    {/* <Group position="center" mt="md"> */}
                    <Group mt="md">
                        <Button
                            onClick={() =>
                                form.insertListItem('ports', { type: '', active: true, key: randomId() })
                            }
                        >
                            Add Port
                        </Button>
                    </Group>
                    <SimpleGrid
                        cols={2}
                        spacing="lg"
                        breakpoints={[
                            { maxWidth: 'xs', cols: 1, spacing: 'sm' },
                        ]}
                    >
                        {portsFields}
                    </SimpleGrid>
                </Grid.Col>

                <Grid.Col span={12}>
                    <MultiSelect
                        label="PART #"
                        data={partNumberData}
                        placeholder="Select #"
                        searchable
                        creatable
                        getCreateLabel={(query) => `+ Create ${query}`}
                        onCreate={(query) => {
                            const item = { value: query, label: query };
                            setPartNumberData((current) => [...current, item]);
                            return item;
                        }}
                        {...form.getInputProps('partNumber')}
                    />
                </Grid.Col>

                <Grid.Col span={4}>
                    <Group position="center" mt="xl">
                        <Button type="submit" size="md">
                            Sumbit
                        </Button>
                    </Group>
                </Grid.Col>
            </Grid>
        </form>
    );
}

export default Add
