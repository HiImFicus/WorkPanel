import { SimpleGrid, Group, Button } from '@mantine/core';
import { MultiSelect } from '@mantine/core';
import { useState } from 'react';
import { FileButton, Text } from '@mantine/core';

// const AMD = 'AMD';
// const NVIDIA = 'NVIDIA';

// // const silicons = [
// //     { "label": AMD, },
// //     { "label": NVIDIA, },
// // ];

// const silicons = [
//     AMD,
//     NVIDIA,
// ];

// // const brands = [
// //     { "label": "DELL" },
// //     { "label": "HP" },
// //     { "label": "PNY" },
// //     { "label": "MSI" },
// //     { "label": "ASUS" },
// // ];

// const brands = [
//     "DELL",
//     "HP",
//     "PNY",
//     "MSI",
//     "ASUS",
// ];

// const cardSeries = {
//     AMD: [
//         'FirePro',
//         'Radeon',
//     ],
//     NVIDIA: [
//         'GeFore',
//         'Riva',
//         'Quadro',
//         'TESLA'
//     ],
// };

// const cardModel = {
//     'FirePro': [
//         'V',
//         'W',
//     ],
//     'Radeon': [
//         'HD',
//         'R5',
//         'R7',
//         'R9',
//         'RX',
//     ],
//     'GeFore': [
//         'MX',
//         'FX',
//         'GT',
//         'GTS',
//         'GTX',
//     ],
//     'Riva': [
//         'TNT'
//     ],
//     'Quadro': [
//         'K',
//         'M',
//         'P',
//         'NVS',
//     ],
//     'TESLA': [
//         'K'
//     ],
// };

// const cardModelNumber = {
//     'FirePro+V': [
//         '3900',
//         '7600',
//         '7700',
//     ],
//     'FirePro+W': [
//         '2100',
//         '4100'
//     ],
//     'Radeon+HD': [
//         '7770',
//         '5770'
//     ],
//     'Radeon+R5': [
//         '430',
//     ],
//     'Radeon+R7': [
//         '360',
//     ],
//     'Radeon+R9': [
//         '390',
//     ],
//     'Radeon+RX': [
//         '560',
//     ],

//     'GeFore+MX': [
//         '550',
//     ],
//     'GeFore+FX': [
//         '5200'
//     ],
//     'GeFore+GT': [
//         '730'
//     ],
//     'GeFore+GTS': [
//         '450'
//     ],
//     'GeFore+GTX': [
//         '970'
//     ],

//     'Riva+TNT': [
//         '2'
//     ],

//     'Quadro+K': [
//         '2000'
//     ],
//     'Quadro+M': [
//         '2000'
//     ],
//     'Quadro+P': [
//         '600'
//     ],
//     'Quadro+NVS': [
//         '310',
//         '315',
//         '510',
//     ]
// }

// const memorySize = [
//     '128MB',
//     '256MB',
//     '512MB',
//     '768MB',
//     '1GB',
//     '1.7GB',
//     '2GB',
//     '3GB',
//     '4GB',
//     '5GB',
//     '6GB',
//     '8GB',
//     '10GB',
//     '12GB',
//     '16GB',
//     '24GB',

// ];

// const formFactor = [
//     'L-PROFILE',
//     'H_PROFILE',
// ];

// const ports = [
//     'DVI',
//     'DP',
//     'mini-DP',
//     'HDMI',
//     'mini-HDMI',
//     'VGA',
//     'DMS-59'
// ];

// const partNumber = [
//     '762896-001',
//     'CN-0F9P1R',
//     'VCQ400-T',
//     'BFGR981024GTXPOCE',
//     '299-1E348-001SA'
// ];

// const cardsTemplates = [];
// const cardsStack = [];

function Setting() {
    const [data, setData] = useState([
        { value: 'react', label: 'React' },
        { value: 'ng', label: 'Angular' },
    ]);

    const [file, setFile] = useState(null);

    return (
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
    );
}

export default Setting
