const silicons = [
    "AMD",
    "NVIDIA",
];

const brands = [
    "DELL",
    "HP",
    "LENOVO",
    "ASUS",
    "MSI",
    "GIGABYTE",
    "EVGA",
    "PNY",
    "SAPPHIRE",
    "POWERCOLOR",
    "XFX",
    "BFG",
    "INNO3D",
    "GALAX",
    "APPLE",
    "LEADTEK",
    "ZOTAC",
    "VISIONTEK"
];

const cardSeries = {
    "AMD": [
        "FirePro",
        "Radeon",
    ],
    "NVIDIA": [
        "GeFore",
        "Riva",
        "Quadro",
        "NVS",
        "TESLA"
    ],
};

const nonInitialModel = "non-initial";

const cardModel = {
    "FirePro": {
        "non-initial": [],
        "V": [
            "3900",
            "4900",
            "5900",
            "7900",
        ],
        "W": [
            "600",
            "5000",
            "7000",
            "8000",
            "9000",
            "2100",
            "4100",
            "5100",
            "7100",
            "8100",
            "9100",
            "4300",
            "X 2100",
            "X 3100",
            "X 4100",
            "X 5100",
            "X 7100",
            "X 9100",
            "X 3200",
            "X 8200",

        ],
        "D": [
            "300",
            "500",
            "700",
        ],
        "3D": [
            "V3700",
            "V3750",
            "V3800",
            "V4800",
            "V5700",
            "V5800",
            "V7750",
            "V7800",
            "V8700",
            "V8750",
            "V8800",
            "V9800",
        ],
    },
    "Radeon": {
        "non-initial": [],
        "X": [
            "550",
            "800 XL",
            "1300",
        ],
        "HD": [
            "1950 XT",
            "2400",
            "3450",
            "3470",
            "3850",
            "3870",
            "4350",
            "4570",
            "4670",
            "4750",
            "4830",
            "4850",
            "4870",
            "4890",
            "5450",
            "5670",
            "5770",
            "5830",
            "5850",
            "5870",
            "5970",
            "6350",
            "6450",
            "6570",
            "6670",
            "6750",
            "6770",
            "6790",
            "6850",
            "6870",
            "6950",
            "6690 XT",
            "7470",
            "7570",
            "7750",
            "7770",
            "7790",
            "7850",
            "7870",
            "7950",
            "7970",
            "8490",
            "8570",
        ],
        "R5": [
            "240",
            "340X",
            "430",
        ],
        "R7": [
            "250",
            "250X",
            "260",
            "260X",
            "265",
            "350X",
            "360",
            "450",
        ],
        "R9": [
            "270",
            "270X",
            "280",
            "280X",
            "290",
            "290X",
        ],
        "RX": [
            "460",
            "470",
            "480",
            "520",
            "530",
            "540",
            "550",
            "560",
            "570",
            "580",
            "590",
            "Vega 56",
            "Vega 64",
            "5300"
        ],
    },
    "GeFore": {
        "non-initial": [
            "210",
            "310",
            "6600 GT",
            "6800 GS",
            "7300 GT",
            "7600 GT",
            "7950 GT",
            "8400 GS",
            "8500 GT",
            "8600 GT",
            "8800 GT",
            "8800 GTX",
            "8800 ULTRA",
            "9300 GS",
            "9400 GT",
            "9500 GT",
            "9600 GT",
            "9600 GSO",
            "9800 GT",
            "9800 GTX",
            "9800 GTX+",
        ],
        "MX": [
            "400"
        ],
        "FX": [
            "380",
            "5200"
        ],
        "GT": [
            "220",
            "240",
            "315",
            "430",
            "520",
            "610",
            "620",
            "630",
            "640",
            "730",
            "740",
        ],
        "GTS": [
            "250",
            "450",
        ],
        "GTX": [
            "260",
            "275",
            "280",
            "295",
            "460",
            "465",
            "470",
            "480",
            "550 Ti",
            "560",
            "570",
            "580",
            "590",
            "650 Ti",
            "660",
            "660 Ti",
            "670",
            "680",
            "745",
            "750 Ti",
            "760",
            "770",
            "780",
            "780 Ti",
            "950",
            "960",
            "970",
            "980",
            "1050",
        ],
    },
    "Riva": {
        "TNT": [
            "2",
        ]
    },
    "Quadro": {
        "non-initial": [
            "400",
            "410",
            "600",
            "2000",
            "4000",
            "5000",
            "7000",
        ],
        "K": [
            "420",
            "600",
            "620",
            "1200",
            "2000",
            "2200",
            "2000D",
            "4000",
            "4200",
            "5200",
            "6000",
        ],
        "M": [
            "2000",
            "4000",
            "5000",
            "6000",
        ],
        "P": [
            "400",
            "600",
            "620",
            "1000",
            "2000",
            "2200",
            "4000",
            "5000",
            "6000",
        ],
        "FX": [
            "580",
            "1800",
            "5800",
        ]
    },
    "NVS": {
        "non-initial": [
            "295",
            "300",
            "310",
            "315",
            "400",
            "420",
            "440",
            "510",
        ]
    },
    "TESLA": {
        "K": [
            "20",
        ],
    },
};

const memorySize = [
    "128MB",
    "256MB",
    "512MB",
    "768MB",
    "1GB",
    "1.7GB",
    "2GB",
    "3GB",
    "4GB",
    "5GB",
    "6GB",
    "8GB",
    "10GB",
    "12GB",
    "16GB",
    "24GB",
];

const formFactor = [
    "L - PROFILE",
    "H - PROFILE",
];

