import { Siena } from "../core/tonsiena.js"

var $ = jQuery, RequestData, Elements = { $page: $(".page"), $content: $(".content") };

var buildCollectionList = (udata, metadata) => {
    Elements.$content.empty();
    Elements.$alert = $('<p>').addClass('alert-message')
        .text(Siena.sliceAddress(RequestData?.account, 20))
        .append($("<div>").append(scrollToTopButton(), $('<span>').addClass('back-page-span')
            .text("back").on("click", () => window.history.back()))).insertBefore(Elements.$content)

    var target = RequestData.collection ? "nft_items" : "nft_collections";
    Object.entries(metadata).forEach(([addr, { token_info: [{ name, description, extra, type }] }]) =>
        type === target && buildCard(udata, addr, name, description, extra));
}

function buildCard(udata, addr, name, description, extra) {
    var $card, $header, $title;

    const onclick = () => window.location.href = Siena.origin + "/collectibles/?account=" + udata.address + "&collection=" + addr;

    $card = $('<div class="card">')
        .append($header = $('<div class="card-header">')
        .append($title = $('<p class="card-title">')
        .text(name || 'No name').on("click", onclick)));

    $('<img class="card-preview">')
        .attr('src', extra?._image_small || '../icons/nopic.png')
        .attr('alt', 'Preview').appendTo($header);

    if (description) {
        if (!Siena.isDomains(RequestData) && !Siena.isNumbers(RequestData)) $('<p class="card-description">')
            .text(description).on("click", onclick).appendTo($card);

        buildColumn("With description", 1);
    } else buildColumn("No description", 2);

    $(`#content-column-${description ? 1 : 2}`).append($card);
}

const buildColumn = (text, id) =>
    !document.querySelector("#content-column-" + id) && Elements.$content
    .append($('<h3>').text(text), $('<div class="column">').attr('id', 'content-column-' + id));


    const onAddressIdentification = (address, todo) => !address ? previewScreen("Please enter address") : $.getJSON(`https://${getTestnetPrefix()}tonapi.io/v2/accounts/${address}`)
    .then(todo).catch(e => previewScreen("Address doesn't exist or some error occured"));


const getTestnetPrefix = () => RequestData?.testnet == 1 ? "testnet." : "";

const scrollToTopButton = () => $('<button>').addClass('scroll-to-top').text('↑').hide().on('click', () => Elements.$content.animate({ scrollTop: 0 }, 400));

Elements.$content.on('scroll', () => $('.scroll-to-top')?.toggle(Elements.$content.scrollTop() > 400));

const previewScreen = (message = null) => {
    Elements.$content.empty();
    if ($(".alert-message")) $(".alert-message").remove();
    if (message) $('<p>').addClass('hl-message').text(message).appendTo(Elements.$content)

    const $pc = $('<div>').addClass('preview').appendTo(Elements.$content);

    var inel = (type, placeholder, alt = '') => $('<input>').addClass('preview-input').attr({ type: type, placeholder: placeholder, value: alt }).appendTo($pc);

    const $ai = inel('text', 'owner address');
    const $oi = inel('number', 'offset', 0);
    const $li = inel('number', 'limit', 1000);
    const $ci = inel('text', 'collection address');
    const $sw = $('<div class="switch-wrapper">').appendTo($pc);

    $('<label class="switch-label">').text('Testnet').appendTo($sw);

    const $ts = $('<label class="switch">').appendTo($sw);

    const $tc = $('<input type="checkbox">').appendTo($ts);
    $('<span class="slider round">').appendTo($ts);


    const $bc = $('<div>').addClass('preview-search-container').appendTo($pc);
    $('<button>').addClass('preview-search-button').text('Search').on('click', () => {
        if ($ai.val()) {
            onAddressIdentification($ai.val().toLowerCase(), (data) => {
                RequestData = {
                    offset: $oi.val() || 0,
                    limit: $li.val() || 1000,
                    account: data.address,
                    collection: $ci.val() || null,
                    testnet: $tc.is(':checked') || false
                }

                window.location.href = Siena.origin + "/collectibles/?account=" + data.address;
            });
        }
    }).appendTo($bc)
};

var loadCollections = (ts, todo) => $.getJSON(`https://${ts}toncenter.com/api/v3/nft/items?owner_address=${RequestData.account}&limit=${Math.min(RequestData.limit, 1000)}&offset=${RequestData.offset}${RequestData.collection ? "&collection_address=" + RequestData.collection : ""}`)
        .then(todo).catch(error => previewScreen(error.responseJSON?.error));

var parseUrl = () => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    const account = params.get('account');
    if (account) {
        RequestData = {
            offset: params.get('offset') || 0,
            limit: params.get('limit') || 1000,
            account: account,
            collection: params.get('collection') || null,
            testnet: params.get('testnet') || false
        }
        onAddressIdentification(account, (data) => {
            loadCollections(getTestnetPrefix(), ({ nft_items, metadata }) => {
                if (!nft_items.length) return previewScreen("NFT wasn't found on this address");
                buildCollectionList(data, metadata);
            });
        });

    } else previewScreen("Please enter address");
}
$(document).ready(() => {
    Siena.webApp(Elements);
    parseUrl();
});