import { CardBuilder } from "../core/CardBuilder.js";
import { previewScreen } from "../core/PreviewCollectibles.js";

const $ = jQuery, Collections = {};
var $content, $archive, $page = $("page"), $overlay = $("overlay"), urlparams;

function loadCollections(urladdress, todo){
        Collections.address = urladdress;
        $.getJSON(`https://${Collections.testnet == 1 ? "testnet." : "" }toncenter.com/api/v3/nft/items?owner_address=${Collections.address}&limit=${Collections.limit <= 1000 ? Collections.limit : 1000}&offset=${Collections.offset}${Collections.collection ? "&collection_address=" + Collections.collection : ""}`)
            .then(res => todo(res)).catch(error => previewScreen($page, urlparams,  error.responseJSON.error));
}

function initTabs() { 
    $content = $('<ul>').addClass('content').attr('id', 'content-main').appendTo($page);
    $archive = $('<ul>').addClass('content').attr('id', 'content-archive').hide().appendTo($page);

    const tabClick = (isArchive) => {
        if (isArchive) {
            $content.hide();
            $archive.show();
        } else {
            $archive.hide();
            $content.show();
        }
        $('#tab-main').toggleClass('active', !isArchive);
        $('#tab-arch').toggleClass('active', isArchive);
    };
    
    $('#tab-arch').on('click', () => tabClick(true));
    $('#tab-main').on('click', () => tabClick(false));

    $('#tab-menu').on('click', () => {
        if($page.is(":visible")){
        $page.hide();
        $overlay.show();
        }else{
        $overlay.hide();
        $page.show();
        }
    });


    var $off_ch = $("<p>").addClass("info-channel");
    $off_ch.text("official telegram channel");
    $off_ch.appendTo($overlay)

    $("<a>").attr("href", "https://t.me/meowearmuff").text("@meowearmuff").appendTo($off_ch);

    var $dev_url = $("<p>").addClass("info-channel");
    $dev_url.text("contact dev");
    $dev_url.appendTo($overlay)

    $("<a>").attr("href", "https://t.me/sheasame").text("@sheasame").appendTo($dev_url);
}

class onAddressIdentification {
    constructor(address, todo) {
        if (address)
            $.getJSON(`https://${Collections.testnet == 1 ? "testnet." : "" }tonapi.io/v2/accounts/${address}`)
                .then(res => todo(res)).catch(error => previewScreen($page, urlparams, "Address doesn't exist or some error occured"));
        else previewScreen($page, urlparams, "Please enter address");
    }
}

function buildCollectionList(address, metadata) {
    $page.empty();
    initTabs();
    const targetType = Collections.collection ? "nft_items" : "nft_collections";
    Object.keys(metadata).forEach(address => {
        const data = metadata[address].token_info[0];
        if (data.type === targetType) {
                CardBuilder.build(address, data, (data.valid && data.image) ? $content : $archive, Collections.testnet, Collections.minimized)
        }
    });
}

function onStart() {
    urlparams = new URLSearchParams(window.location.search);

    Collections.collection = urlparams.get("collection") || "";
    Collections.offset = Number(urlparams.get("offset")) || 0;
    Collections.limit = Number(urlparams.get("limit")) || 1000;
    Collections.testnet = Number(urlparams.get("testnet")) || 0;
    Collections.minimized = Number(urlparams.get("minimized")) || 0;
    initTabs();
    $page.html('<div class="alert-message">Loading...</div>');

    new onAddressIdentification(urlparams.get("account"), ({ address }) => {
        $("<p>").addClass("alert-e-message").text(address).appendTo($page);
        loadCollections(address, ({ nft_items, metadata }) => {
            if(nft_items.length != 0) buildCollectionList(address, metadata);
            else previewScreen($page, urlparams, "NFT wasn't found on this address");
        })
    })
}

$(document).ready(onStart);