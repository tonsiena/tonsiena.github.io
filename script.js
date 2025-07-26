import { e3, o4, o7, q5, collections, tabs, fetchAccount, fetchNumbers, sliceAddress, display, cfetch } from './core.js';

var filtrableItems = [];
var isgridview = true;
var currentAddress = null;
var isAscending = true;

const Elements = {
    content: null,

    changeView: q5("#changeView"),
    inputSearch: q5(".search-input"),
    container: q5("#container"),
    buttonSearch: q5("#search-button"),
    Nav : {}
};

Elements.buttonSearch.onclick = async (e) => {
    var res = await fetchAccount(Elements.inputSearch.value.toLowerCase())
    if (res) setCurrentAddress(res.address);
}
Elements.inputSearch.oninput = () => {
    display(Elements.buttonSearch, Elements.inputSearch.value.trim() ? 'flex' : 'none');
    display(Elements.filt, Elements.inputSearch.value.trim() ? 'none' : 'flex');
}


document.addEventListener('keydown', async (event) => {
    if (event.ctrlKey && event.key === '/' && Elements.inputSearch.value.length != 0) {
        var res = await fetchAccount(Elements.inputSearch.value.toLowerCase)
        if (res) setCurrentAddress(res.address);
        event.preventDefault();
    }
});

const setCurrentAddress = (address) => {
    Elements.inputSearch.value = "";
    if (!address) return;
    currentAddress = address;
    loadCollections();
    display(Elements.buttonSearch, 'none');
    display(Elements.filt, 'flex');
}

var collectionsList = { address: [], names: [] }
                  
                    // createSpan("Name", data?.name, li);
                    // createSpan("Description", data?.description, li);
                    //           createSpan("Address", address, li);
                    // createSpan("Images", data?.image, li);
                    // //+ "<br><br>" + data.extra?._image_small + "<br><br>" + data.extra?._image_medium + "<br><br>" + data.extra?._image_big, li);
                    //  createSpan("External link", data.extra?.external_link, li);
                    // createSpan("External url", data.extra?.external_url, li);
                    // createSpan("Cover image", data.extra?.cover_image, li);
                    // createSpan("Uri", data.extra?.uri, li);
                    // createSpan("Marketplace", data.extra?.marketplace, li);

                    // data?.extra?.social_links?.forEach(element => {
                    //     createSpan("Social link", element, li);
                    // });
                    // content.append(li);
        // } else $("page", true).innerHTML += `<p class="empty-page">nothing was found</p>`

                // if (item.type === "nft_collections" && (!item.valid || !item.image)) {
                //     collectionsList.Archive.address.push(address)
                //     collectionsList.Archive.names.push(item.name)
                //     li.appendChild(o4("img", { width: 40, height: 40, className: "gridimg", onclick: () => { createModalWindow(address, item.name, item) }, src: "nopic.png" }));
                //     archive.append(li);
                //              console.log(item.extra)
                // }else if (item.type === "nft_collections" && item.valid) {
                //     collectionsList.Main.address.push(address)
                //     collectionsList.Main.names.push(item.name)
                //     li.appendChild(o4("img", { width: 80, height: 80, className: "gridimg", loading: "lazy", onclick: () => { createModalWindow(address, item.name, item) }, src: item.extra?._image_small}));
                //     content.append(li);
                //              console.log(item.extra)
                // }
                
    // .menu {
    //     display: flex;
    //     position: fixed;
    //     bottom: 30px;
    // }
                // li.appendChild(o4("span", { textContent: item.name, onclick: () => { createModalWindow(address, item.name, item) } }));
            


var CollectionCore = {
    offset: 0, limit: 300,
    load: async function () {
        return await cfetch(
            "https://toncenter.com/api/v3/nft/items?owner_address=" + currentAddress +
            "&limit=" + this.limit + "&offset=" + this.offset);
    },
        loadCollections: async function (collection, limit1, offset1) {
        return await cfetch(
            "https://toncenter.com/api/v3/nft/items?owner_address=" + currentAddress +
            "&limit=" + limit1 + "&offset=" + offset1 + "&collection_address=" + collection);
    }
};

async function loadCollections(prop) {
    var { nft_items: items, metadata: meta, address_book: book } = await CollectionCore.load();


             loadNavigationBar(items?.length >= 300) 
            loadFilterBar(items?.length >= 1)
if (items?.length) {
        
    console.log(items?.length >= 300)
      
        q5("#container").innerHTML = `<ul class="content"></ul>`;
        Elements.content = q5(".content"),
            collectionsList = { address: [], names: [] }
        filtrableItems = [];
        display(Elements.content, isgridview ? "grid" : "flex");
        items.forEach(({ address, content, collection, collection_address }) => {
            const li = o4("li", { classList: "border " + (isgridview ? "collections-grid-item" : "collections-item") });
            if (collection) {
                var metadata = meta[collection_address];
                var token_info = metadata.token_info[0];
                var isvalid = token_info.valid;

                if (collection.address && collection_address) {
                    if (!collectionsList.address.includes(collection.address)) {
                     //   if (isvalid) {
                            var icon = meta[collection_address].token_info[0].image;
                         //   if (icon) {
                                collectionsList.address.push(collection.address)
                                collectionsList.names.push(token_info.name)
                                li.appendChild(o4("img", { width: 100, height: 100, loading: "lazy", onclick: () => {  createModalWindow(collection_address, token_info.name) }, src: meta[collection_address].token_info[0].image }));
                                li.appendChild(o4("span", { textContent: token_info.name, onclick: () => {  createModalWindow(collection_address, token_info.name) }}));
                                Elements.content.appendChild(li);
                                filtrableItems.push({ element: li, name: token_info.name });
                           // }
                       // }
                    }
                }
            }
        });
    } else Elements.container.innerHTML = `<p class="empty-page">nothing was found</p>`
}




