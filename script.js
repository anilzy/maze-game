const size = 5;
    const mazeEl = document.getElementById("maze");
    const messageEl = document.getElementById("message");

    let maze = [];
    let playerPos = { x: 0, y: 0 };
    const endPos = { x: size - 1, y: size - 1 };

    function generateMaze() {
      maze = Array.from({ length: size }, () => Array(size).fill(1));
      const visited = Array.from({ length: size }, () => Array(size).fill(false));

      function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      }

      function carve(x, y) {
        visited[y][x] = true;
        maze[y][x] = 0;
        shuffle([[1, 0], [-1, 0], [0, 1], [0, -1]]).forEach(([dx, dy]) => {
          const nx = x + dx * 2, ny = y + dy * 2;
          if (nx >= 0 && ny >= 0 && nx < size && ny < size && !visited[ny][nx]) {
            maze[y + dy][x + dx] = 0;
            carve(nx, ny);
          }
        });
      }

      carve(0, 0);
    }

    function drawMaze() {
      mazeEl.innerHTML = '';
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const cell = document.createElement("div");
          cell.classList.add("cell");
          if (maze[y][x] === 1) cell.classList.add("wall");
          if (x === 0 && y === 0) cell.classList.add("start");
          if (x === endPos.x && y === endPos.y) cell.classList.add("end");
          if (x === playerPos.x && y === playerPos.y) {
            cell.classList.add("player");
            cell.textContent = "🐱";
          }
          mazeEl.appendChild(cell);
        }
      }
    }

    function move(dir) {
      let { x, y } = playerPos;
      if (dir === "up") y--;
      if (dir === "down") y++;
      if (dir === "left") x--;
      if (dir === "right") x++;

      if (x >= 0 && y >= 0 && x < size && y < size && maze[y][x] === 0) {
        playerPos = { x, y };
        drawMaze();
        checkWin();
      }
    }

    function checkWin() {
      if (playerPos.x === endPos.x && playerPos.y === endPos.y) {
        messageEl.textContent = "🎉 You reached the end!";
      } else {
        messageEl.textContent = "";
      }
    }

    // Event listeners
    ["up", "down", "left", "right"].forEach(dir => {
      document.getElementById(dir).addEventListener("click", () => move(dir));
    });

    // Initial maze setup
    generateMaze();
    drawMaze();