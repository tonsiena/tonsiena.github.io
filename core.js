function _0x364a(_0x37243b, _0x16c1e9) { const _0x2777b4 = _0x2777(); return _0x364a = function (_0x364a2b, _0x4b2971) { _0x364a2b = _0x364a2b - 0x1ac; let _0x296dbd = _0x2777b4[_0x364a2b]; return _0x296dbd; }, _0x364a(_0x37243b, _0x16c1e9); } function _0x2777() { const _0x5591b5 = ['528856vaMjQP', '9051559HRbqNt', '138140iOrZts', '3ptXBEA', '1406642QsQdPX', '18uCTyUc', 'json', '25syESQa', '2132148lFigkE', '260190oyQROg', 'error', 'createElement', '7uHxwxH', '1229400ozPdRb']; _0x2777 = function () { return _0x5591b5; }; return _0x2777(); } const _0x2e1d66 = _0x364a; (function (_0x167859, _0x8feea) { const _0x432fee = _0x364a, _0x32f020 = _0x167859(); while (!![]) { try { const _0x5c2d20 = parseInt(_0x432fee(0x1b2)) / 0x1 + -parseInt(_0x432fee(0x1ad)) / 0x2 * (-parseInt(_0x432fee(0x1ac)) / 0x3) + parseInt(_0x432fee(0x1b9)) / 0x4 * (parseInt(_0x432fee(0x1b0)) / 0x5) + parseInt(_0x432fee(0x1b1)) / 0x6 * (parseInt(_0x432fee(0x1b5)) / 0x7) + -parseInt(_0x432fee(0x1b7)) / 0x8 * (parseInt(_0x432fee(0x1ae)) / 0x9) + -parseInt(_0x432fee(0x1b6)) / 0xa + -parseInt(_0x432fee(0x1b8)) / 0xb; if (_0x5c2d20 === _0x8feea) break; else _0x32f020['push'](_0x32f020['shift']()); } catch (_0x139a8a) { _0x32f020['push'](_0x32f020['shift']()); } } }(_0x2777, 0x64f51)); export const cfetch = async _0x3fcbb2 => { const _0x52097b = _0x364a; try { const _0x34aac2 = await fetch(_0x3fcbb2); return await _0x34aac2[_0x52097b(0x1af)](); } catch (_0x176ca7) { console[_0x52097b(0x1b3)]('fetchAccount:', _0x3fcbb2, _0x176ca7); } }; export const e3 = _0x3f6d03 => document[_0x2e1d66(0x1b4)](_0x3f6d03); export const q5 = _0xb86e2b => document['querySelector'](_0xb86e2b);

export const connect = (content) => {
    var connection = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'https://tonsiena.github.io/tonconnect-manifest.json',
        buttonRootId: 'ton-connect'
    });
    connection.onStatusChange(async walletInfo => {
        if (walletInfo) content(walletInfo);
    });
    return connection;
}

export const convertAddress = addr => [
    { label: "Hex", value: addr.toString(false) },
    { label: "Mainnet Bounceable", value: addr.toString(true, true, true, false) },
    { label: "Mainnet Non-Bounceable", value: addr.toString(true, true, false, false) },
    { label: "Testnet Bounceable", value: addr.toString(true, true, true, true) },
    { label: "Testnet Non-Bounceable", value: addr.toString(true, true, false, true) }
];

export const svgIcon = `<svg fill="grey" height="15" width="15" viewBox="0 0 492.432 492.432" xmlns="http://www.w3.org/2000/svg">
                        <path d="M142.238 492.432c-9.79 0-19.588-3.736-27.05-11.209-14.945-14.934-14.945-39.162 0-54.098l180.9-180.909-180.9-180.91c-14.945-14.935-14.945-39.163 0-54.098 14.926-14.944 39.172-14.944 54.098 0l207.96 207.958c14.943 14.935 14.943 39.164 0 54.1l-207.96 207.957c-7.462 7.464-17.26 11.199-27.048 11.199z"/>
                        </svg>`;

export const collections = { numbers:   "EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N", usernames: "EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi",
                             tondns:    "EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz", getgems:   "EQDhlVq6cknyPk_SCGZUoXZRbZixNODfcBMCZ3wDfDWLFze7" };

export const tabs = [
                     { id: "tab-usernames", text: "Telegram usernames", }, { id: "tab-numbers",   text: "Anonymous numbers",  },
                     { id: "tab-tondns",    text: "TON DNS",            }, { id: "tab-getgems",   text: "Getgems usernames"   }];  

export const fetchNumbers = async (address, collection) => {
    if(address.length != 0) return await cfetch(`https://tonapi.io/v2/accounts/${encodeURIComponent(address)}/nfts?collection=${collection}&limit=1000&offset=0&indirect_ownership=false`);
};
export const fetchAccount = async (address) => {
    if(address.length != 0) return await cfetch(`https://tonapi.io/v2/accounts/${encodeURIComponent(address)}`);
};

export const sliceAddress = (str, length) => {
    if(!str) return str;
    if (str.length < length) return str;
    return str.slice(0, length / 2) + "..." + str.slice(-(length / 2));
}

export const o4 = (e, s) => Object.assign(e3(e), s);

export const display = (view, type) => view.style.display = type;