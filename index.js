let player = {
    name: "Player",
    chips: 200
}


let cards = []
let sum = 0

let dealer = []
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

playerEl.textContent = player.name + ": $" + player.chips
dealerEl.textContent = "Dealer Cards: "

function getRandomCard() {
    let randomNum = Math.floor(Math.random() * 13) + 1
    if (randomNum > 10) {
        return 10
    } else if (randomNum === 1) {
        return 11
    } else {
        return randomNum
    }
}

const startGame = () => {
    let firstCard = getRandomCard()
    let secondCard = getRandomCard()

    cards = [firstCard, secondCard]
    sum = firstCard + secondCard

    dealer = []
    dealerSum = 0

    let dealerFirstCard = getRandomCard()
    dealer.push(dealerFirstCard)
    dealerSum = dealerFirstCard
    dealerEl.textContent = "Dealer Cards: " + dealerFirstCard
    dealerSumEl.textContent = "Dealer Sum: " + dealerSum

    

    isAlive = true
    hasBlackJack = false
    
    renderGame();

    if(sum === 21){
        message = "You've got Blackjack!"
        hasBlackJack = true
        isAlive = false
        player.chips += 20
        playerEl.textContent = player.name + ": $" + player.chips
    }

    if(player.chips <= 0){
        message = "You're out of chips!"
        isAlive = false
    }
}

const renderGame = () => {
    cardsEl.textContent = "Player Cards: "
    sumEl.textContent = "Player Sum: " + sum

    for (let i = 0; i < cards.length; i++) {
        cardsEl.textContent += cards[i] + " "
    }

    dealerEl.textContent = "Dealer Cards: "
    dealerSumEl.textContent = "Dealer Sum: " + dealerSum
    for (let i = 0; i < dealer.length; i++) {
        dealerEl.textContent += dealer[i] + " "
    }

    if(isAlive){
        if (sum <= 20) {
            message = "Do you want to draw a new card?"
        } else if (sum === 21) {
            message = "You've got Blackjack!"
            hasBlackJack = true
        } else {
            message = "You're out of the game!"
            isAlive = false
        }
    }
    messageEl.textContent = message
}


const newCard = () => {
    if (isAlive === true && hasBlackJack === false) {
        let card = getRandomCard()
        sum += card
        cards.push(card)
        console.log(cards);
        if(sum > 21){
            message = "You're out of the game!"
            player.chips -= 20
            isAlive = false
            playerEl.textContent = player.name + ": $" + player.chips
        }
        renderGame();
    }
}

    const stand = () => {
        if (isAlive === true && hasBlackJack === false) {
            while (dealerSum < 17) {
                let card = getRandomCard()
                dealerSum += card
                dealer.push(card)
            }
            if (dealerSum > 21) {
                message = "You win!"
                player.chips += 20
            } else if (dealerSum > sum) {
                message = "You lose!"
                player.chips -= 20
            } else if (dealerSum < sum) {
                message = "You win!"
                player.chips += 20
            } else {
                message = "It's a draw!"
            }
            isAlive = false
            renderGame()
            playerEl.textContent = player.name + ": $" + player.chips
        }
    }