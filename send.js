Array.from(document.getElementByClassName('send-to-device')).forEach(button => {
    button.addEventListener('click', sendToDevice);
});

function sendToDevice() {
    const stores = document.querySelectorAll(".store");
    const storeData = [];

    stores.forEach(store => {
        const storeName = store.querySelector("h3").textContent.trim();
        const items = Array.from(store.querySelectorAll(".store-items .item")).map(item => item.textContent.trim());

        storeData.push({
            store: storeName,
            items: items
        });
    });

    const blob = new Blob([JSON.stringify(storeData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shopping-list.json";
    link.click();
    URL.revokeObjectURL(url);
}