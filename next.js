let nextBtn = document.querySelector(".NextBtn");
let RangeGravityInputBtn = document.querySelector(".RangeGravityInput")


nextBtn.addEventListener("click",function () {
    localStorage.setItem("level",Number(level)+2);
    window.location.href = "main.html";
})


RangeGravityInputBtn.addEventListener("change",function(){
    gravity = RangeGravityInputBtn.value;
    localStorage.setItem("gravity",gravity);
})
