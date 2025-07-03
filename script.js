import { e3, q5, cfetch } from './utils.js';

const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://tonsiena.github.io/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
});

const WebApp = window.Telegram.WebApp;
WebApp.ready();
WebApp.requestFullscreen();


tonConnectUI.onStatusChange(async walletInfo => {
    const content = q5(".list");
    const addrList = q5("#address-list");

    if (walletInfo) {
        const { address, balance, name, status, is_scam, is_wallet, last_activity } = await fetchAccount(walletInfo.account.address);

        createItem("Telegram usernames", "", q5("#parser-list")).onclick = (e) => window.location.href = "/collections.html?collection=usernames&address=" + walletInfo.account.address;
        createItem("Telegram anonymous numbers", "", q5("#parser-list")).onclick = (e) => window.location.href = "/collections.html?collection=numbers&address=" + walletInfo.account.address;
        createItem("Getgems usernames", "", q5("#parser-list")).onclick = (e) => window.location.href = "/collections.html?collection=ggusernames&address=" + walletInfo.account.address;
        createItem("TON DNS", "", q5("#parser-list")).onclick = (e) => window.location.href = "/collections.html?collection=tondns&address=" + walletInfo.account.address;
       
        const items = [
            { key: "Name", value: name },
            { key: "Balance", value: (parseInt(balance) / 1e9).toFixed(2) },
            { key: "Status", value: status },
            { key: "Is scam", value: is_scam },
            { key: "Is wallet", value: is_wallet },
            { key: "Last activity", value: new Date(last_activity * 1000).toLocaleString() }
        ];

        items.forEach(({ key, value }) => createItem(key, value, content));

        const addr = new TonWeb.Address(address);
        convertAddress(addr).forEach(({ label, value }) => createWalletAddressItem(label, value, addrList));
    }
});

const fetchAccount = async address => {
    return await cfetch(`https://tonapi.io/v2/accounts/${encodeURIComponent(address)}`);
};


const createItem = (key, value, parent) => {
    const div = e3("p");
    div.className = "account-content-item";
    div.innerHTML = `<span class='key'>${key}</span><span class='value'>${value}</span>`;
    parent.append(div);
    return div;
};

const createWalletAddressItem = (key, value, parent) => {
    const div = e3("p");
    div.className = "fd-c";
    div.innerHTML = `<span class='key'>${key}</span><span class='value'>${value}</span>`;
    div.onclick = () => {
        navigator.clipboard.writeText(value);
        showToast(`Copied!`);
    };
    parent.append(div);
};


const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    Object.assign(toast.style, {
        position: "fixed",
        bottom: "50%",
        width: "300px",
        maxWidth: "400px",
        background: "#333",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        opacity: "0",
        transition: "opacity 0.3s",
        zIndex: "1000",
        wordBreak: "break-all"
    });
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "1";
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }, 10);
};
const convertAddress = addr => [
    { label: "Hex", value: addr.toString(false) },
    { label: "Mainnet Bounceable", value: addr.toString(true, true, true, false) },
    { label: "Mainnet Non-Bounceable", value: addr.toString(true, true, false, false) },
    { label: "Testnet Bounceable", value: addr.toString(true, true, true, true) },
    { label: "Testnet Non-Bounceable", value: addr.toString(true, true, false, true) }
];