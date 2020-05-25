function draw() {
    /** @type {HTMLCanvasElement} */
    var canvas = document.querySelector('#canvas');
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        var minRectWidth = 20;
        var timer;
        var isEatFood = false;
        var num = 0;

        // 矩形
        function Rect(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
        }
        Rect.prototype.rDraw = function () {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }


        // snake
        function Snake() {

            // 初始运动方向
            this.direction = 2;
            // 初始化蛇头
            this.head = new Rect(canvas.width / 2 , canvas.height / 2 ,
                minRectWidth, minRectWidth, 'orange');

            // 初始化蛇身
            this.body = new Array();
            var x = this.head.x - minRectWidth;
            var y = this.head.y;
            for (var i = 0; i < 3; i++) {
                var bodyRect = new Rect(x, y, minRectWidth, minRectWidth, 'red');
                this.body.push(bodyRect);
                x -= minRectWidth;
            }

        }

        // 绘制蛇
        Snake.prototype.sDraw = function () {

            // 绘制蛇头
            this.head.rDraw();

            // 绘制蛇身
            for (var i = 0; i < this.body.length; i++) {
                this.body[i].rDraw();
            }

        }



        // 让蛇动起来
        Snake.prototype.move = function () {

            // 身体加一
            var newRect = new Rect(this.head.x, this.head.y, this.head.width, this.head.height, 'red');
            this.body.splice(0, 0, newRect);

            // 身体减一  如果吃到了食物就不减
            if (isEatFood == false) {
                this.body.pop();
            } else {
                isEatFood = false;
            }

            // 方向控制
            switch (this.direction) {
                case 0: {
                    this.head.x -= this.head.width;
                    break;
                }
                case 1: {
                    this.head.y -= this.head.height;
                    break;
                }
                case 2: {
                    this.head.x += this.head.width;
                    break;
                }
                case 3: {
                    this.head.y += this.head.height;
                    break;
                }
            }

            //穿墙
            if (this.head.x > canvas.width) {
                this.head.x = 0;
            }
            if (this.head.y > canvas.height) {
                this.head.y = 0;
            }
            if (this.head.x < 0) {
                this.head.x = canvas.width;
            }
            if (this.head.y < 0) {
                this.head.y = canvas.height;
            }


            // 判断蛇头与蛇身是否重叠
            for (var i = 0; i < this.body.length; i++) {
                if (isRectHit(this.head, this.body[i])) {
                    clearInterval(timer);
                    timer = null;
                    alert('*** YOU DIED ***   你撞到自己了');
                }
            }

        }

        // 获取键盘事件
        document.onkeydown = function (event) {
            var event = event || window.event
            switch (event.keyCode) {
                case 37: {
                    snake.direction = 0;
                    break;
                }

                case 38: {
                    snake.direction = 1;
                    break;
                }

                case 39: {
                    snake.direction = 2;
                    break;
                }

                case 40: {
                    snake.direction = 3;
                    break;
                }
            }
        }


        // 投放食物
        function randForFood() {
            var isInSanke = true;
            while (isInSanke) {
                var x = getRandom(0, (canvas.width - minRectWidth) / minRectWidth) * minRectWidth;
                var y = getRandom(0, (canvas.height - minRectWidth) / minRectWidth) * minRectWidth;

                var foodRect = new Rect(x, y, minRectWidth, minRectWidth, 'blue');

                // food 是否与蛇头重叠
                if (isRectHit(snake.head, foodRect)) {
                    isInSanke = true;
                    continue;
                }
                isInSanke = false;

                // food 是否与蛇身重叠
                for (var i = 0; i < snake.body.length; i++) {
                    if (isRectHit(snake.body, foodRect)) {
                        isInSanke = true;
                        break;
                    }
                }
            }

            return foodRect;
        }

        // 获取随机数
        function getRandom(min, max) {
            return Math.round(Math.random() * (max - min) + min);
        }

        // 碰撞检测
        function isRectHit(rect1, rect2) {

            var minX1 = rect1.x;
            var minX2 = rect2.x;
            var minY1 = rect1.y;
            var minY2 = rect2.y;

            var maxX1 = rect1.x + rect1.width;
            var maxX2 = rect2.x + rect2.width;
            var maxY1 = rect1.y + rect1.height;
            var maxY2 = rect2.y + rect2.height;


            var minX = Math.max(minX1, minX2);
            var maxX = Math.min(maxX1, maxX2);
            var minY = Math.max(minY1, minY2);
            var maxY = Math.min(maxY1, maxY2);


            if (minX < maxX && minY < maxY) {
                return true;
            } else {
                return false;
            }
        }

        // 初始化
        var snake = new Snake();
        snake.sDraw();

        var food = randForFood();
        food.rDraw();


        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            food.rDraw();
            snake.sDraw();
            snake.move();
            var s = document.getElementById('score').innerHTML;
            if (isRectHit(snake.head, food)) {
                isEatFood = true;
                food = randForFood();
                num++;
                document.getElementById('score').innerHTML = num;
            }

        }
        timer = setInterval(animate, 120);


    }
}