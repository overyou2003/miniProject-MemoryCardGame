document.addEventListener('DOMContentLoaded' , () => {
    const cards = document.querySelectorAll('.card')


    cards.forEach(card => {
    
        card.addEventListener('click' , flipCard)
    })

    
    let cardOne , cardTwo
    function flipCard(e) {
        let clickedCard = e.target
        if(clickedCard !== cardOne) {
            clickedCard.classList.add('flip')
            if(!cardOne) {
                return cardOne = clickedCard;
            }
            cardTwo = clickedCard
            let cardOneImg = cardOne.querySelector("img").src
            let cardTwoImg = cardTwo.querySelector("img").src

            matchCards(cardOneImg , cardTwoImg)
        } 
    }

    function matchCards(img1 , img2) {
        if (img1 === img2) {
            return console.log('card matched!')
        }
       
        cardOne.classList.add('shake')
        cardTwo.classList.add('shake')
    }
})