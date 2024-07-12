import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, query, orderByChild, equalTo, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://realtime-database-f88f4-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);

if (!database) {
    console.error("Failed to initialize Firebase database.");
} else {
    const shoppingListRef = ref(database, "shoppingList");

    const inputFieldEl = document.getElementById("input-field");
    const addButtonEl = document.getElementById("add-button");
    const shoppingListEl = document.getElementById("shopping-list");

    addButtonEl.addEventListener("click", function() {
        let inputValue = inputFieldEl.value.trim().toLowerCase();
        if (inputValue === "") {
            alert("Please enter a valid item.");
            return;
        }
        addItemToShoppingList(inputValue);
    });

    function addItemToShoppingList(item) {
        if (!shoppingListRef) {
            console.error("Failed to initialize shopping list reference.");
            return;
        }
    
        // Check if the item already exists in the shopping list
        onValue(shoppingListRef, (snapshot) => {
            let itemExists = false;
            snapshot.forEach((childSnapshot) => {
                const childItem = childSnapshot.val().item;
                if (childItem === item) {
                    itemExists = true;
                }
            });
    
            if (!itemExists) {
                push(shoppingListRef, { item: item });
            } else {
                alert("Item already exists in the shopping list.");
            }
        }, (error) => {
            console.error("Error checking item existence:", error);
        });
    }
    

    function renderShoppingList(snapshot) {
        if (!snapshot) {
            console.error("Empty snapshot received.");
            return;
        }

        shoppingListEl.innerHTML = ""; 
        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val().item;
            shoppingListEl.innerHTML += `<li>${item}</li>`;
        });
    }

    onValue(shoppingListRef, renderShoppingList);
}
