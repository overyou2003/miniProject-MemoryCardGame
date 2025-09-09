document.addEventListener('DOMContentLoaded' , () => {
    const cards = document.querySelectorAll('.card')
    let disableDeck = false;
    let matchedCard = 0
    let startGame = true

    // SOUND EFFECTS
    const SFX = (() => {
  const files = {
    gameover:   'sounds/gameover.mp3',
    flip:    'sounds/flip.mp3',
    match:   'sounds/match.mp3',
    wrong:   'sounds/wrong.mp3',
    win:     'sounds/win.mp3',
    timeout: 'sounds/timeout.mp3',
  };
  const cache = {};
  let enabled = true;
  let volume = 0.2;

  for (const [k, url] of Object.entries(files)) {
    cache[k] = new Audio(url);
  }

  return {
    play(name) {
      if (!enabled || !cache[name]) return;
      const a = cache[name].cloneNode(true);
      a.volume = volume;
      a.play().catch(()=>{}); // กัน error autoplay
    },
    toggle(){ enabled = !enabled; return enabled; },
    setVolume(v){ volume = Math.min(1, Math.max(0, v)); }
  };
})();

// BGM ประกอบตอนเล่นเกม
const BGM = (() => {
  let audio = new Audio('sounds/music.mp3'); // เพลงหลัก
  audio.loop = true;      // วนลูป
  audio.volume = 0.02;    // ระดับเสียงเริ่มต้น
  let enabled = true;     // เปิด/ปิดเพลง
  let started = false;    // ยังไม่เริ่มจนกว่าจะมี user gesture

  const ensurePlay = () => audio.play().catch(()=>{ /* เงียบไว้ถ้า autoplay บล็อก */ });

  return {
    start(track) {        // เริ่มเล่น (เรียกตอนมีการคลิกครั้งแรก)
      if (track) audio.src = track;
      started = true;
      if (enabled) ensurePlay();
    },
    pause() { audio.pause(); },
    resume() { if (enabled && started) ensurePlay(); },
    stop() { audio.pause(); audio.currentTime = 0; },
    toggle() {            // ปิด/เปิดเพลง
      enabled = !enabled;
      if (!enabled) audio.pause(); else if (started) ensurePlay();
      return enabled;
    },
    setVolume(v) { audio.volume = Math.min(1, Math.max(0, v)); },
    setTrack(src) {       // ถ้าจะเปลี่ยนเพลงตามโหมด
      audio.src = src; audio.currentTime = 0;
      if (enabled && started) ensurePlay();
    },
    isEnabled() { return enabled; }
  };
})();

// เปลี่ยนแทบปิดเสีัยงเพลง
document.addEventListener('visibilitychange', () => {
  if (document.hidden) BGM.pause();
  else BGM.resume();
})
    // const buttons = document.querySelectorAll('.mode-select button');
    // buttons.forEach((btn , index) => {
    //     btn.addEventListener('click' , () => {
    //         // ลบ selected ออกจากปุ่มอื่น ๆ
    //         buttons.forEach(b=> b.classList.remove('selected'));
            
    //         // ใส่ selected ให้ปุ่มที่ถูกกด
    //         btn.classList.add('selected')
    //         // selected mode 
    //         if (index === 0) {
    //             console.log('this is easy one')
    //             modeEasy(8)
                
    //         } else if (index === 1) {
    //             console.log('this is normal one')
    //             modeNormal(10)
    //         } else {
    //             console.log('this is hard one')
    //             modeHard(12)
    //         }
    //     })
    // })


    let timer = null
    const countDownEle = document.getElementById('time-count')
    function timeCountDown() {
        let timeleft = 60
        startGame = false
        timer = setInterval(() => {
            timeleft--
            console.log(timeleft)
            if (timeleft == 5) {
                SFX.play('timeout')
            }
            countDownEle.textContent = timeleft
            if (timeleft == 0) {
                clearInterval(timer);
                SFX.play('gameover')
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
            BGM.start();
        }
        
        let clickedCard = e.target
        if(clickedCard !== cardOne && !disableDeck) {
            clickedCard.classList.add('flip')
            SFX.play('flip');
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
            const pointCountEle = document.getElementById('point-count')
            pointCountEle.textContent = matchedCard
            if (matchedCard === 8) {
                setTimeout(() => {
                    SFX.play('win')
                },1000)
                console.log('WIN')
                clearInterval(timer);
                countDownEle.textContent = 60;
                pointCountEle.textContent = 0;
                setTimeout(() => {
                    return shuffleCard();
                },3300)
            }
            console.log('match')
            setTimeout(() => {
                SFX.play('match')
            },500)
            cardOne.removeEventListener('click' , flipCard)
            cardTwo.removeEventListener('click' , flipCard)
            cardOne = cardTwo = ""
            return disableDeck = false
        }

        
        setTimeout(() => {
            if (cardOne && cardTwo) {
                SFX.play('wrong');
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
        console.log('play game')
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

    
    function modeEasy(pairs) {
        console.log('easy')
        // const cardsContainer = document.querySelector('.cards');
        // cardsContainer.innerHTML = ""; // ล้างเก่าออกก่อน

        // // สร้าง array ตัวเลขซ้ำตามจำนวน pairs
        // let arr = [];
        // for (let i = 1; i <= pairs; i++) arr.push(i, i);
        // arr.sort(() => Math.random() > 0.5 ? 1 : -1);

        // arr.forEach(num => {
        //     const li = document.createElement('li');
        //     li.className = "card";
        //     li.innerHTML = `
        //     <div class="view front-view">
        //         <span class="material-icons">question_mark</span>
        //     </div>
        //     <div class="view back-view">
        //         <img src="images_hero/pic${num}.jpg" alt="card-img">
        //     </div>`;
        //     cardsContainer.appendChild(li);
        // });
    }

    function modeNormal(pairs) {

    }

    function modeHard(pairs) {

    }
    
    shuffleCard()
})