function sortItems() {
    isAscending = !isAscending;
    filtrableItems.sort((a, b) => isAscending ? a.name.length - b.name.length : b.name.length - a.name.length);

    Elements.content.innerHTML = '';
    filtrableItems.forEach(item => Elements.content.appendChild(item.element));
}


const loadNavigationBar = (remove) => {
    var nav = q5("#nav");
    if (!remove){
        if(nav) return nav.remove();
        return;
    }

    if(nav) return;
    const navDiv = o7("div", { className: "border", id: "nav" }, q5(".page.border"));

    Elements.Nav = {
        div: navDiv,
        prev: o7("button", {
            className: "crs-pointer",
            textContent: "prev",
            id: "nav-prev",
            onclick: () => {
                if (CollectionCore.offset >= CollectionCore.limit) {
                    CollectionCore.offset -= CollectionCore.limit;
                    Elements.Nav.current.textContent = `${CollectionCore.offset} - ${CollectionCore.offset + CollectionCore.limit}`;
                    loadCollections();
                }
            }
        }, navDiv),
          current: o7("button", { textContent: `0 - ${CollectionCore.limit}`, id: "nav-current" }, navDiv),
            next: o7("button", {
            className: "crs-pointer",
            textContent: "next",
            id: "nav-next",
            onclick: () => {
                CollectionCore.offset += CollectionCore.limit;
                Elements.Nav.current.textContent = `${CollectionCore.offset} - ${CollectionCore.offset + CollectionCore.limit}`;
                loadCollections();
            }
        }, navDiv)
    }
}


const createModalWindow = async (address, name) => {
    var page = q5(".page.border");
    var modal = o7("div", { classList: "page modal border" }, page);
    var modalHeader = o7("div", { classList: "modal-header" }, modal);
    var modalTitle = o7("p", { textContent: name}, modalHeader);
    var modalClose = o7("p", { textContent:"close", onclick: () => modal.remove()}, modalHeader);
     var modalContent = o7("ul", {classList:"content overflow modal-content" }, modal);
    var res = await CollectionCore.loadCollections(address, 1000, 0)
    console.log(res)
var { nft_items: items, metadata: meta, address_book: book }  = res;
// //  divContnent.innerHTML = '';
    filtrableItems = [];


    if (items?.length) {
        
        display(modalContent, isgridview ? "grid" : "flex");
        items.forEach(({ collection, address }) => {
                  var metadata = meta[address];
                var token_info = metadata.token_info[0];
                var isvalid = token_info.valid;
            const div = e3("div");
               var icon = meta[address].token_info[0].image;
                     
            div.className = isgridview ? "collections-grid-item" : "collections-item";
            div.appendChild(o4("img", { src: icon }));
            div.appendChild(o4("span", { textContent:  token_info.name }));
            modalContent.appendChild(div);
            // filtrableItems.push({ element: div, name: metadata.name });
        });
    }
}
// createModalWindow();
const loadFilterBar = (remove) => {
var filt =  q5(".filt");
    if (!remove){
    if (filt) return filt.remove();
    }
    if(filt) return;
    Elements.filt = o7("div", {
        className: "filt",
        innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" id="sort-list-button" width="20px" height="20px"
                    viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 13.125C12.3013 13.125 12.5733 13.3052 12.6907 13.5827C12.8081 13.8601 12.7482 14.1808 12.5384 14.3971L8.53844 18.5221C8.39719 18.6678 8.20293 18.75 8.00002 18.75C7.79711 18.75 7.60285 18.6678 7.46159 18.5221L3.46159 14.3971C3.25188 14.1808 3.19192 13.8601 3.30934 13.5827C3.42676 13.3052 3.69877 13.125 4.00002 13.125H7.25002V6C7.25002 5.58579 7.5858 5.25 8.00002 5.25C8.41423 5.25 8.75002 5.58579 8.75002 6V13.125H12Z"
                        fill="grey" />
                    <path
                        d="M20 10.875C20.3013 10.875 20.5733 10.6948 20.6907 10.4173C20.8081 10.1399 20.7482 9.81916 20.5384 9.60289L16.5384 5.47789C16.3972 5.33222 16.2029 5.25 16 5.25C15.7971 5.25 15.6029 5.33222 15.4616 5.47789L11.4616 9.60289C11.2519 9.81916 11.1919 10.1399 11.3093 10.4173C11.4268 10.6948 11.6988 10.875 12 10.875H15.25V18C15.25 18.4142 15.5858 18.75 16 18.75C16.4142 18.75 16.75 18.4142 16.75 18L16.75 10.875H20Z"
                        fill="grey" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" id="changeView" width="20px" height="15px"
                    viewBox="0 0 16 16" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M7 1H1V7H7V1ZM7 9H1V15H7V9ZM9 1H15V7H9V1ZM15 9H9V15H15V9Z" fill="grey" />
                </svg>`
    }, q5(".search-container.border"))

    q5("#changeView").onclick = () => {
        isgridview = !isgridview;
        Elements.content.style.cssText = isgridview
            ? "display: grid;"
            : "display: flex; flex-direction: column;";
        document.querySelectorAll(".collections-item, .collections-grid-item")
            .forEach(i => i.className = isgridview ? "collections-grid-item" : "collections-item");
    };

    Elements.sortList = q5("#sort-list-button")
    Elements.sortList.onclick = () => sortItems();
}