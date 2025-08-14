 const buildPage = (target, testnet = "") => {
    if (!target) return $alert("Please enter address", target);

    $.getJSON(`https://${testnet}toncenter.com/api/v3/nft/items?address=${target}&limit=1&offset=0`)
        .then(data => {
            if (!data || !data.nft_items.length) return $alert("Invalid NFT address or no data found", target);

            const item = data.nft_items[0];
            const itemMeta = data.metadata[item.address];
            const itemInfo = itemMeta.token_info[0];
            const itemPreview = itemInfo.extra?._image_small;

            const collectionMeta = data.metadata[item.collection.address];
            const collectionInfo = collectionMeta.token_info[0];
            const collectionPreview = collectionInfo.extra?._image_small;

            $content(
                    $div('card border flex-center-column',
                        $img("preview-card", collectionPreview || itemPreview, "Background"),
                        $div("preview-blur flex-center", $img("preview", itemPreview, 'Preview')),
                        $span("item-name", itemInfo.name),
                        Modal.$metadata(itemMeta. testnet),
                        $span("network-button flex-center-column", `switch to ${testnet.length == 0 ? "testnet":"mainnet"}`).click(() => window.location.href = `${origin}/nft/?${ testnet.length != 0 ? "":"t"}item=` + item.address)
                    ),

                    itemInfo.description && $span("item-description border", itemInfo.description),
                    $detail("item", getFriendlyAddress(item.address), 1, testnet),
                    $detail("owner", getFriendlyAddress(item.owner_address), 1, testnet),
                    $detail("collection", getFriendlyAddress(item.collection_address), 1, testnet),
                    $detail("nft_index", itemInfo.nft_index, 2, testnet),
                    $detail("content uri", item.content.uri),
                    $detail("collection content uri", item.collection.collection_content.uri),
                    $detail("image", itemInfo.image),
                    $detail("image small", itemInfo.extra?._image_small),
                    $detail("image medium", itemInfo.extra?._image_medium),
                    $detail("image big", itemInfo.extra?._image_big)
                )
        })
        .catch(e => $alert(e.responseJSON.error, target));
}

const $detail = (label, val, clickable = 0, net = "") => val && $li('list border')[src](
                $p(null, label), [$a, Modal.$modalAddress, $span][clickable](val, val, val, net),
                $img("img-copy", "../icons/copy.png", "copy").click(() => {
                    navigator.clipboard.writeText(val).catch(console.error)
                    $toast("copied to clipboard")
                })
            )


const $alert = (text, address = "") => $content(
    $div("alert", 
           $el("input", "alert-input-address").attr({ value: address }),
           $span("alert-message", text),
                    $span("alert-button", "search in mainnet").click(() => window.location.href = origin + "/nft/?item=" + $(".alert-input-address").val()),
                    $span("alert-button", "search in testnet").click(() => window.location.href = origin + "/nft/?titem=" + $(".alert-input-address").val()),
                    $span("alert-button", "go to home page").click(() => window.location.href = origin)
    )
)
                                      
            
$(document).ready(() => {
    const isTelegram = window.Telegram && window.Telegram?.WebApp;
    var webApp = isTelegram && initTelegramWebApp(true)?.WebApp;
    const startParam = webApp?.initDataUnsafe?.start_param || "";
    const params = getUrlParams();

    let target =  params.get("item") || params.get("titem") || null;

    if(target == null){
        target = startParam.replace(/^t?nft_/, "");
        console.log("address from startApp: " + target);
    }else console.log("address from urlParams: " + target);

    let testnet = "";

    if(params.has("titem")){
        testnet = "testnet.";
        console.log("testnet from urlParams");
    }else if(params.has("item")){
        testnet = "";
        console.log("mainnet from urlParams");
    }else if(/^tnft_/.test(startParam)){
        testnet = "testnet.";
        console.log("testnet from startParams");
    }else console.log("mainnet from startParams");

    buildPage(target, testnet)
});
