var $ = jQuery, urlparams, Collections = {},
    $content = $(".content"), $page = $(".page");
    eruda.init();

function buildCollectionList(udata, metadata) {
    const $content = $(".content").empty();
        $('<p>').addClass('alert-e-message').text(sliceAddress(Collections.collection || Collections.address, 20)).appendTo($(".content"))

    Object.entries(metadata).forEach(([addr, { token_info: [data] }]) => {
        console.log(addr)
        var current_type = Collections.collection ? "nft_items" : "nft_collections";
        if (data.type === current_type) {
            const $card = $('<div class="card">');

            const onclick = () => window.location.href = "http://127.0.0.1:5500/collectibles/index.html?account=" + udata.address + "&collection=" + addr;
            const column = (text, id) => {
                  if (!document.querySelector("#content-column-" + id)) {
                    $('<h3>').text(text).appendTo($content);
                    $('<div class="column">').attr('id', 'content-column-' + id).appendTo($content);
                }
            }

            const $header = $('<div class="card-header">').appendTo($card);
            const $title = $('<p class="card-title">').text(data.name || 'No name').appendTo($header);
            if(data.type == "nft_collections") $title.on("click", onclick)
            $('<img class="card-preview">')
                .attr('src', data.extra?._image_small || '../nopic.png')
                .attr('alt', 'Preview').appendTo($header);

            if (data.description) {
                if(Collections.collection !== "0:80D78A35F955A14B679FAA887FF4CD5BFC0F43B4A4EEA2A7E6927F3701B273C2"){                var $description = $('<p class="card-description truncated-text">')
                    .text(data.description).appendTo($card);
                if(data.type == "nft_collections") $description.on("click", onclick)
            }
               column("With description", 1);
            } else column("No description", 2);
                
            

            $(`#content-column-${data.description ? 1 : 2}`).append($card);
        }
    });
}

const tg = window.Telegram.WebApp;
window.Telegram.WebView.postEvent('web_app_set_bottom_bar_color', false, {color: "#1a2026"});

window.Telegram.WebView.postEvent('web_app_set_header_color', false, {color: "#1a2026"});
tg.ready();
tg.expand();
if (window.history.length > 1) {
    tg.BackButton.show();
} else {
    tg.BackButton.hide();
}
function sliceAddress(string, length) {
    string = new TonWeb.utils.Address(string).toString(true, true, true);
  if (string.length < length) return string;
  return string.slice(0, length/2) + "..." + string.slice(-length/2);
}

function loadCollections(urladdress, todo) {
    Collections.address = urladdress;
    $.getJSON(`https://${getTestnetPrefix()}toncenter.com/api/v3/nft/items?owner_address=${Collections.address}&limit=${Math.min(Collections.limit, 1000)}&offset=${Collections.offset}${Collections.collection ? "&collection_address=" + Collections.collection : ""}`)
        .then(todo).catch(error => previewScreen(urlparams, error.responseJSON?.error));
}

const onAddressIdentification = (address, todo) => {
    if (!address) return previewScreen(urlparams, "Please enter address");
    $.getJSON(`https://${getTestnetPrefix()}tonapi.io/v2/accounts/${address}`)
        .then(todo).catch(e => previewScreen(urlparams, "Address doesn't exist or some error occured"));
}


const getTestnetPrefix = () => Collections.testnet == 1 ? "testnet." : "";

const previewScreen = (url, message = null) => {
    $page.empty();

    if (message)
        $('<p>').addClass('alert-e-message').text(message).appendTo($(".page"))
    const $pc = $('<div>').addClass('pr-cn').appendTo($page);

    var inel = (text, type, placeholder, param, alt = '') => {
        var $wrapper = $('<div>').addClass('pr-iw').appendTo($pc);
        // var $label = $('<label>').addClass('pr-il').text(text).appendTo($wrapper);
        var $input = $('<input>').addClass('pr-if').attr({
            type: type, placeholder: placeholder,
            value: url.get(param) || alt
        }).appendTo($wrapper);
        return $input;
    }

    const $ai = inel('Account', 'text', 'Enter account', 'account');
    const $oi = inel('Offset', 'number', 'Enter offset', 'offset', 0);
    const $li = inel('Limit', 'number', 'Enter limit', 'limit', 1000);
    const $ci = inel('Collection', 'text', 'Enter collection', 'collection');
    const $sw = $('<div class="switch-wrapper">').appendTo($pc);

    $('<label class="switch-label">').text('Testnet').appendTo($sw);

    const $ts = $('<label class="switch">').appendTo($sw);
    const $tc = $('<input type="checkbox">').appendTo($ts);
    $('<span class="slider round">').appendTo($ts);



    const $buttonContainer = $('<div>').addClass('pr-sr-cn').appendTo($pc);
    $('<button>').addClass('pr-sr-bt').text('Search').on('click', () => {
        if ($ai.val()) {
            let url = `https://tonsiena.github.io/collectibles/?account=${$ai.val()}`;
            if ($oi.val()) url += `&offset=${$oi.val()}`;
            if ($li.val()) url += `&limit=${$li.val()}`;
            if ($ci.val()) url += `&collection=${$ci.val()}`;
            if ($tc.is(':checked')) url += `&testnet=1`;
            window.location.href = url;
        }
    }).appendTo($buttonContainer);
};


$(document).ready(function () {
    urlparams = new URLSearchParams(window.location.search);

    Object.assign(Collections, {
        collection: urlparams.get("collection") || "",
        offset: Number(urlparams.get("offset")) || 0,
        limit: Number(urlparams.get("limit")) || 1000,
        testnet: Number(urlparams.get("testnet")) || 0
    });

    $content.html('<div class="alert-message">Loading...</div>');

    onAddressIdentification(urlparams.get("account"), (data) => {
        loadCollections(data.address, ({ nft_items, metadata }) => {
            if (!nft_items.length) return previewScreen(urlparams, "NFT wasn't found on this address");
            buildCollectionList(data, metadata);
        })
    })
});
