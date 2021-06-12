let btns = document.querySelectorAll(".buttons>*");
let gravityBtn = document.querySelectorAll(".gravity>*");
let startBtn = document.querySelector(".go");
let RangeLevelInputBtn = document.querySelector(".RangeLevelInput");
let RangeGravityInputBtn = document.querySelector(".RangeGravityInput")

let level = "medium";
let gravity = "0";

for (let i = 1; i < btns.length; i++) {
    btns[i].addEventListener("click",function () {
        level = btns[i].getAttribute("level");
    })    
}

for (let i = 1; i < gravityBtn.length; i++) {
    gravityBtn[i].addEventListener("click",function () {
        gravity = gravityBtn[i].getAttribute("grav");
    })
}

startBtn.addEventListener("click",function () {
    localStorage.setItem("level",level);
    localStorage.setItem("gravity",gravity);
    window.location.href = "main.html";
})

RangeLevelInputBtn.addEventListener("change",function(){
    level = RangeLevelInputBtn.value;
})

RangeGravityInputBtn.addEventListener("change",function(){
    gravity = RangeGravityInputBtn.value;
})