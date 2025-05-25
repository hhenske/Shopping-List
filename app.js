DocumentFragment.getElementById('toggle-saved-lists').addEventListener('click', (e) => {
    e.preventDefault();
    const listDiv = document.getElementById('saved-lists');
    listDiv.style.display=listDive.style.display === 'none' ? 'block' : 'none';
});



async function saveListToSupabase(userID, listItems) {
    const titleInput = document.getElementById("list-title")
    const title = titleInput.value.trim();

    if (!title) {
        alert("List title is required.");
        return;
    }

    const { data, error } = await supabase
        .from('grocery_lists')
        .insert([
            { 
                user_id: userID, 
                title: title,
                items: JSON.stringify(listItems) 
            }
        ]);

    if (error) {
        console.error("Insert error:", error);
        alert("Failed to save list");
    } else {
        console.log("Saved:", data);
        alert("List saved successfully!");
        document.getElementById('list-title').value = '';
        document.querySelectorAll('.store-items').forEach(store => {
            store.innerHTML = '';
        document.querySelectorAll('.store-total').forEach(total => {
            total.textContent = 'Total: $0.00';
        });
        });
    }
}

async function fetchListsForUser(userId) {
    const { data, error } = await supabase
        .from('grocery_lists')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error("Fetch error:", error);
        return [];
    }
    return data;
}

async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && Array.isArray(myListItems) && myListItems.length > 0) {
        saveListToSupabase(user.id, myListItems);
    }
}

function collectStoreLists() {
    const stores = ["store1", "store2", "store3"];
    const lists = {};

    stores.forEach(storeId => {
        const store = document.getElementById(storeId);
        const items = [];

        store.querySelectorAll(".item").forEach(item => {
            const name = item.querySelector("strong")?.textContent || "";
            const price = item.dataset.price || "";
            items.push({ name, price });
        });

        lists[storeId] = items;
    });

    return lists;
}

async function deleteListFromSupabase(listId) {
    const { data, error } = await supabase
        .from('grocery_lists')
        .delete()
        .eq('id', listId);

    if (error) {
        console.error("Delete error:", error);
        alert("Failed to delete list");
    } else {
        console.log("Deleted list:", data);
        alert("List deleted successfully!");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    (async () => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            alert("You must be logged in to add items.");
            return;
        }

        const mainContent = document.getElementById("main-content");
        const modal = document.getElementById("auth-modal");

        function showAuthModal() {
            modal.style.display = "block";
            mainContent.classList.add("blurred");
        }

        function hideAuthModal() {
            modal.style.display = "none";
            mainContent.classList.remove("blurred");
        }

        window.hideAuthModal = hideAuthModal;
        showAuthModal();

        let itemId = 0;
        let prices = [];
        const unsortedItems = [];

        function addItem() {
            console.log("addItem() triggered");

            const input = document.getElementById("item-input")
            let itemName = input.value.trim();

            if (!itemName) {
                console.log("Item name is empty");
                return;
            }

            itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);

            const priceA = (Math.random() * 10 + 1).toFixed(2);
            const priceB = (Math.random() * 10 + 1).toFixed(2);
            const priceC = (Math.random() * 10 + 1).toFixed(2);
            const prices = [priceA, priceB, priceC];

            let item = document.createElement("div");
            item.className = "item";
            item.dataset.prices = JSON.stringify(prices);
            item.draggable = true;
            item.id = `item-$itemID++`;
            item.ondragstart = drag;

            item.innerHTML = `
                <div class="item-content">
                    <strong>${itemName}</strong>
                    <div class="price-row">
                        <span>Store A: $${priceA}</span>
                        <span>Store B: $${priceB}</span>
                        <span>Store C: $${priceC}</span>
                    </div>
                </div>
            `;

            const trash = document.createElement("span");
            trash.className = "trash";
            trash.innerHTML = "🗑️";
            trash.title = "Remove item";
            trash.onclick = () => item.remove();

            item.appendChild(trash);

            document.getElementById("unsorted-list-items").appendChild(item);
            input.value = "";
        }

        document.getElementById("item-input").addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                addItem();
            }
        });

        function allowDrop(ev) {
            ev.preventDefault();
        }

        function drag(ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        }

        function drop(ev) {
            ev.preventDefault();
            const data = ev.dataTransfer.getData("text");
            let item = document.getElementById(data);
            item.classList.remove("dragging");

            const dropZone = ev.target.closest(".store, #unsorted-items");
            if (!dropZone) return;

            const itemsContainer = dropZone.querySelector(".store-items") || dropZone;
            itemsContainer.appendChild(item);

            if (dropZone.classList.contains("store")) {
                const storeId = dropZone.id;

                const priceRow = item.querySelector(".price-row");
                if (priceRow) priceRow.remove();

                const storeIndex = storeId === "store1" ? 0 : storeId === "store2" ? 1 : 2;
                const originalPrices = JSON.parse(item.dataset.prices || "[]");
                const chosenPrice = originalPrices[storeIndex];
                if (chosenPrice) item.dataset.price = chosenPrice;

                if (!item.querySelector(".trash")) {
                    const trash = document.createElement("span");
                    trash.className = "trash";
                    trash.innerHTML = "🗑️";
                    trash.title = "Remove item";
                    trash.onclick = () => {
                        item.remove();
                        updateStoreTotal(storeId);
                    };
                    item.appendChild(trash);
                }

                updateStoreTotal(storeId);
            }
        }

        document.getElementById("add-button").addEventListener("click", addItem);

        const stores = document.querySelectorAll(".store");
        stores.forEach(store => {
            store.addEventListener("dragover", allowDrop);
            store.addEventListener("drop", drop);
        });

        function updateStoreTotal(storeId) {
            const store = document.getElementById(storeId);
            const items = store.querySelectorAll(".item");
            let total = 0;

            items.forEach(item => {
                const priceMatch = item.dataset.price;
                if (priceMatch) {
                    total += parseFloat(priceMatch);
                }
            });

            const totalDisplay = document.getElementById(`total-${storeId}`);
            totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
        }

        document.getElementById("save-button").addEventListener("click", async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("You must be logged in to save lists.");
                return;
            }

            const storeLists = collectStoreLists();
            await saveListToSupabase(user.id, storeLists);
        });
    })();
});
