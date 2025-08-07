import { Siena } from "../core/tonsiena.js"

const $ = jQuery, src = "append", to = "appendTo"; 

var send = (ts, item, todo) => $.getJSON(`https://${ts}toncenter.com/api/v3/nft/items?address=${item}&limit=1&offset=0`).then(todo).catch(e => console.log(e));

const $el = (selector, name) => $(name ? `<${selector} class=" ${name}">` : `<${selector}>`)
const $p = (name, text) => $el("p", name).text(text)
const $span = (name) => $el("span", name);
const $div = (name) => $el("div", name);
const $li = (name) => $el("li", name)
const $img = (name) => $el("img", name);
const $a = (href, text) => $(`<a href="${href}">${text}</a>`)


$(document).ready(() => {
Siena.webApp();
    const startParam = window.Telegram.WebApp.initDataUnsafe?.start_param || "";
  const params = Siena.getUrlParams();
  var nftAddress = startParam || params.get("item");

  if (startParam.startsWith("nft_"))
     nftAddress = startParam.replace("nft_", "");

    if(!nftAddress) return;
    send("", nftAddress, ({ nft_items: [{ address, collection_address, owner_address, content, collection }], metadata, addressbook }) => {

        var metaitem = metadata[address], { token_info } = metaitem, info = token_info[0], { extra } = info;
        var $content = $(".content");

        var $iCard = $div('i-card') [src] (
            $img("preview")
                .attr('src', extra?._image_small || '../icons/nopic.png').attr('alt', 'Preview')
            ) [to] ($content);

        var link = (key, val) => 
            $p(`i-link`) [src] (
                $span('link-desc').text(key), 
                $a("https://tonviewer.com/" + val, Siena.sliceAddress(val, 24)
            ).addClass("link"));

        $div('card-desc') [src] (
            link("item",       address), 
            link("owner",      owner_address),
            link("collection", collection_address)
        ) [to] ($iCard)
       
        $p('links') [src] (
            $a(`https://getgems.io/nft/${address}`,  "getgems"),
            $a(`https://tonscan.org/nft/${address}`, "tonscan"),
            $a(`https://tonviewer.com/${address}`,   "tonviewer")
        ) [to] ($content);
        
        $p("name-desc") [src] ($span("item-name").text(info.name), $span("item-desc").text(info.description)) [to] ($content);

        [["nft index", info.nft_index],
        ["content uri", content.uri],
        ["collection content uri", collection.collection_content.uri],
        ["image", info.image],
        ["small image", extra?._image_small],
        ["medium image", extra?._image_medium],
        ["big image", extra?._image_big]]
        .forEach(i => i[1] && $li('list') [src] (
            $p(null, i[0]),
            $a(i[1], i[1])
        ) [to] ($content));
   
        $p('metadata') [src] (
            $p('metadata-header', "metadata"),
            $p('metadata-code', JSON.stringify(metadata[address], null, 2))
        ) [to] ($content);
    })
})