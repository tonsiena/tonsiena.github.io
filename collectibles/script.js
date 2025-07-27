import { CardBuilder } from "../core/CardBuilder.js";
import { previewScreen } from "../core/PreviewCollectibles.js";

const $ = jQuery, Collections = {};
var $content, $archive, $page = $("page"), $overlay = $("overlay"), urlparams;

function loadCollections(urladdress, todo) {
    Collections.address = urladdress;
    $.getJSON(`https://${Collections.testnet == 1 ? "testnet." : ""}toncenter.com/api/v3/nft/items?owner_address=${Collections.address}&limit=${Math.min(Collections.limit, 1000)}&offset=${Collections.offset}${Collections.collection ? "&collection_address=" + Collections.collection : ""}`)
        .then(res => todo(res)).catch(error => previewScreen($page, urlparams, error.responseJSON?.error));
}

const initTabs = () => {
    $content = $('<ul>', { class: 'content', id: 'content-main' }).appendTo($page);
    $archive = $('<ul>', { class: 'content', id: 'content-archive' }).hide().appendTo($page);

    const toggleTab = isArchive => {
        $content.toggle(!isArchive);
        $archive.toggle(isArchive);
        $('#tab-main').toggleClass('active', !isArchive);
        $('#tab-arch').toggleClass('active', isArchive);
    };

    $('#tab-arch').on('click', () => toggleTab(true));
    $('#tab-main').on('click', () => toggleTab(false));
    $('#tab-menu').on('click', () => {
        $page.toggle();
        $overlay.toggle();
    });

    $('<p>', { class: 'info-channel', text: 'official telegram channel' })
        .append($('<a>', { href: 'https://t.me/meowearmuff', text: '@meowearmuff', target: '_blank' }))
        .appendTo($overlay);

    $('<p>', { class: 'info-channel', text: 'contact dev' })
        .append($('<a>', { href: 'https://t.me/sheasame', text: '@sheasame', target: '_blank' }))
        .appendTo($overlay);
};

class onAddressIdentification {
    constructor(address, todo) {
        if (address)
            $.getJSON(`https://${Collections.testnet == 1 ? "testnet." : ""}tonapi.io/v2/accounts/${address}`)
                .then(res => todo(res)).catch(error => previewScreen($page, urlparams, "Address doesn't exist or some error occured"));
        else previewScreen($page, urlparams, "Please enter address");
    }
}

function buildCollectionList(address, metadata) {
    $page.empty();
    initTabs();
    $("<p>").addClass("alert-e-message").text(address).appendTo($page);
    const targetType = Collections.collection ? "nft_items" : "nft_collections";
    Object.entries(metadata).forEach(([addr, { token_info: [data] }]) => {
        if (data.type === targetType) {
            CardBuilder.build(address, data, (data.valid && data.image) ? $content : $archive, Collections.testnet, Collections.minimized)
        }
    });
}

function onStart() {
    urlparams = new URLSearchParams(window.location.search);

    Object.assign(Collections, {
        collection: params.get("collection") || "",
        offset: Number(params.get("offset")) || 0,
        limit: Number(params.get("limit")) || 1000,
        testnet: Number(params.get("testnet")) || 0,
        minimized: Number(params.get("minimized")) || 0
    });

    initTabs();
    $page.html('<div class="alert-message">Loading...</div>');

    new onAddressIdentification(urlparams.get("account"), ({ address }) => {
        loadCollections(address, ({ nft_items, metadata }) => {
            if (nft_items.length) buildCollectionList(address, metadata);
            else previewScreen($page, urlparams, "NFT wasn't found on this address");
        })
    })
}

$(document).ready(onStart);