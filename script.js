document.addEventListener('DOMContentLoaded' , () => {
    const cards = document.querySelectorAll('.card')
    let disableDeck = false;
    let matchedCard = 0
    cards.forEach(card => {
        card.addEventListener('click' , flipCard)
    })

    
    let cardOne , cardTwo
    function flipCard(e) {
        let clickedCard = e.target
        if(clickedCard !== cardOne && !disableDeck) {
            clickedCard.classList.add('flip')
            if(!cardOne) {
                return cardOne = clickedCard;
            }
            cardTwo = clickedCard
            disableDeck = true
            let cardOneImg = cardOne.querySelector("img").src
            let cardTwoImg = cardTwo.querySelector("img").src

            matchCards(cardOneImg , cardTwoImg)
        } 
    }

    function matchCards(img1 , img2) {
        if (img1 === img2) {
            matchedCard++
            console.log(matchedCard)
            if (matchedCard === 8) {
                setTimeout(() => {
                    return shuffleCard();
                },500)
            }
            console.log('hey')
            cardOne.removeEventListener('click' , flipCard)
            cardTwo.removeEventListener('click' , flipCard)
            cardOne = cardTwo = ""
            return disableDeck = false
        }
       
        setTimeout(() => {
            cardOne.classList.add('shake')
            cardTwo.classList.add('shake')
        }, 400)

        setTimeout(() => {
            cardOne.classList.remove('shake' , 'flip')
            cardTwo.classList.remove('shake' , 'flip')
            cardOne = cardTwo = ''
            disableDeck = false
        }, 1200)
    }

    function shuffleCard() {
        console.log('you finished')
        matchedCard = 0
        cardOne = cardTwo = ''
        disableDeck = false
        let arr = [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,]
        cards.forEach(card => {
            card.classList.remove('flip')
            card.addEventListener('click' , flipCard)
        })

        
    }
})