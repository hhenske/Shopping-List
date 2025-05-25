// savedLists.js
// savedLists.js

function renderSavedListHTML(list) {
    const template = document.getElementById("saved-list-template");
    const listClone = template.content.cloneNode(true);
    const listElement = listClone.querySelector(".saved-list");

    listElement.dataset.listId = list.id;
    listElement.querySelector(".saved-list-title").textContent = list.title;

    const storesContainer = listElement.querySelector(".saved-stores");

    ["store1", "store2", "store3"].forEach(storeKey => {
        const storeTemplate = document.getElementById("saved-store-template");
        const storeClone = storeTemplate.content.cloneNode(true);
        const storeElement = storeClone.querySelector(".saved-store");

        storeElement.querySelector(".store-name").textContent = 
            storeKey === "store1" ? "Store A" :
            storeKey === "store2" ? "Store B" : "Store C";

        const itemGrid = storeElement.querySelector(".saved-items-grid");

        (list[storeKey] || []).forEach(item => {
            const itemTemplate = document.getElementById("saved-item-template");
            const itemClone = itemTemplate.content.cloneNode(true);
            const itemElement = itemClone.querySelector(".saved-item");

            itemElement.querySelector(".item-text").textContent = item.name;

            itemElement.querySelector(".check-off").addEventListener("click", () => {
                itemElement.classList.toggle("checked-off");
            });

            itemElement.querySelector(".remove-item").addEventListener("click", () => {
                itemElement.remove();
            });

            itemGrid.appendChild(itemElement);
        });

        storesContainer.appendChild(storeElement);
    });

    listElement.querySelector(".delete-list").addEventListener("click", async () => {
        const confirmed = confirm("Are you sure you want to delete this list?");
        if (!confirmed) return;

        await deleteListFromSupabase(list.id);
        listElement.remove();
    });

    return listElement;
}

function attachSavedListHandlers(container) {
    // Optional: if you want more general handlers here later
}

// ✅ Make functions globally accessible
window.renderSavedListHTML = renderSavedListHTML;
window.attachSavedListHandlers = attachSavedListHandlers;
