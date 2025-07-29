import { previewScreen } from "../core/PreviewCollectibles.js";
var $ = jQuery, urlparams, Collections = {};
function buildCollectionList(data, metadata) {
    if(!document.querySelector("#content-column-1")){
        $(".content").html(`<h3>With description</h3>
          <div class="column" id="content-column-1"></div>
            <h3>No description</h3>
          <div class="column" id="content-column-2"></div>`);
    }
    Object.entries(metadata).forEach(([addr, { token_info: [data] }]) => {
        if (data.type === "nft_collections") {
            $(`#content-column-${data.description ? 1 : 2}`).append(`
      <div class="card">
        <div class="card-header">
          <p class="card-title">${data.name || "No name"}</p>
          <img class="card-preview" src="${data.extra?._image_small || "../nopic.png"}" alt="Preview">
        </div>
        ${data.description ? `<p class="card-description truncated-text">${data.description}</p>` : ""}
      </div>`);
        }
    });
}

function loadCollections(urladdress, todo) {
    Collections.address = urladdress;
    $.getJSON(`https://${getTestnetPrefix()}toncenter.com/api/v3/nft/items?owner_address=${Collections.address}&limit=${Math.min(Collections.limit, 1000)}&offset=${Collections.offset}${Collections.collection ? "&collection_address=" + Collections.collection : ""}`)
        .then(todo).catch(error => previewScreen($(".content"), urlparams, error.responseJSON?.error));
}

const onAddressIdentification = (address, todo) => {
    if (!address) return previewScreen($(".content"), urlparams, "Please enter address");
    $.getJSON(`https://${getTestnetPrefix()}tonapi.io/v2/accounts/${address}`)
        .then(todo).catch(e => previewScreen($0(".content"), urlparams, "Address doesn't exist or some error occured"));

}
function onStart() {
    urlparams = new URLSearchParams(window.location.search);

    Object.assign(Collections, {
        collection: urlparams.get("collection") || "",
        offset: Number(urlparams.get("offset")) || 0,
        limit: Number(urlparams.get("limit")) || 1000,
        testnet: Number(urlparams.get("testnet")) || 0
    });

     $(".content").html('<div class="alert-message">Loading...</div>');

    onAddressIdentification(urlparams.get("account"), (data) => {
        loadCollections(data.address, ({ nft_items, metadata }) => {
            if (!nft_items.length) return previewScreen($(".content"), urlparams, "NFT wasn't found on this address");
            buildCollectionList(data, metadata);
        })
    })
}

const getTestnetPrefix = () => Collections.testnet == 1 ? "testnet." : "";
$(document).ready(onStart);
