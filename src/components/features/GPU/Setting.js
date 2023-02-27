import { Grid, createStyles, Title, Text, Button } from '@mantine/core';
import GPUDefaultData from './config/DefaultData';
import ModelConfig from './config/ModelConfig';
import { gpuDB } from '../../../common/db';

import NameConfig from './config/NameConfig';
import { useState } from 'react';

const useStyles = createStyles((theme) => ({
    wrapper: {
        backgroundImage: `linear-gradient(-60deg, ${theme.colors[theme.primaryColor][4]} 0%, ${theme.colors[theme.primaryColor][7]
            } 100%)`,
        padding: theme.spacing.xl * 2.5,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            padding: theme.spacing.xl * 1.5,
        },
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        color: theme.white,
        lineHeight: 1,
    },

    description: {
        color: theme.colors[theme.primaryColor][0],

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            maxWidth: '100%',
        },
    },
}));

const configListMap = [
    { table: "silicon", label: "Silicon", hasDepend: false },
    { table: "formFactor", label: "Form", hasDepend: false },
    { table: "makerBrand", label: "Brand", hasDepend: false },
    { table: "memorySize", label: "Memory", hasDepend: false },
    { table: "port", label: "Port", hasDepend: false },
    { table: "partNumber", label: "Part #", hasDepend: false },
    { table: "series", label: "Series", hasDepend: true, depend: "silicon" },
    { table: "modelNumber", label: "Model #", hasDepend: true, depend: "series" },
];

function Setting() {
    const { classes } = useStyles();
    const [hasDefault, setHasDefault] = useState(false);

    function setDefaultData() {
        clearAll();
        const data = GPUDefaultData();
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                gpuDB[key].bulkAdd(data[key])
            }
        }
        setHasDefault(true);
    }

    function clearAll() {
        gpuDB.tables.map((table) => table.clear())
        setHasDefault(false);
    }

    return (
        <Grid>
            <Grid.Col span={12} className={classes.wrapper}>
                <div>
                    <Title className={classes.title}>Setting of auto complete</Title>
                    <Text className={classes.description} mt="sm"></Text>
                </div>
                <div className="">
                    <Button.Group>
                        {hasDefault ? (
                            <Button onClick={setDefaultData} disabled color="indigo">
                                Set Default Data
                            </Button>
                        ) : (
                            <Button onClick={setDefaultData} color="indigo">
                                Set Default Data
                            </Button>
                        )}
                        {/* {!hasDefault && (
                            <Button onClick={setDefaultData} color="indigo">
                                Set Default Data
                            </Button>
                        )} */}
                        <Button onClick={clearAll} color="dark">
                            Clear All Data
                        </Button>
                    </Button.Group>

                </div>
            </Grid.Col>
            {configListMap.map((config) => (
                <Grid.Col span={6} key={config.label}>
                    {config.hasDepend ? (
                        <ModelConfig tableName={config.table} label={config.label} dependTableName={config.depend} />
                    ) : (
                        <NameConfig tableName={config.table} label={config.label} />
                    )}
                </Grid.Col>
            ))}
        </Grid>
    );
}

export default Setting
