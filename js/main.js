window.addEventListener('load', () => {
  let clicked = 0
  let overlayTo = 0
  let body = document.querySelector('body')
  let diggingButton = document.querySelector('body > div.start > div.l')
  let buildingButton = document.querySelector('body > div.start > div.r')
  let overlayText = document.querySelector('.overlay p')
  let rows = document.querySelectorAll('div.row')
  let overlay = document.querySelector('.overlay')
  let start = document.querySelector('.start')
  let digging = document.querySelector('.digging')
  let building = document.querySelector('.building')
  let gameover = document.querySelector('.gameover')
  let score = document.querySelector('.score')
  let canvas = document.getElementById("buildGame");
  let home = document.querySelector('.home')

  diggingButton.addEventListener('click', () => {
    display(1)
  })
  buildingButton.addEventListener('click', () => {
    display(2)
  })
  overlay.addEventListener('click', () => {
    display(overlayTo)
    makeOverlay(false)
  })
  gameover.addEventListener('click', () => {
    restart();
    gameover.style['display'] = 'none';
  })
  home.addEventListener('click', () => {
    display(0)
  })

  function display(index) {
    switch (index) {
      case 0:
        start.style['display'] = 'flex'
        digging.style['display'] = 'none'
        building.style['display'] = 'none'
        home.style['display'] = 'none'
        break
      case 1:
        start.style['display'] = 'none'
        digging.style['display'] = 'flex'
        building.style['display'] = 'none'
        home.style['display'] = 'initial'
        break
      case 2:
        start.style['display'] = 'none'
        digging.style['display'] = 'none'
        building.style['display'] = 'flex'
        home.style['display'] = 'initial'
        break
    }
  }
  if(display(0)){
    building.style['display'] = 'none'
  }
  function makeOverlay(shown, text = '', to = 0) {
    overlay.style['display'] = shown ? 'initial' : 'none'
    body.style['background-color'] = shown ? '#247E3E' : '#E6E6E6'
    overlayText.innerText = text;
    overlayTo = to
  }

  // display(1)

  for (let i = rows.length - 1; i >= 0; i--) {
    rows[i].addEventListener('click', () => {
      let row = rows[i]
      if (row.style['opacity'] != '0') {
        clicked++
      }
      if (clicked >= 6) {
        makeOverlay(true, 'go build', 2)
      }
      row.style['opacity'] = '0%'
    })
  }

  addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  })
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  let context = canvas.getContext("2d");
  let scrollCounter, cameraY, current, mode, xSpeed;
  let ySpeed = 10;
  let height = 200;
  let boxes = [];
  let figure = ["images/fugure_1.svg", "images/fugure_2.svg", "images/fugure_3.svg", "images/fugure_4.svg", "images/fugure_5.svg"]
  function getImage(url) {
    const image = new Image(url)
    image.src = url
    return image;
  }
  boxes[0] = {
    x: (canvas.width - 120) / 2,
    y: 20,
    width: 231,
    image: getImage(figure[0])
  };
  function newBox() {
    const img = new Image()
    img.src = figure[Math.floor(Math.random() * figure.length)] // = <img src="../assets/fugure_2.svg" /> в css
    boxes[current] = {
      x: 270,
      y: (current + 1) * height, //удержание фигур на одной высоте когда канвас уходит вниз (за это отвечает cameraY)
      width: 231,
      image: img
    };
  }
  function gameOver() {
    mode = 'gameOver';
    gameover.style['display'] = 'initial';
  }

  function animate() {
    if (mode != 'gameOver') {
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (let n = 0; n < boxes.length; n++) {
        let box = boxes[n];
        context.drawImage(box.image, box.x, 600 - box.y + cameraY, box.width, height);
      }
      if (mode == 'bounce') {
        if (xSpeed > 0 && boxes[current].x + boxes[current].width > canvas.width) // Проверка если скорость по оси x больше нуля
          // и х координата текущего бокса + ширина текущего бокса больше чем ширина всего канваса. Если да, то то начинается убавляться xSpeed
          xSpeed = -xSpeed;
        if (xSpeed < 0 && boxes[current].x < 0) // Проверка если скорость по оси x меньше нуля
          // и х координата текущего бокса меньше нуля, то мы начинаем прибавлять xSpeed
          xSpeed = -xSpeed;
      }
      if (mode == 'fall') {
        boxes[current].y = boxes[current].y - ySpeed;
        if (boxes[current].y == boxes[current - 1].y + height) { //Если текущий бокс касается предыдущего, то у снова mode = 'bounce'
          mode = 'bounce';
          let difference = boxes[current].x - boxes[current - 1].x;
          if (Math.abs(difference) >= boxes[current].width) {
            gameOver();
          }
          if (xSpeed > 0) {
            xSpeed += 2;
          }
          current++;
          scrollCounter = height;
          newBox();
          score.innerText = `YOUR SCORE: ${current - 1}`
        }
      }
      if (scrollCounter) {
        cameraY += 2;
        scrollCounter -= 2;
      }
      context.fillStyle = '#247E3E';
    }
    window.requestAnimationFrame(animate); // обновление браузера 24 раза в секунду (24 кадра в 1 секунде)
  }

  function restart() {
    mode = 'bounce';
    boxes = [boxes[0]] // убираю все из массива фигур, оставляя только первый элемент (нулевой)
    cameraY = 12;
    scrollCounter = 0;
    xSpeed = 10;
    current = 1;
    newBox();

  }
  canvas.onpointerdown = function () {
    if (mode == 'bounce') {
      mode = 'fall';
    }
  }
  restart();
  animate();
})
