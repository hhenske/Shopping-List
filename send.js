Array.from(document.getElementsByClassName('send-to-device')).forEach(button => {
    button.addEventListener('click', sendToDevice);
});

function sendToDevice() {
    const stores = document.querySelectorAll(".store");
    const storeData = [];

    stores.forEach(store => {
        const storeName = store.querySelector("h3").textContent.trim();
        const items = Array.from(store.querySelectorAll(".store-items .item")).map(item =>
            item.textContent.trim()
        );

        storeData.push({
            store: storeName,
            items: items
        });
    });

    const jsonString = JSON.stringify(storeData, null, 2);
    const textString = convertToPlainText(storeData);
    const blob = new Blob([jsonString], { type: "application/json" });
    const file = new File([blob], "shopping-list.json", { type: "application/json" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        // Share as file (best case)
        navigator.share({
            title: "Shopping List",
            text: "Here's your shopping list!",
            files: [file]
        }).catch(err => {
            console.error("File sharing failed:", err);
            fallbackTextShare(textString, blob);
        });
    } else {
        // Try sharing as text
        fallbackTextShare(textString, blob);
    }
}

function fallbackTextShare(text, blob) {
    if (navigator.share) {
        navigator.share({
            title: "Shopping List",
            text: text
        }).catch(err => {
            console.error("Text sharing failed:", err);
            fallbackDownload(blob);
        });
    } else {
        fallbackDownload(blob);
    }
}

function fallbackDownload(blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shopping-list.json";
    link.click();
    URL.revokeObjectURL(url);
}

// Convert list data to human-readable plain text
function convertToPlainText(data) {
    return data.map(store => {
        const items = store.items.map(item => `  - ${item}`).join("\n");
        return `${store.store}:\n${items}`;
    }).join("\n\n");
}


// Copy plain text to clipboard
function copyToClipboard() {
    const stores = document.querySelectorAll(".store");
    const storeData = [];

    stores.forEach(store => {
        const storeName = store.querySelector("h3").textContent.trim();
        const items = Array.from(store.querySelectorAll(".store-items .item")).map(item =>
            item.textContent.trim()
        );

        storeData.push({
            store: storeName,
            items: items
        });
    });

    const textString = convertToPlainText(storeData);

    navigator.clipboard.writeText(textString).then(() => {
        alert("Shopping list copied to clipboard!");
    }).catch(err => {
        console.error("Clipboard copy failed:", err);
        alert("Failed to copy to clipboard.");
    });
}
