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
    $archive = $('<ul>', { class: 'content', id: 'content-archive' }).hide().appendTo($page)

    const toggleTab = isArchive => {
        $content.toggle(!isArchive);
        $archive.toggle(isArchive);
        $('#tab-main').toggleClass('active', !isArchive);
        $('#tab-arch').toggleClass('active', isArchive);
    };

    $('#tab-arch').on('click', () => toggleTab(true));
    $('#tab-main').on('click', () => toggleTab(false));

};

const initTabsMenu = () => {
 $('#tab-menu').on('click', () => {
        $page.fadeToggle();
        $overlay.fadeToggle();

    });

    $('<p>', { class: 'info-channel', text: 'official telegram channel' })
        .append($('<a>', { href: 'https://t.me/meowearmuff', text: '@meowearmuff', target: '_blank' }))
        .appendTo($overlay);

    $('<p>', { class: 'info-channel', text: 'contact dev' })
        .append($('<a>', { href: 'https://t.me/sheasame', text: '@sheasame', target: '_blank' }))
        .appendTo($overlay);
}
class onAddressIdentification {
    constructor(address, todo) {
        if (address)
            $.getJSON(`https://${Collections.testnet == 1 ? "testnet." : ""}tonapi.io/v2/accounts/${address}`)
                .then(res => todo(res)).catch(error => previewScreen($page, urlparams, "Address doesn't exist or some error occured"));
        else previewScreen($page, urlparams, "Please enter address");
    }
}

function getAddrMessage(udata, div){
    var $addrmessage = $('<p>', { class: 'addr-message' })
            .append(
                'Вы смотрите адрес кошелька: ',
                $('<a>', {
                    href: `https://${Collections.testnet ? 'testnet.' : ''}tonscan.org/address/${udata.address}`,
                    text: udata.address,
                    target: '_blank'
                }),
                $('<br>'),
                `Баланс кошелька: ${(udata.balance / 1e9).toFixed(2)} TON`,
                $('<br>'),
                `Последняя транзакция в: ${udata.last_activity ? new Date(udata.last_activity * 1000).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }) : 'Неизвестно'}`
            );
    $addrmessage.appendTo(div);
}
function buildCollectionList(udata, metadata) {
    $page.empty();
    getAddrMessage(udata, $page);

    initTabs();
    const targetType = Collections.collection ? "nft_items" : "nft_collections";
    Object.entries(metadata).forEach(([addr, { token_info: [data] }]) => {
        if (data.type === targetType) {
            CardBuilder.build(udata.address, data, (data.valid && data.image) ? $content : $archive, Collections.testnet, Collections.minimized)
        }
    });
}

function onStart() {
    urlparams = new URLSearchParams(window.location.search);

    Object.assign(Collections, {
        collection: urlparams.get("collection") || "",
        offset: Number(urlparams.get("offset")) || 0,
        limit: Number(urlparams.get("limit")) || 1000,
        testnet: Number(urlparams.get("testnet")) || 0,
        minimized: Number(urlparams.get("minimized")) || 0
    });

    initTabsMenu();
    $page.html('<div class="alert-message">Loading...</div>');

    new onAddressIdentification(urlparams.get("account"), (data) => {
        loadCollections(data.address, ({ nft_items, metadata }) => {
            if (nft_items.length) buildCollectionList(data, metadata);
            else previewScreen($page, urlparams, "NFT wasn't found on this address");
        })
    })
}

$(document).ready(onStart);