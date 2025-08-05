const debug = true;
export const Siena = {
    origin: debug ? "http://127.0.0.1:5500" : "https://tonsiena.github.io",
    webApp: (Elements) => {
        const telegram = window.Telegram.WebApp;
        telegram.ready();
        telegram.expand();
        
        if(Siena.isMobile())  Elements.$page.addClass("mobile")

        window.Telegram.WebView.postEvent('web_app_set_header_color', false, { color: "#101418" });
    },
    sliceAddress: (string, length) => {
        string = new TonWeb.utils.Address(string).toString(true, true, true);
        if (string.length < length) return string;
        return string.slice(0, length / 2) + "..." + string.slice(-length / 2);
    },
    isNumbers: (RequestData) => RequestData?.collection === "0:0E41DC1DC3C9067ED24248580E12B3359818D83DEE0304FABCF80845EAFAFDB2",
    isDomains: (RequestData) => RequestData?.collection === "0:80D78A35F955A14B679FAA887FF4CD5BFC0F43B4A4EEA2A7E6927F3701B273C2",
    isMobile: () => {
        const ua = navigator.userAgent.toLowerCase();

        return /android|iphone|ipad|ipod/.test(ua);
    },
    getUrlParams: () => {
       return new URLSearchParams(new URL(window.location.href).search);
    }
}