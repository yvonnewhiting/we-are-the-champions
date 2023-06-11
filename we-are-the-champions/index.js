// javascript

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://we-are-the-champions-ab8bc-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings) //importing firebase
const database = getDatabase(app) //importing and setting up the correct database
const endorsementsInDB = ref(database, "endorsements") //selecting correct list from db

const inputFieldEl = document.getElementById("input-field")
const yourNameEL = document.getElementById("input-your-name")
const recipientEl = document.getElementById("input-reciever-name")
const publishBtn = document.getElementById("publish-btn")
const endorsementsListEl = document.getElementById("endorsements")

//event listener on publish, that push's the new endorsment to the db and clear's input field 
 publishBtn.addEventListener("click", function () {
     let inputValue = inputFieldEl.value 
     let recipientValue = recipientEl.value
     let yourNameValue = yourNameEL.value
     
     //append structure and create an object that includes all the input fields as one object to push to DB
     push(endorsementsInDB, {
         to:recipientValue,
         from: yourNameValue,
        endorsement:inputValue,
         likes:0, //Initialize likes to 0
     })
     
     clearInputFieldEl ()
 })

// retrieval of a endorsementslist from a database and updating the corresponding list element in the user interface

onValue(endorsementsInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearEndorsementsListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToEndorsementsListEl(currentItem)
            
            //The code then enters a for loop that iterates over each item in the itemsArray. In each iteration, it assigns the current item to the variable currentItem, extracts the item's ID and value, respectively, into currentItemID and currentItemValue variables.
        }    
    } else {
        endorsementsListEl.innerHTML = "No items here... yet"
    }
})

function clearEndorsementsListEl() {
    endorsementsListEl.innerHTML = ""
}
function clearInputFieldEl () {
    recipientEl.value = "";
    yourNameEL.value = "";
    inputFieldEl.value = "";
}


function appendItemToEndorsementsListEl(item) {
    let itemID = item[0];
    let itemData = item[1];
    let itemValue = itemData.endorsement;
    let itemTo = itemData.to;
    let itemFrom = itemData.from;
    let itemLikes = itemData.likes || 0; // Initialize likes to 0 if not present

    let newEl = document.createElement("li");

    newEl.innerHTML = `
        <div><strong>To:</strong> ${itemTo}, <strong>From:</strong> ${itemFrom}</div>
        <div>${itemValue}</div>
        <div class="likes-container">
            <span class="likes-count">${itemLikes}</span>
            <i class="fas fa-heart like-icon"></i>
        </div>
    `;

    let likeIcon = newEl.querySelector(".like-icon");
    let likesCount = newEl.querySelector(".likes-count");

    likeIcon.addEventListener("click", function() {
        itemLikes++; // Increment likes count
        likesCount.textContent = itemLikes; // Update likes count in the UI

        // Update the likes count in the database
        let exactLocationOfItemInDB = ref(database, `endorsements/${itemID}`);
        update(exactLocationOfItemInDB, {
            likes: itemLikes
        });
    });

    endorsementsListEl.appendChild(newEl); // Append the new endorsement to the list
}