import { e3, o4, q5, collections, tabs, fetchAccount, fetchNumbers, sliceAddress, display, cfetch} from './core.js';

var   filtrableItems = [];
var   isgridview     = true;
var   currentAddress = null;
var   isAscending    = true;

const Elements = {
    content:      q5(".content"),
    sortList:     q5("#sort-list-button"),
    changeView:   q5("#changeView"),
    inputSearch:  q5(".search-input"),
    container:    q5("#container"),
    buttonSearch: q5("#search-button"),
    filt:         q5(".filt"),
    Nav: {
        next:     q5("#nav-next"),
        prev:     q5("#nav-prev"),
        current:  q5("#nav-current"),
    }
};

 Elements.buttonSearch.onclick = async (e) => {
        var res = await fetchAccount(Elements.inputSearch.value)
        if (res) setCurrentAddress(res.address);
}
Elements.inputSearch.oninput = () => {
     display(Elements.buttonSearch, Elements.inputSearch.value.trim() ? 'flex' : 'none');
     display(Elements.filt, Elements.inputSearch.value.trim() ? 'none' : 'flex');
}

Elements.changeView.onclick = () => {
    isgridview = !isgridview;
    Elements.content.style.cssText = isgridview
        ? "display: grid;"
        : "display: flex; flex-direction: column;";
    document.querySelectorAll(".collections-item, .collections-grid-item")
        .forEach(i => i.className = isgridview ? "collections-grid-item" : "collections-item");
    };


document.addEventListener('keydown', async (event) => {
    if (event.ctrlKey && event.key === '/' && Elements.inputSearch.value.length != 0) {
        var res = await fetchAccount(Elements.inputSearch.value)
        if (res) setCurrentAddress(res.address);
             display(Elements.buttonSearch, 'none');
     display(Elements.filt, 'flex');
        event.preventDefault();
    }
});

const setCurrentAddress = (address) => {
    Elements.inputSearch.value = "";
    Elements.content.innerHTML = '';
    if(!address) return;
    currentAddress = address;
 loadCollections();
}

var collectionsList = { address: [], names:[] }


var CollectionCore = {
    offset: 0, limit: 300,
    load: async function () {
        return await cfetch(
            "https://toncenter.com/api/v3/nft/items?owner_address=" + currentAddress +
            "&limit=" + this.limit + "&offset=" + this.offset);
    }
};

async function loadCollections(prop) {
    var { nft_items: items, metadata: meta, address_book: book } = await CollectionCore.load();

    if (items?.length) {
        Elements.container.innerHTML = `<ul class="content"></ul>`
        Elements.content = q5(".content"),
        collectionsList = { address: [], names:[] }
        filtrableItems = [];
        display(Elements.content, isgridview ? "grid" : "flex");
        items.forEach(({ address, content, collection, collection_address }) => {
            const li = o4("li", { classList: "border " + (isgridview ? "collections-grid-item" : "collections-item")});
            if (collection) {
                var metadata = meta[collection_address];
                var token_info = metadata.token_info[0];
                var isvalid = token_info.valid;

                if (collection.address && collection_address) {
                    if (!collectionsList.address.includes(collection.address)) {
                        if (isvalid) {
                            var icon = meta[collection_address].token_info[0].image;
                            if (icon) {
                                collectionsList.address.push(collection.address)
                                collectionsList.names.push(token_info.name)
                                li.appendChild(o4("img", { width: 100, height: 100, loading:"lazy",src:  meta[collection_address].token_info[0].image }));
                                li.appendChild(o4("span", { textContent: token_info.name }));
                                Elements.content.appendChild(li);
                                filtrableItems.push({ element: li, name: token_info.name });
                            }
                        }
                    }
                }
            }
        });
    }else Elements.container.innerHTML = `<p class="empty-page">nothing was found</p>`
}

Elements.sortList.onclick = () => sortItems(); 


function sortItems() {
    isAscending = !isAscending; 
    filtrableItems.sort((a, b) => isAscending ? a.name.length - b.name.length : b.name.length - a.name.length);

    Elements.content.innerHTML = '';
    filtrableItems.forEach(item => Elements.content.appendChild(item.element));
}

Elements.Nav.next.onclick = () => {
    CollectionCore.offset += CollectionCore.limit;
    Elements.Nav.current.textContent = CollectionCore.offset + " - " + (CollectionCore.offset +  CollectionCore.limit);
    loadCollections();
}

Elements.Nav.prev.onclick = () => {
    if (CollectionCore.offset -  CollectionCore.limit >= 0) {
        Elements.Nav.current.textContent = (CollectionCore.offset -  CollectionCore.limit) + " - " + CollectionCore.offset;
        CollectionCore.offset -=  CollectionCore.limit;
        loadCollections();
    }
}