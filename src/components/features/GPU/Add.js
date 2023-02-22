import { Text, Grid, SimpleGrid, Group, Button, Switch, Autocomplete, ActionIcon, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';

function Add() {
    const form = useForm({
        initialValues: {
            silicon: '',
            brand: '',
            model: '',
            memory: '',
            form: '',
            ports: [
                { type: '', active: true, key: randomId() }
            ],
            partNumber: '',
        },
        validate: {
            // name: (value) => value.trim().length < 2,
            brand: (value) => value.trim().length === 0,
            silicon: (value) => value.trim().length === 0,
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

    return (
        <form onSubmit={form.onSubmit(() => {
            console.log(form.values)
            console.log(form.errors)
        })}>
            <Grid grow>
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
                        {...form.getInputProps('form')}

                    />
                </Grid.Col>
                <Grid.Col span={12}>
                    <SimpleGrid
                        cols={2}
                        spacing="lg"
                        breakpoints={[
                            { maxWidth: 'xs', cols: 1, spacing: 'sm' },
                        ]}
                    >
                        {portsFields.length > 0 ? '' : (
                            <Text color="dimmed" align="center">
                                No port
                            </Text>
                        )}

                        {portsFields}
                    </SimpleGrid>
                    <Group position="center" mt="md">
                        <Button
                            onClick={() =>
                                form.insertListItem('ports', { type: '', active: true, key: randomId() })
                            }
                        >
                            Add Port
                        </Button>
                    </Group>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Autocomplete
                        label="PART #"
                        placeholder="Pick one"
                        data={['React', 'Angular', 'Svelte', 'Vue']}
                        name="partNumber"
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
