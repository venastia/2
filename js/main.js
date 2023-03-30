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

  function display(index) {
    switch (index) {
      case 0:
        start.style['display'] = 'flex'
        digging.style['display'] = 'none'
        building.style['display'] = 'none'
        break
      case 1:
        start.style['display'] = 'none'
        digging.style['display'] = 'flex'
        building.style['display'] = 'none'
        break
      case 2:
        start.style['display'] = 'none'
        digging.style['display'] = 'none'
        building.style['display'] = 'flex'
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
  let canvas = document.getElementById("buildGame");
  addEventListener("resize", () => {
    canvas.width = innerWidth;    // resize canvas
    canvas.height = innerHeight;
  })
  canvas.width = innerWidth;    // resize canvas
  canvas.height = innerHeight;
  let context = canvas.getContext("2d");
  let scrollCounter, cameraY, current, mode, xSpeed;
  let ySpeed = 5;
  let height = 50;
  let boxes = [];
  let figure = ["../assets/fugure_1.svg", "../assets/fugure_2.svg", "../assets/fugure_3.svg", "../assets/fugure_4.svg", "../assets/fugure_5.svg"]
  function getImage(url) {
    const image = new Image(url)
    image.src = url
    return image;
  }
  boxes[0] = {
    x: (canvas.width - 150) / 2,
    y: 300,
    width: 150,
    image: getImage(figure[0])
  };
  function newBox() {
    const img = new Image()
    img.src = figure[Math.floor(Math.random() * figure.length)]
    // 32 строчка пустой Instanse класса img, если говорить простыми слова мы создаем тег img
    // 33 строчка, мы присваем нашему классу, то есть тегу img - src, если смотреть как это выглядит в html то <img src="../assets/fugure_2.svg" />
    // const cord = {
    //     y: (current + 10) * height >= canvas.height ? canvas.height - height : (current + 10) * height
    // }
    boxes[current] = {
      x: 50,
      y: (current + 10) * height, // Мы удерживаем наши фигуры на одной высоте когда канвас уходит вниз (за это отвечает cameraY),
      width: 150,
      image: img
    };
  }
  function gameOver() {
    mode = 'gameOver';
    let background = new Image();
    background.src = ("../assets/game_over.svg")
    // onload не дает выполнить код пока с переменной прозводятся какие-либо манипуляции, в нашем случае это объявление пустой Instanse класса img присвоение src
    background.onload = function () {
      context.drawImage(background, 0, 0, canvas.width, canvas.height);
    }
  }

  function animate() {
    if (mode != 'gameOver') {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = 'bold 50px sans-serif';
      context.save()
      context.translate(20, canvas.height / 3); // Перемещение по оси X, Y
      context.rotate(4.7); // Вращаем наш канвас, пока текст не будет в нужной для нас позиции
      context.fillText("YOUR SCORE: " + (current - 1), -250, 50) // Пишем текстом кол-во очков, -250 это координата X, 50 координа Y
      context.restore() // Рестор возобновляет выполнение канваса
      for (let n = 0; n < boxes.length; n++) {
        let box = boxes[n];
        context.drawImage(box.image, box.x, 600 - box.y + cameraY, box.width, height);
      }
      if (mode == 'bounce') {
        boxes[current].x = boxes[current].x + xSpeed; // Current у нас сейчас равен 1,
        // потому что мы задали это значение на строке 124, получается что запись boxes[current].x равна сейчас 0
        // но почему 0? Смотрим на строки с 35 по 40 в нашу функцию newBox которую мы вызываем при запуске нашего сайта в функции restart
        // Теперь мы должны изменить этот 0, мы пишем следующее boxes[current].x = boxes[current].x + xSpeed, где xSpeed равно 2 это мы написали в строке 125
        // Каждый раз когда наш цикл отработает (67 строка) то это выполнится и мы постоянно будем добавлять либо убавлять это значение
        if (xSpeed > 0 && boxes[current].x + boxes[current].width > canvas.width) // Проверка если скорость по оси x больше нуля
          // и х координа текущего бокса + ширина текущего боква больше чем ширина всего канваса то мы начинаем убавлять xSpeed на 1
          xSpeed = -xSpeed;
        if (xSpeed < 0 && boxes[current].x < 0) // Проверка если скорость по оси x меньше нуля
          // и х координа текущего бокса меньше нуля то мы начинаем прибавлять xSpeed на 1
          xSpeed = -xSpeed; // у нас в 72 строчке после выполнения условия в 73 строчке получается такая запись boxes[current].x = boxes[current].x - xSpeed;
        // а уже после выполнения 78 строчки, у нас получается такая запись boxes[current].x = boxes[current].x -- xSpeed;, а минус на минус у нас дает + следовательно получаем boxes[current].x = boxes[current].x + xSpeed
      }
      if (mode == 'fall') {
        boxes[current].y = boxes[current].y - ySpeed;
        if (boxes[current].y == boxes[current - 1].y + height) { //Если наш текущий бокс касается нашего предидущего бокса то у нас снова mod = 'bounce'
          mode = 'bounce';
          let difference = boxes[current].x - boxes[current - 1].x;
          if (Math.abs(difference) >= boxes[current].width) {
            gameOver();
          }
          if (xSpeed > 0) {
            xSpeed++;
          }
          current++;
          scrollCounter = height;
          newBox();
        }
      }
      if (scrollCounter) {
        cameraY++;
        scrollCounter--;
      }
      context.fillRect(0, canvas.height - 100, canvas.width, 100);
      context.fillStyle = '#fff';
      context.font = '14px sans-serif';
      context.fillText('vedeniapina nastia', 50, canvas.height - 50);

      context.fillText('CAVE architecture', canvas.width / 2 - 50, canvas.height - 50);

      context.fillText('try not to crush the', canvas.width - 150, canvas.height - 70);
      context.fillText('biulding and to reach', canvas.width - 150, canvas.height - 50);
      context.fillText('the best score', canvas.width - 150, canvas.height - 30);
      context.fillStyle = '#247E3E';
    }
    window.requestAnimationFrame(animate); // Заставляем наш браузер обновлять 24 раза в секунду (24 кадра в 1 секунде)
  }

  function restart() {
    mode = 'bounce';
    boxes = [boxes[0]] // Убираем все из массива наших фигур, оставляя только первый элемент (нулевой если быть точнее)
    cameraY = 0;
    scrollCounter = 0;
    xSpeed = 2;
    current = 1;
    newBox();
  }
  canvas.onpointerdown = function () {
    if (mode == 'bounce') {
      mode = 'fall';
    }
    else if (mode == 'gameOver') {
      display(0)
      restart();
    }
  }
  restart();
  animate();
})
