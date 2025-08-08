export const $ = jQuery, src = "append", to = "appendTo"; 
export const sliceAddress = (string, length) => {
        string = new TonWeb.utils.Address(string).toString(true, true, true);
        if (string.length < length) return string;
        return string.slice(0, length / 2) + "..." + string.slice(-length / 2);
    }
export const sliceUrl = (string, length) => {
        if (string.length < length) return string;
        return string.slice(0, length / 2) + "..." + string.slice(-length / 2);
    }

export const createElement = (selector, name, attrs = {}, text = "") =>
    $(`<${selector}${name ? ` class="${name}"` : ""}>`)
        .attr(attrs)
        .text(text);

export const $el = (selector, name) => createElement(selector, name);
export const $p = (name, text) => createElement("p", name, {}, text);
export const $span = (name, text) => createElement("span", name, {}, text);
export const $div = (name) => createElement("div", name);
export const $li = (name) => createElement("li", name);
export const $img = (name, src, alt) => createElement("img", name, { src: src || '../icons/nopic.png', alt });
export const $a = (href, text) => createElement("a", "link", { href }, text);
export const $alert = (text) =>  $(".content").append(
                $p("alert", text)
            );
export const $detailNFT = (label, value) => $li('list') [src] ($p(null, label), $a(value, value));
    
export const $clickableLink = (fullAddress, text, val, testnet = "") => {
    const $link = $span("link", text);
    $link.click(function() {
        var addr = new TonWeb.utils.Address(val);
        const $modal = $div("modal modal-open") [src] (
            $div("modal-content") [src] (
                $a(fullAddress, fullAddress).addClass("modal-address"),
                $li("modal-address").text(val),
                $li("modal-address").text(addr.toString(true, true, true, false)),
                $li("modal-address").text(addr.toString(true, true, false, false)),
                $li("modal-address").text(addr.toString(true, true, true, true)),
                $li("modal-address").text(addr.toString(true, true, false, false)),

                $p("modal-close-btn", "Close").click(() => $modal.remove())
            )
        ) [to] ($("body"))
    });
    return $link;
};

export const $tvlink = (key, val, testnet = "") => 
    $p(`i-link`) [src] (
        $span('link-desc').text(key), 
        $clickableLink(`https://${testnet}tonviewer.com/`+ val, sliceAddress(val, 24), val).addClass("link")
    );


export const buildPageNFT = (info, address, owner_address, collection_address, content, collection, metaitem, testnet) =>  
    $(".content") [src] (
        $div('i-card')[src](
            $img("preview", info.extra?._image_small, 'Preview'),
            $div('card-desc')[src](
                $tvlink("item", address, testnet),
                $tvlink("owner", owner_address, testnet),
                $tvlink("collection", collection_address, testnet)
            ),
        ),
        info.name && $p("name-desc")[src](
            $span("item-name", info.name),
            $span("item-desc", info.description)
        ),
        $p('links')[src](
            $a(`https://${testnet}getgems.io/nft/${address}`, "getgems"),
            $a(`https://${testnet}tonscan.org/nft/${address}`, "tonscan"),
            $a(`https://${testnet}tonviewer.com/${address}`, "tonviewer")
        ),
        info.nft_index && 
            $li(`list`) [src] (
                $span('link-desc', "nft_index"), 
                $span('link', info.nft_index)
            ),
        content.uri && 
            $detailNFT("content uri", content.uri),
        collection.collection_content.uri && 
            $detailNFT("collection content uri", collection.collection_content.uri),
        info.image &&
            $detailNFT("image", info.image),
        info.extra?._image_small &&
            $detailNFT("small image", info.extra._image_small),
        info.extra?._image_medium && 
            $detailNFT("medium image", info.extra._image_medium),
        info.extra?._image_big && 
            $detailNFT("big image", info.extra._image_big),
        $p('metadata')[src](
            $p('metadata-header', "metadata") [src] (
                $span('copy-icon', 'copy').click(function() {
                    const metadataText = $('.metadata-code').text();
                    navigator.clipboard.writeText(metadataText).then().catch(err => console.error('Failed to copy metadata: ', err));
                })
            ),
            $p('metadata-code', JSON.stringify(metaitem, null, 2)),
            
        )
    );  

export const Siena = {
    webApp: (Elements) => {
        const webApp = window.Telegram.WebApp;
        if(!webApp.initData == false){
            
        webApp.ready();
        telegwebAppram.expand();
        
        if(Siena.isMobile() && Elements)  Elements.$page.addClass("mobile")

        window.Telegram.WebView.postEvent('web_app_set_header_color', false, { color: "#101418" });

        return {WebApp: webApp, WebView: window.Telegram.WebView}
    }
    return null;
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