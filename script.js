document.addEventListener('DOMContentLoaded' , () => {
    const cards = document.querySelectorAll('.card')
    let disableDeck = false;
    let matchedCard = 0
    let startGame = true
    
    function timeCountDown() {
        let timeleft = 60
        startGame = false
        const countDownEle = document.getElementById('time-count')
        const timer = setInterval(() => {
            timeleft--
            console.log(timeleft)
            countDownEle.textContent = timeleft
            if (timeleft == 50) {
                clearInterval(timer);
                alert("Time out, you lose!");
                startGame = true;
                countDownEle.textContent = 60;

                cards.forEach(card => {
                    card.removeEventListener('click', flipCard);
                    card.classList.remove('flip')
                });

                 setTimeout(() => {
                    shuffleCard();
                }, 1000);
            }
        },1000)
    }
    

    
    let cardOne , cardTwo
    function flipCard(e) {
        if(startGame) {
            timeCountDown()
        }
        
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
            console.log('match')
            cardOne.removeEventListener('click' , flipCard)
            cardTwo.removeEventListener('click' , flipCard)
            cardOne = cardTwo = ""
            return disableDeck = false
        }
       
        setTimeout(() => {
            if (cardOne && cardTwo) {
                cardOne.classList.add('shake')
                cardTwo.classList.add('shake')
            }
        }, 400)

        setTimeout(() => {
            if (cardOne && cardTwo) {
                cardOne.classList.remove('shake' , 'flip')
                cardTwo.classList.remove('shake' , 'flip')
            }
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
        arr.sort(() => Math.random() > 0.5 ? 1 : -1)
        cards.forEach((card,index) => {
            card.classList.remove('flip')
            let imgTag = card.querySelector('img');
            imgTag.src = `images_hero/pic${arr[index]}.jpg`
            card.addEventListener('click' , flipCard)
        })
    }
    
    shuffleCard()
})