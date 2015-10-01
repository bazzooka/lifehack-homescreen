"use strict";

import Transform from './distort.js';
import TweenLite from '../lib/TweenLite/TweenLite.min.js';
import Events from './Events.js';
//https://dribbble.com/shots/2264986-Lifehack-homescrren
let allJSON = null,
  currentJoke = 0;

document.getElementById("likeIt").addEventListener(Events.touchStart, (e) => {
  e.preventDefault();
  likeIt();
  animLikeButton();
});

document.getElementById("card-wrapper").addEventListener(Events.touchStart, (e) => {
  passIt(e);
});

document.addEventListener("webkitAnimationEnd", (e) => {
  document.getElementsByClassName("card card-1")[0].remove();

  decalCard();
  addCard(allJSON[(currentJoke++)%100], 4);
});

var animLikeButton = () => {
  let likeButtonMask = document.getElementById("maskCircle"),
  params = {rayon: 0};
  TweenLite.to(params, 0.5, {
    rayon : 50,
    ease: Linear.easeNone,
    onUpdate: () => {
      likeButtonMask.setAttribute("r", params.rayon+"px");
    },
    onComplete: () => {
      setTimeout(()=>{
        likeButtonMask.setAttribute("r", "0px");  
      }, 500)
    }
  })
}

var passIt = (e) => {
  let target = e.target;
  if(target.classList.contains("corner-img")){
      document.getElementsByClassName('card-1')[0].classList.add("animate");
  }
}

var likeIt = () => {
  console.log("LikeIT");

  var element = document.getElementsByClassName("card card-1")[0],
    likeItButton = document.getElementById("likeIt"),
    top = element.offsetTop,
    left = element.offsetLeft,
    width = element.offsetWidth,
    height = element.offsetHeight,
    ww = window.innerWidth,
    upPos = {
      tl_x: 0,
      tl_y: 0,
      tr_x: 0,
      tr_y: 0,
      bl_x: 0,
      bl_y: 0,
      br_x: 0,
      br_y: 0,
      opacity: 100
    };


  TweenLite.to(upPos, 0.2, {
    tl_x: width / 5,
    tl_y: height / 3,
    tr_x: -width / 5,
    tr_y: height / 3 - 100,
    bl_x: width * 0.99,
    bl_y: height * 0.1,
    br_x: -width * 0.0,
    br_y: height * 0.1,

    ease: Linear.easeNone,

    onUpdate: () => {
      Distort.applyTransform(
        element,
        [
          [left, top], // Left Top
          [left, top + height], // Left Bottom
          [left + width, top], // Right Top
          [left + width, top + height] // Right Bottom
        ],
        [
          [left + upPos.tl_x, top + upPos.tl_y], // Left Top
          [left + upPos.bl_x, top + height + upPos.bl_y], // Left Bottom
          [left + width + upPos.tr_x, top + upPos.tr_y], // Right Top
          [left + width + upPos.br_x, top + height + upPos.br_y] // Right Bottom
        ],
        function() {
          console.log("Done", arguments);
        });

    //element.style.opacity = upPos.opacity/100;
    },
    onComplete: () => {
      console.log("Finished");
      var upPos2 = {
        tl_x: 0, //width*0.1,
        tl_y: 0,
        tr_x: 0, //-width*0.1,
        tr_y: 0,
        bl_x: 0,
        bl_y: 0,
        br_x: 0,
        br_y: 0,
        opacity: 100
      };


      TweenLite.to(upPos2, 0.2, {
        tl_x: width * 0.6,
        tl_y: height * 0.3,
        tr_x: 0,
        tr_y: height * 0.3,
        bl_x: 0,
        bl_y: 40,
        br_x: 0,
        br_y: 40,
        opacity: 0,

        ease: Linear.easeNone,

        onUpdate: () => {
          Distort.applyTransform(
            element,
            [
              [left, top], // Left Top
              [left, top + height], // Left Bottom
              [left + width, top], // Right Top
              [left + width, top + height] // Right Bottom
            ],
            [
              [left + upPos.tl_x + upPos2.tl_x, top + upPos.tl_y + upPos2.tl_y], // Left Top
              [left + upPos.bl_x + upPos2.bl_x, top + height + upPos.bl_y + upPos2.bl_y], // Left Bottom
              [left + width + upPos.tr_x + upPos2.tr_x, top + upPos.tr_y + upPos2.tr_y], // Right Top
              [left + width + upPos.br_x + upPos2.br_x, top + height + upPos.br_y + upPos2.br_y] // Right Bottom
            ],
            function() {
              console.log("Done", arguments);
            });

          element.style.opacity = upPos2.opacity / 100;
        },
        onComplete: () => {
          console.log("Finished");
          element.remove();

          decalCard();
            addCard(allJSON[(currentJoke++)%100], 4);



        }
      });

    }
  });
}

var getQuotations = (nb, callback) => {
  fetch('http://api.icndb.com/jokes/random/' + nb + '', {
    method: 'get',
    headers: {
      'Accept': 'application/json'
    }
  }).then(function(response) {
    return response.json().then(function(json) {
      callback && callback(json);
    });
  }).catch(function(err) {
    // Error :(
  });
}

var getTemplate = (json) => {
  console.log(json);
  var template = `
  	<div class="container">
  		<div class="card-content">
  			<div class="title">ICNDB <span> ${ json.id }</span></div>
        <div class="bottom-card">
    			<div class="joke"><span>${ json.joke }</span></div>
    			<div class="number"><span>N°${ json.id }</span></div>
        </div>
        <div class="corner">
          <img class="corner-img" src="assets/triangle.svg" alt=""/>
        </div>
  		</div>
	</div>`;
  return template;
};

var decalCard = () => {
  let secondCard = document.getElementsByClassName("card-2")[0],
    thirdCard = document.getElementsByClassName("card-3")[0],
    fourCard = document.getElementsByClassName("card-4")[0];

  secondCard.classList.add("card-1");
  secondCard.classList.remove("card-2");


  thirdCard.classList.add("card-2");
  thirdCard.classList.remove("card-3");

  fourCard.classList.add("card-3");
  fourCard.classList.remove("card-4");
}

var addCard = (json, index) => {
  let html = getTemplate(json);
  let insertIn = document.getElementById("card-wrapper"),
    card = document.createElement('div');
  card.classList.add('card');
  card.classList.add('card-' + (index));

  card.innerHTML = html;
  insertIn.insertBefore(card, insertIn.childNodes[0]);
}

var initCards = () => {
  for (var i = 1; i <= 4; i++) {
    addCard(allJSON[i], i);
  }
  currentJoke += 3;
}

var init = () => {
  getQuotations(100, (json) => {
    allJSON = json.value;
    initCards();
  });
};

init();

