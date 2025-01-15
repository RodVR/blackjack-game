let player = {
    name: "Player", 
    chips: 200 
}

let sum = 0 
let dealerSum = 0 
let hasBlackJack = false 
let isAlive = false 
let message = "" 

let messageEl = document.querySelector("#message-el") 
let sumEl = document.querySelector("#sum-el") 
let cardsEl = document.querySelector("#cards-el") 
let playerEl = document.querySelector("#player-el") 
let dealerEl = document.querySelector("#dealer-el") 
let dealerSumEl = document.querySelector("#dealer-sum-el") 
const dealerCards = document.querySelector("#dealer-cards-container") 

playerEl.textContent = player.name + ": $" + player.chips 
dealerEl.textContent = "Dealer Cards: " 

// URL to fetch a new deck of cards
const deckUrl = "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6"

// Buttons for game actions
const newCardBtn = document.querySelector("#newcard-btn") 
const startBtn = document.querySelector("#start-btn") 
const standBtn = document.querySelector("#stand-btn") 

let cardsContainer = document.querySelector("#cards-container") 

let deckId = ""

// Function to fetch and initialize a new deck of cards
async function getDeck() {
    const response = await fetch(deckUrl) // Fetch deck details from API
    const deckDetails = await response.json() // Parse response as JSON
    deckId = deckDetails.deck_id // Store the deck ID for future requests
}

// Call the function to initialize the deck
getDeck()

// Event listener for the start button
startBtn.onclick = async function () {

    newCardBtn.disabled = false // Enable the new card button
    standBtn.disabled = false // Enable the stand button

    isAlive = true 
    hasBlackJack = false 
    sum = 0 
    dealerSum = 0 

    // Fetch two cards for the player
    const cardUrl = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
    const response = await fetch(cardUrl) // Fetch cards from API
    const cards = await response.json() // Parse response as JSON
    const startingCards = cards.cards // Extract card details

    // Display the player's cards
    cardsContainer.innerHTML = `<img src="${startingCards[0].image}" alt="${startingCards[0].value} of ${startingCards[0].suit}"/>`
    cardsContainer.innerHTML += `<img src="${startingCards[1].image}" alt="${startingCards[1].value} of ${startingCards[1].suit}"/>`

    
    startingCards.forEach(card => {
        if (card.value === "QUEEN" || card.value === "KING" || card.value === "JACK" || card.value === "10") {
            sum += 10 
        } else if (card.value === "ACE" && (sum + 11) <= 21) {
            sum += 11 
        } else if (card.value === "ACE" && (sum + 11) > 21) {
            sum += 1 
        } else {
            // Convert string into int and add the numeric value of other cards
            sum += parseInt(card.value) 
        }
    })

    sumEl.textContent = `Player Sum: ${sum}` 

    const dealerCardUrl = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
    const dealerResponse = await fetch(dealerCardUrl) // Fetch dealer's card from API
    const dealerCard = await dealerResponse.json() // Parse response as JSON
    const dealerCardDetails = dealerCard.cards[0] // Extract card details

    dealerCards.innerHTML = `<img src="${dealerCardDetails.image}" alt="${dealerCardDetails.value} of ${dealerCardDetails.suit}"/>`

    if (dealerCardDetails.value === "QUEEN" || dealerCardDetails.value === "KING" || dealerCardDetails.value === "JACK" || dealerCardDetails.value === "10") {
        dealerSum += 10 
    } else if (dealerCardDetails.value === "ACE" && (dealerSum + 11) <= 21) {
        dealerSum += 11 
    } else if (dealerCardDetails.value === "ACE" && (dealerSum + 11) > 21) {
        dealerSum += 1 
    } else {
        dealerSum += parseInt(dealerCardDetails.value) 
    }

    dealerSumEl.textContent = `Dealer Sum: ${dealerSum}` 

    if (isAlive) {
        if (sum <= 20) {
            message = "Do you want to draw a new card?" 
        } else if (sum === 21) {
            message = "You've got Blackjack!" 
            hasBlackJack = true 
            newCardBtn.disabled = true 
        } else {
            message = "You're out of the game!" 
            isAlive = false 
        }
    }
    messageEl.textContent = message 
}

newCardBtn.onclick = async function () {
    const cardUrl = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
    const response = await fetch(cardUrl) // Fetch a new card for the player
    const card = await response.json() // Parse response as JSON
    const cardDetails = card.cards[0] // Extract card details

    cardsContainer.innerHTML += `<img src="${cardDetails.image}" alt="${cardDetails.value} of ${cardDetails.suit}"/>`

    if (cardDetails.value === "QUEEN" || cardDetails.value === "KING" || cardDetails.value === "JACK" || cardDetails.value === "10") {
        sum += 10 
    } else if (cardDetails.value === "ACE" && (sum + 11) <= 21) {
        sum += 11 
    } else if (cardDetails.value === "ACE" && (sum + 11) > 21) {
        sum += 1 
    } else {
        sum += parseInt(cardDetails.value) 
    }

    sumEl.textContent = `Player Sum: ${sum}` 

    if (isAlive === true) {
        if (sum > 21) {
            message = "You're out of the game!" 
            player.chips -= 20 
            isAlive = false
            newCardBtn.disabled = true 
            standBtn.disabled = true 
        } else if (sum === 21) {
            message = "You've got Blackjack!" 
            newCardBtn.disabled = true 
        } else {
            message = "Do you want to draw a new card?" 
        }
    }

    playerEl.textContent = player.name + ": $" + player.chips 
    messageEl.textContent = message 
}

standBtn.onclick = async () => {
    newCardBtn.disabled = true 
    standBtn.disabled = true 

    if (isAlive === true && hasBlackJack === false) {
        while (dealerSum < 17) {
            const dealerCardUrl = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
            const response = await fetch(dealerCardUrl) 
            const dealerCard = await response.json() 
            const dealerCardDetails = dealerCard.cards[0] 

            dealerCards.innerHTML += `<img src="${dealerCardDetails.image}" alt="${dealerCardDetails.value} of ${dealerCardDetails.suit}"/>`

            if (dealerCardDetails.value === "QUEEN" || dealerCardDetails.value === "KING" || dealerCardDetails.value === "JACK" || dealerCardDetails.value === "10") {
                dealerSum += 10
            } else if (dealerCardDetails.value === "ACE" && (dealerSum + 11) <= 21) {
                dealerSum += 11 
            } else if (dealerCardDetails.value === "ACE" && (dealerSum + 11) > 21) {
                dealerSum += 1 
            } else {
                dealerSum += parseInt(dealerCardDetails.value) 
            }

            dealerSumEl.textContent = `Dealer Sum: ${dealerSum}` 
        }

        if (dealerSum > 21 || sum > dealerSum) {
            message = "You've won!" 
            player.chips += 20 
        } else if (dealerSum === sum) {
            message = "It's a draw!" 
        } else {
            message = "You've lost!" 
            player.chips -= 20 
        }

        playerEl.textContent = player.name + ": $" + player.chips 
        isAlive = false 
        messageEl.textContent = message 
    }
}
