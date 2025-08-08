import { Siena, $, src, to, $alert, $el, $p, $a, $div, $img, $span, $li, $tvlink, $detailNFT, buildPageNFT} from "../core/tonsiena.builder.js"

var send = (ts, item, todo) => {
    if(item){
        var url = `https://${ts}toncenter.com/api/v3/nft/items?address=${item}&limit=1&offset=0`
        console.log("1" + url)
        $.getJSON(url).then(todo).catch(e => $alert(e.responseJSON.error));
    }else $alert("address unkown")
}
$(document).ready(() => {
    const webApp = Siena.webApp()?.WebApp;
    const startParam = webApp?.initDataUnsafe?.start_param || "";
    var sienaParams = Siena.getUrlParams();
    var target = startParam || sienaParams.get("item") ||  sienaParams.get("titem");
    var testnet = sienaParams.get("titem") ? "testnet." : "";

    if (startParam.startsWith("nft_")) target = startParam.replace("nft_", "");
    else if (startParam.startsWith("tnft_")){
         target = startParam.replace("tnft_", "");
         testnet = "testnet."
    }
    send(testnet, target, (data) => {
        if(!data || !data.nft_items.length){
            $alert("Invalid NFT address or no data found");
            return;
        }
        const { nft_items: [{ address, collection_address, owner_address, content, collection }], metadata, addressbook } = data;
        const metaitem = metadata[address];
        buildPageNFT(metaitem.token_info[0], address, owner_address, collection_address, content, collection, metaitem, testnet)
    })
})