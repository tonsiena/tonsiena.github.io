import { Siena } from "../core/tonsiena.js"

var $ = jQuery;

var loadItem = (ts, item, todo) => $.getJSON(`https://${ts}toncenter.com/api/v3/nft/items?address=${item}&limit=1&offset=0`)
    .then(todo).catch(error => console.log(error));


$(document).ready(() => {
    var params = Siena.getUrlParams();
    loadItem("", params.get("item"), ({ nft_items: [{ address, collection_address, owner_address, content, collection }], metadata, addressbook }) => {

        var metaitem = metadata[address];
        var token_info = metaitem.token_info[0];
        var $content = $(".content");
        var $preview = $('<img class="item-preview">')
            .attr('src', token_info.extra?._image_small || '../icons/nopic.png')
            .attr('alt', 'Preview');

        $preview.appendTo($content);
        console.log(metadata)

        var addItem = (key, value) => value && $("<li class='infoli'>").append($("<h2>").text(key), $("<h5>").text(value)).appendTo($content);
        addItem("name", token_info.name);
        addItem("description", token_info.description);

        addItem("address", address);
        addItem("collection", collection_address);
        addItem("owner", owner_address);
        addItem("content uri", content.uri)
        addItem("collection content uri", collection.collection_content.uri)
        addItem("image", token_info.image);
        addItem("small image", token_info.extra?._image_small);
        addItem("medium image", token_info.extra?._image_medium);
        addItem("big image", token_info.extra?._image_big);

    })
})