const silicons = [
    "AMD",
    "NVIDIA",
];

const brands = [
    "DELL",
    "HP",
    "PNY",
    "MSI",
    "ASUS",
];

const cardSeries = {
    "AMD": [
        'FirePro',
        'Radeon',
    ],
    "NVIDIA": [
        'GeFore',
        'Riva',
        'Quadro',
        'TESLA'
    ],
};

const cardModel = {
    'FirePro': [
        'V',
        'W',
    ],
    'Radeon': [
        'HD',
        'R5',
        'R7',
        'R9',
        'RX',
    ],
    'GeFore': [
        'MX',
        'FX',
        'GT',
        'GTS',
        'GTX',
    ],
    'Riva': [
        'TNT'
    ],
    'Quadro': [
        'K',
        'M',
        'P',
        'NVS',
    ],
    'TESLA': [
        'K'
    ],
};

const cardModelNumber = {
    'FirePro+V': [
        '3900',
        '7600',
        '7700',
    ],
    'FirePro+W': [
        '2100',
        '4100'
    ],
    'Radeon+HD': [
        '7770',
        '5770'
    ],
    'Radeon+R5': [
        '430',
    ],
    'Radeon+R7': [
        '360',
    ],
    'Radeon+R9': [
        '390',
    ],
    'Radeon+RX': [
        '560',
    ],

    'GeFore+MX': [
        '550',
    ],
    'GeFore+FX': [
        '5200'
    ],
    'GeFore+GT': [
        '730'
    ],
    'GeFore+GTS': [
        '450'
    ],
    'GeFore+GTX': [
        '970'
    ],

    'Riva+TNT': [
        '2'
    ],

    'Quadro+K': [
        '2000'
    ],
    'Quadro+M': [
        '2000'
    ],
    'Quadro+P': [
        '600'
    ],
    'Quadro+NVS': [
        '310',
        '315',
        '510',
    ]
}

const memorySize = [
    '128MB',
    '256MB',
    '512MB',
    '768MB',
    '1GB',
    '1.7GB',
    '2GB',
    '3GB',
    '4GB',
    '5GB',
    '6GB',
    '8GB',
    '10GB',
    '12GB',
    '16GB',
    '24GB',

];

const formFactor = [
    'L-PROFILE',
    'H_PROFILE',
];

const ports = [
    'DVI',
    'DP',
    'mini-DP',
    'HDMI',
    'mini-HDMI',
    'VGA',
    'DMS-59'
];

const partNumber = [
    '762896-001',
    'CN-0F9P1R',
    'VCQ400-T',
    'BFGR981024GTXPOCE',
    '299-1E348-001SA'
];

function GPUBasicData() {

    const series = [];
    for (const key in cardSeries) {
        if (Object.hasOwnProperty.call(cardSeries, key)) {
            if (Array.isArray(cardSeries[key])) {
                (cardSeries[key]).map((item) => {
                    return series.push({ name: item, silicon: key })
                })
            }
        }
    }

    const arrayKey = {
        silicon: silicons,
        makerBrand: brands,
        memorySize: memorySize,
        formFactor: formFactor,
        port: ports,
        partNumber: partNumber,
    };

    let basicData = {}
    for (const key in arrayKey) {
        if (Object.hasOwnProperty.call(arrayKey, key)) {
            basicData[key] = [];
            if (Array.isArray(arrayKey[key])) {
                (arrayKey[key]).map((item) => {
                    return (basicData[key]).push({ name: item })
                })
            }
        }
    }

    basicData['series'] = series;

    return basicData;
}

function GPUModelData() {
    let modelNumber = {};
    for (const key in cardModel) {
        if (Object.hasOwnProperty.call(cardModel, key)) {
            if (Array.isArray(cardModel[key])) {
                modelNumber[key] = [];
                (cardModel[key]).map((item) => {
                    if (Array.isArray(cardModelNumber[`${key}+${item}`])) {
                        (cardModelNumber[`${key}+${item}`]).map((number => {
                            return (modelNumber[key]).push(`${item}${number}`);
                        }))
                    }
                    return item
                })
            }
        }
    }

    const model = [];
    for (const key in modelNumber) {
        if (Object.hasOwnProperty.call(modelNumber, key)) {
            if (Array.isArray(modelNumber[key])) {
                (modelNumber[key]).map((item) => {
                    return model.push({ name: item, series: key })
                })
            }
        }
    }

    return model;
}

export default function GPUDefaultData() {
    let object = GPUBasicData();
    object['modelNumber'] = GPUModelData();
    return object;
}
