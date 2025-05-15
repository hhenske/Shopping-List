const supabaseURL = 'https://ojltmztuzqgfsgnpsidh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qbHRtenR1enFnZnNnbnBzaWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjIyMTIsImV4cCI6MjA2MjgzODIxMn0.vbYazcB_2vJJApl6qfyBcRJc7mRMY3ay32VvV7Nio0U';

const supabase = window.supabase.createClient(supabaseURL, supabaseKey)



async function saveListToSupabase(userID, listItems) {
    const { data, error } = await supabase
        .from('grocery_lists')
        .insert([
            { user_id: userID, items: JSON.stringify(listItems) }
        ]);
    if (error) {
        console.error("Insert error:", error);
        alert("Failed to save list");
    } else {
        console.log("Saved:", data);
        alert("List saved successfully!");
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
    if (user) {
        saveListToSupabase(user.id, myListItems);
    }
}

checkUser();


async function updateListInSupabase(listId, updatedItems) {
    const { data, error } = await supabase
        .from('grocery_lists')
        .update({ items: JSON.stringify(updatedItems) })
        .eq('id', listId);

    if (error) {
        console.error("Update error:", error);
        alert("Failed to update list.");
    } else {
        console.log("Updated list:", data);
        alert("List updated successfully!");
    }
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
    const mainContent = document.getElementById("main-content");
    const modal = document.getElementById("auth-modal");

    function showAuthModal() {
        const modal = document.getElementById("auth-modal");
        modal.style.display = "block";
        mainContent.classList.add("blurred");
    }
    
    function hideAuthModal() {
        const modal = document.getElementById("auth-modal");
        modal.style.display = "none";
        mainContent.classList.remove("blurred")
    }

    window.hideAuthModal = hideAuthModal;

    showAuthModal();

    let itemId = 0;


    function addItem() {
        const input = document.getElementById("item-input");
        const itemName = input.value.trim();
        if (!itemName) return;

        const priceA = (Math.random() * 10 + 1).toFixed(2);
        const priceB = (Math.random() * 10 + 1).toFixed(2);
        const priceC = (Math.random() * 10 + 1).toFixed(2);

        const item = document.createElement("div");
        item.className = "item";
        const prices = [priceA, priceB, priceC];
        item.dataset.prices = JSON.stringify(prices);
        item.draggable = true;
        item.id = `item-${itemId++}`;
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

        document.getElementById("unsorted-items").appendChild(item);
        input.value = "";
        }

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    function drop(ev) {
        ev.preventDefault();
        const data = ev.dataTransfer.getData("text");
        const item = document.getElementById(data);
        item.classList.remove("dragging");
    
        const dropZone = ev.target.closest(".store, #unsorted-items");
        if (!dropZone) return;
    
        const itemsContainer = dropZone.querySelector(".store-items") || dropZone;
        itemsContainer.appendChild(item);
    
        if (dropZone.classList.contains("store")) {
            const storeId = dropZone.id;
    
            // Remove price row
            const priceRow = item.querySelector(".price-row");
            if (priceRow) priceRow.remove();
    
            // Save selected price
            const storeIndex = storeId === "store1" ? 0 : storeId === "store2" ? 1 : 2;
            const originalPrices = JSON.parse(item.dataset.prices || "[]");
            const chosenPrice = originalPrices[storeIndex];
            if (chosenPrice) item.dataset.price = chosenPrice;
    
            // Add trash icon if not present
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

});

