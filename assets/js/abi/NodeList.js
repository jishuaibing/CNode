const NODE_LIST = [

    'https://mainnet.infura.io/v3/a1743f084f8a46bfb3696389eeb9f217',
    'https://mainnet.infura.io/v3/cad7f83b4e47462e90387487530239af',
    'https://mainnet.infura.io/v3/01e4876c179a49ebbf8ad09f7037d9ee',
    'https://mainnet.infura.io/v3/483c1730b99b46729c7f82f49302bbf8',
    'https://mainnet.infura.io/v3/fa3e2193dfcb48978f731fadf8a1282a',
    'https://mainnet.infura.io/v3/139b233124ca4a7cb78ac63cd0a2d29f',
    'https://mainnet.infura.io/v3/e846fc35019a4766babcc4e9e757bb74',
    'https://mainnet.infura.io/v3/b838cc16e73f482b960d1f86c05533a6',
    'https://mainnet.infura.io/v3/4ca56581b1234f2a9cf4b7333c1f8ac1',
    'https://mainnet.infura.io/v3/d266a83cc83a40d7b14257be4579d310'
]

function getNode() {
    const index = Math.floor(Math.random() * NODE_LIST.length);
    return NODE_LIST[index];
}
