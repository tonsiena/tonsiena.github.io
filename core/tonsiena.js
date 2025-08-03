export const Siena = {
    origin: "tonsiena.github.io",
    webApp: () => {
        const telegram = window.Telegram.WebApp;
        telegram.ready();
        telegram.expand();

        window.Telegram.WebView.postEvent('web_app_set_header_color', false, { color: "#1a2026" });
    },
    sliceAddress: (string, length) => {
        string = new TonWeb.utils.Address(string).toString(true, true, true);
        if (string.length < length) return string;
        return string.slice(0, length / 2) + "..." + string.slice(-length / 2);
    },
    isDomains: (RequestData) => RequestData?.collection === "0:80D78A35F955A14B679FAA887FF4CD5BFC0F43B4A4EEA2A7E6927F3701B273C2"
}