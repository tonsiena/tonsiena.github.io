import { e3, o4, q5, collections, tabs, fetchAccount, fetchNumbers, sliceAddress, display} from './core.js';

var   filtrableItems = [];
var   tabsLoaded     = false;
var   isgridview     = true;
var   currentAddress = null;
const divContainer   = q5(".tabs");
const divContnent    = q5('.content');
const tabAddress     = q5("#tab-address");
const inputFilter    = q5("#search-filter");
const searchHeader   = q5(".search-header");
const inputSearch    = q5("#search-address");
const buttonGridView = q5("#grid-view-button");
const buttonSearch   = q5("#search-address-button");

buttonSearch.onclick = async (e) => {
        var res = await fetchAccount(inputSearch.value)
        if (res) setCurrentAddress(res.address);
}

inputSearch.oninput = () => display(buttonSearch, inputSearch.value.trim() ? 'flex' : 'none');

const loadTabs = () => {
 tabs.forEach(tab => {
    if (tab.section != undefined) {
        divContainer.appendChild(o4("div", { className: "section" }));
    } else divContainer.appendChild(
        o4("p", {
            className: "tab border",
            id: tab.id,
            innerHTML: tab.text,
            onclick: () => openModal(tab.id)
        })
    );
});
tabsLoaded = true;
}

function filterItems() {
    const searchValue = inputFilter.value.toLowerCase();
    divContnent.innerHTML = '';
    filtrableItems.forEach(item => {
        if (item.name.toLowerCase().includes(searchValue)) divContnent.appendChild(item.element);
    });
}

async function openModal(collection) {
    if (!currentAddress) {
        display(searchHeader, "none");
        return;
    }

    const collectionAddress = collections[collection.split("tab-")[1]];
    const { nft_items: items } = await fetchNumbers(currentAddress, collectionAddress);
    divContnent.innerHTML = '';
    filtrableItems = [];

    if (items?.length) {
        display(divContnent, isgridview ? "grid" : "flex");
        items.forEach(({ previews, metadata }) => {
            const div = e3("div");
            div.className = isgridview ? "collections-grid-item" : "collections-item";
            div.appendChild(o4("img", { src: previews[1].url }));
            div.appendChild(o4("span", { textContent: metadata.name }));
            divContnent.appendChild(div);
            filtrableItems.push({ element: div, name: metadata.name });
        });
        inputFilter.oninput = filterItems;
        display(searchHeader, "flex");
    }
}

buttonGridView.onclick = () => {
    isgridview = !isgridview;
    divContnent.style.cssText = isgridview
        ? "display: grid;"
        : "display: flex; flex-direction: column;";
    document.querySelectorAll(".collections-item, .collections-grid-item")
        .forEach(i => i.className = isgridview ? "collections-grid-item" : "collections-item");
    console.log(isgridview);
    buttonGridView.textContent = isgridview ?  "List" : "Grid"
};


document.addEventListener('keydown', async (event) => {
    if (event.ctrlKey && event.key === '/' && inputSearch.value.length != 0) {
        var res = await fetchAccount(inputSearch.value)
        if (res) setCurrentAddress(res.address);
        event.preventDefault();
    }
});

const setCurrentAddress = (address) => {
    inputSearch.value = "";
    divContnent.innerHTML = '';
    display(searchHeader, "none");
    display(buttonSearch, 'none');
    if(!address) return;
    currentAddress = address;
    tabAddress.textContent = sliceAddress(new TonWeb.Address(currentAddress).toString(true, true, false, false), 16);
    if(!tabsLoaded) loadTabs();
}

var isAscending = true;
q5("#sort-list-button").onclick = () => {
    isAscending = !isAscending; 
    sortItems(); 
};


function sortItems() {

    filtrableItems.sort((a, b) => 
        isAscending ? a.name.length - b.name.length : b.name.length - a.name.length
    );

    divContnent.innerHTML = '';
    filtrableItems.forEach(item => divContnent.appendChild(item.element));
}