const ports = [
    "DVI",
    "DP",
    "mini-DP",
    "HDMI",
    "mini-HDMI",
    "VGA",
    "DMS-59"
];

const partNumber = [
    "7120997000G",
    "434949",
    "8MDMW",

    "CN-00WH7F",
    "CN-05DRVJ",
    "CN-0YT0RH",
    "CN-0DMHJ0",
    "CN-0F9P1R",
    "CN-07W12P",
    "CN-01X3TV",
    "CN-073XT6",
    "CN-0G5Y6D",
    "CN-09NPC8",
    "CN-0VVYN4",
    "CN-094NDT",
    "CN-0V5WK5",
    "CN-0GN6HV",
    "CN-0Y7XRF",
    "CN-0KG8WY",
    "CN-06HP90",
    "CN-0KFWWP",
    "CN-0F834P",
    "CN-0HCVMH",
    "CN-0CDMJ9",
    "CN-0TC2P0",
    "CN-0J27RG",
    "CN-00J53GJ",
    "CN-0PWG0F",
    "CN-08HW0R",
    "CN-02P8XT",
    "CN-0RH4GP",
    "CN-0NJ0D3",
    "CN-04J2NX",
    "CN-0236X5",
    "CN-0HFKYC",
    "CN-09VHW0",
    "CN-0MX401",
    "CN-02FVV6",
    "CN-03173K",
    "CN-09M4KG",
    "CN-0K6HDT",
    "CN-0P002P",
    "CN-06XMMP",
    "CN-0FTGGG",
    "CN-02PNXF",
    "CN-0P418M",
    "CN-0KP8GM",
    "CN-00NTVR",

    "762896-001",
    "762896-002",
    "783874-001",
    "802315-001",
    "697246-001",
    "677893-003",
    "775122-001",
    "786032-001",
    "764899-001",
    "765148-001",
    "764898-001",
    "765147-001",
    "919987-001",
    "818244-001",
    "818870-001",
    "700102-002",
    "713379-001",
    "919985-002",
    "655081-001",
    "616594-001",
    "742920-001",
    "538052-001",
    "534548-001",
    "637166-003",
    "917882-002",
    "641462-001",
    "508286-003",
    "625629-002",
    "700578-001",
    "625629-001",
    "632486-001",
    "637995-001",
    "637182-001",
    "910486-002",
    "695635-001",
    "701403-001",
    "5189-3945",
    "608533-003",
    "671137-001",

    "01G-P3-2625-KR",
    "01G-P3-N897-AR",
    "01G-P3-2730-KR",
    "01G-P3-1563-AR",
    "01G-P3-1561-B1",
    "01G-P3-2615-KR",
    "01G-P3-1312-LR",
    "512-P3-1212-LR",
    "512-P3-1300-LR",
    "512-P3-N861-TR",
    "256-P2-N749-LR",
    "01G-P3-1313-KR",

    "R52302GD3H/LP",
    "GT7102GD3H/LP",
    "7750SFF2HDDL",
    "4350512HKHS",
    "63501GBPC",
    "N210-MD512D3/LP",
    "R5450-MD1GD3H/LP",
    "EAH5450 SILENT/DI/1GD3(LP)",
    "GT710-2GD3H-LP",

    "FRU89Y9226",
    "FRU89Y9227",
    "FRU03T7122",
    "FRU46R2786",
    "FRU03T7126",
    "FRU00FC813",
    "65IGH8DL7AXT",
    "EAH6450 SILENT/DI/1GD3(LP)",
    "NX8600GTS-T2D256E-HD-OC",
    "102A7710111 000092",
    "PV-T86S-YHLG",
    "HD-545X-ZQH",
    "HD-545X-YQH",
    "ON-XFX1-STD",
    "VT-400771PC",
    "912-V212-017",
    "YV0530-Q64",
    "VCQ400-T",
    "VCG84512D3SXPB",
    "VCGGT7302D36LXPB-BB",
    "VCGT5201XPB-CG",
    "VCGGT4301XPB",
    "VCGG2101D3XPB",
    "VCGGT610XPB",
    "VCGG2101XPB",
    "VCNVS300X16-T",
    "BFGR981024GTXPOCE",
];

function GPUModelData() {

    let serieses = [];
    for (const key in cardSeries) {
        if (Object.hasOwnProperty.call(cardSeries, key)) {
            if (Array.isArray(cardSeries[key])) {
                (cardSeries[key]).map((item) => {
                    return serieses.push({ name: item, silicon: key })
                })
            }
        }
    }

    let models = [];
    serieses.map((series) => {
        if (cardModel[series.name]) {
            for (const seriesCode in cardModel[series.name]) {
                if (Object.hasOwnProperty.call(cardModel[series.name], seriesCode)
                    && Array.isArray(cardModel[series.name][seriesCode])) {
                    cardModel[series.name][seriesCode].map((modelCode) => {
                        if (seriesCode === nonInitialModel) {
                            models.push({ name: `${series.name} ${modelCode}`, silicon: series.silicon })
                        } else {
                            models.push({ name: `${series.name} ${seriesCode} ${modelCode}`, silicon: series.silicon })
                        }
                    })
                }
            }
        }
    })

    return models;
}

function arrayToObject(array) {
    return array.map((item) => { return { name: item } });
}

export default function GPUDefaultData() {
    return {
        silicon: arrayToObject(silicons),
        makerBrand: arrayToObject(brands),
        memorySize: arrayToObject(memorySize),
        formFactor: arrayToObject(formFactor),
        port: arrayToObject(ports),
        partNumber: arrayToObject(partNumber),
        model: GPUModelData()
    }
}
