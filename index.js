import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://we-are-the-champions-84913-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements") 

const endorsementInputEl = document.getElementById("endorsement-input")
const fromInputEl = document.getElementById("from-input")
const toInputEl = document.getElementById("to-input")
const publishBtnEl = document.getElementById("publish-btn")
const endorsementsEl = document.getElementById("endorsements-el")

publishBtnEl.addEventListener(`click`, function() {
    if(endorsementInputEl.value && fromInputEl.value && toInputEl.value) {
        let endorsementMsg =  endorsementInputEl.value
        let fromName = fromInputEl.value
        let toName = toInputEl.value
        
        push(endorsementsInDB, {
            to: toName,
            message: endorsementMsg,
            from: fromName,
        })
        
        endorsementInputEl.value = ""
        fromInputEl.value = ""
        toInputEl.value = ""
        
    }
})

onValue(endorsementsInDB, function(snapshot) {
    if(snapshot.exists()) {
        let msgsArray = Object.entries(snapshot.val())
        clearEndorsementsEl()
        
        for(let i = 0; i < msgsArray.length; i++) {
            let currentMsg = msgsArray[i]
            let currentMsgValue = msgsArray[i][0]
            
            appendMsgToEndorsementsEl(currentMsg)           
        }
    } else {
        endorsementsEl.innerHTML = "<span id='empty'>" + "No endorsements here... yet" + "</span>"
    }
})

function clearEndorsementsEl() {
    endorsementsEl.innerHTML = ""
}

function appendMsgToEndorsementsEl(msg) {
    let msgID = msg[0]
    let msgTo = msg[1].to
    let msgMsg = msg[1].message
    let msgFrom = msg[1].from
    
    let newEl = document.createElement("div")
    newEl.id = "endorsement-item"
    newEl.innerHTML = `
            <h3>To ${msgTo}</h3>
            <p>${msgMsg}</p>
            <h3>From ${msgFrom}</h3>
        `
        
    newEl.addEventListener(`dblclick`, function() {
        let exactLocationOfMsgInDB = ref(database, `endorsements/${msgID}`)
        remove(exactLocationOfMsgInDB)
    })
    
    endorsementsEl.appendChild(newEl)
}