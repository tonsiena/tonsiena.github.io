const origin = true ? "https://tonsiena.github.io" : "http://127.0.0.1:5500",
    src = "append",
    to = "appendTo",
    $el = (selector, name, text = "", attrs = {}) =>
        $(`<${selector} ${name ? ` class="${name}"` : ""}>`).attr(attrs).text(text),
    $p = (name, text) =>
        $el("p", name, text),
    $span = (name, text) =>
        $el("span", name, text),
    $li = (name) =>
        $el("li", name),
    $div = (name, ...source) =>
        $el("div", name)[src](...source),
    $img = (name, src, alt) =>
        $el("img", name, null, { src: src || '../icons/nopic.png', alt }),
    $a = (href, text) =>
        href && $el("a", "link", text, { href:href }),
    $toast = (text) => {
        let $message = $p('toast-message', text)[to]($("#toast-container"))
        setTimeout(() => $message.remove(), 2500);
    },
    Modal = {
        $closeButton: () => $p("modal-close-btn", "Close").click(() => {
            $(".modal").remove();
            $("body").removeClass("modal-open");
        }),
        copyandclose: text => {
            navigator.clipboard.writeText(text).catch(console.error)
            $toast("copied");
            $(".modal").remove();
            $("body").removeClass("modal-open");
        },
        openModal: (...children) => {
            var content = $div("modal-content", ...children)
            $div("modal modal-open", content,
                Modal.$closeButton())[to]($("body"));
            $("body").on("click", ".modal", function (e) {
                if (e.target === this){
                    $(this).remove();
                    $("body").removeClass("modal-open");
                }
            });
            $("body").addClass("modal-open");
            return content;
        },
        $metadata: metaitem =>
            $span("metadata-button flex-center-column", "metadata").click(() => Modal.openModal(
                $p('metadata')[src](
                    $p('metadata-header', "metadata")[src](
                        $span('copy-icon', 'copy').click(() =>
                            navigator.clipboard.writeText($('.metadata-code').text()).catch(console.error)
                        )
                    ),
                    $p('metadata-code', JSON.stringify(metaitem, null, 2))
                ),
            )),
        $modalAddress: (fullAddress, text, val, testnet = "") => $span(null, text).click(function () {
            var addr = new TonWeb.utils.Address(val);
            var content = Modal.openModal(
                $li("modal-address").text("tonviewer").click(() => window.open("https://" + testnet + "tonviewer.com/" + fullAddress)));
                [["hex:\n\n", addr.toString(false)],
                ["mainnet bounceable:\n\n", addr.toString(true, true, true, false)],
                ["mainnet non-bounceable:\n\n", addr.toString(true, true, false, false)],
                ["testnet bounceable:\n\n", addr.toString(true, true, true, true)],
                ["testnet non-bounceable:\n\n", addr.toString(true, true, false, true)]].forEach(([label, value]) => $li("modal-address").text(label + value).click(() => Modal.copyandclose(value))[to](content))
            
    }),
            $giftCollectionInfo: item =>
            Modal.openModal(
                $p('gc-m-item')[src](
                    $span('gc-m-key', "name"),
                    $span('gc-m-val', item.name)),
                $p('gc-m-item')[src](
                    $span('gc-m-key', "address"),
                    $span('gc-m-val', item.address)),
                $p('gc-m-item')[src](
                    $span('gc-m-key', "id"),
                    $span('gc-m-val', item.id)),
                $p('gc-m-item')[src](
                    $span('gc-m-key', "fragment"),
                    $a("https://fragment.com/gifts/" + item.fragment, "https://fragment.com/gifts/" + item.fragment)),
                $p('gc-m-item')[src](
                    $span('gc-m-key', "gift image"),
                    $a(`https://fragment.com/file/gifts/${item.fragment}/thumb.webp`, `https://fragment.com/file/gifts/${item.fragment}/thumb.webp`)),
                $p('gc-m-item')[src](
                    $span('gc-m-key', "collection image"),
                    $a(`https://nft.fragment.com/collection/${item.fragment}.webp`,  `https://nft.fragment.com/collection/${item.fragment}.webp`)),
                $p('gc-m-item')[src](
                    $span('gc-m-key', "emojies"),
                    $a(`https://t.me/addemoji/${item.emoji}`,  `https://t.me/addemoji/${item.emoji}`)),
                $p('gc-m-item')[src](
                    $span('gc-m-key', "stickers"),
                    $a(`https://t.me/addstickers/${item.stickers}`,  `https://t.me/stickers/${item.stickers}`)),
                $p('gc-m-item')[src](
                    $span('gc-m-key', "first sale"),
                    $span('gc-m-val', item.dates[0])),
                $p('gc-m-item')[src](
                    $span('gc-m-key', "last sale"),
                    $span('gc-m-val', item.dates[1])),
                $p('gc-m-item')[src](
                    $span('gc-m-key', "first upgraded"),
                    $span('gc-m-val', item.dates[2])),
                $p('gc-m-item')[src](
                    $span('gc-m-key', "initial supply"),
                    $span('gc-m-val', item.supply)),
   
            ),
    }
    getFriendlyAddress = address => new TonWeb.utils.Address(address).toString(true, true, true, false),
    isMobile = () => {
        const ua = navigator.userAgent.toLowerCase();

        return /android|iphone|ipad|ipod/.test(ua);
    },
    initTelegramWebApp = (back) => {
        const tg = window.Telegram.WebApp;
        if (!tg.initData) return null;

        tg.ready();

        if(back){
            tg.BackButton.show()
            tg.BackButton.onClick(() => window.history.back());
        }else tg.BackButton?.hide()

        if(isMobile()) tg.requestFullscreen();

        window.Telegram.WebView.postEvent('web_app_set_header_color', false, { color: "#17191b" });
        return window.Telegram;
    },
    getUrlParams = () => new URLSearchParams(new URL(window.location.href).search),
    sliceUrl = (str, len, address = false) => {
        if (address) str = new TonWeb.utils.Address(str).toString(true, true, true);
        return str.length >= len ? `${str.slice(0, len / 2)}...${str.slice(-len / 2)}` : str;
    };
    
const $content = (...source) => $(".content").empty() [src] (
     $div("content-source", ...source));
