console.log("=============================")

enum State {
    ALIVE,
    DEAD
}

class Cell {
    private state: State = State.DEAD
    private coordinateX: number
    private coordinateY: number

    private neighbors: number[][] = []

    constructor(x: number, y: number) {
        this.coordinateX = x
        this.coordinateY = y
        this.searchNeighbors()
    }

    setCellDies() {
        this.state = State.DEAD
    }

    setCellAlive() {
        this.state = State.ALIVE
    }

    getCellSate(): State {
        return this.state
    }

    //определяем координаты соседей
    private searchNeighbors() {
        let k: number = 0

        for (let i = this.coordinateX - 1; i <= this.coordinateX + 1; i++) {
            for (let j = this.coordinateY - 1; j <= this.coordinateY + 1; j++) {
                if (i == this.coordinateX && j == this.coordinateY) {
                    continue
                }
                this.neighbors[k][0] = i
                this.neighbors[k][1] = j
                k++
            }
        }
    }

    //возвращаем координаты соседей
    getNeightbors(): number[][] {
        return this.neighbors
    }

}

//Основной игровой мир
class PlayingWorld {
    private world: Cell[][] = []

    //предыдущее поколение
    private previosWorld: Cell[][]

    private readonly sizeX: number
    private readonly sizeY: number

    constructor(sizeX: number, sizeY: number) {
        this.sizeX = sizeX
        this.sizeY = sizeY
        this.init()
        this.repaint()
    }

    //init game
    private init() {
        this.world = new Array(this.sizeX);
        for (let i = 0; i < this.sizeX; i++) {
            this.world[i] = new Array(this.sizeY)
            for (let j = 0; j < this.sizeY; j++) {
                this.world[i][j] = new Cell(i, j)
                // устанавливаем случайное состояние клетки
                let num: number = Math.random()
                if (num % 2 == 0) {
                    this.world[i][j].setCellDies()
                } else {
                    this.world[i][j].setCellAlive()
                }

            }
        }
    }

    //копируем мир в предыдущий для последующего сравнения
    copyWorld() {
        for (let i = 0; i < sizeX; i++) {
            for (let j = 0; j < sizeY; j++) {
                this.previosWorld[i][j] = this.world[i][j];
            }
        }
    }

    //генерируем следующее поколение игрового мира
    nextWorldGeneration() {
        let liveNeighbors = 0;
        let cell: Cell;

        for (let i = 0; i < sizeX; i++) {
            for (let j = 0; j < sizeY; j++) {
                cell = this.previosWorld[i][j];

                liveNeighbors = this.getCountLiveNeighbors(i, j)

                if (cell.getCellSate() == State.DEAD) {
                    if (liveNeighbors == 3) {
                        this.world[i][j].setCellAlive()
                    }
                } else {
                    if (liveNeighbors < 2 || liveNeighbors > 3) {
                        this.world[i][j].setCellDies()
                    }
                }
            }
        }
    }

    //сравниваем миры теущий с предыдущим
    compareWorld(): boolean {
        for (let i = 0; i < sizeX; i++) {
            for (let j = 0; j < sizeY; j++) {
                if (this.previosWorld[i][j].getCellSate() != this.world[i][j].getCellSate()) {
                    return false;
                }
            }
        }

        return true
    }

    //определяем количество живых точек
    getLiveCount(): number {
        let count = 0
        for (let i = 0; i < sizeX; i++) {
            for (let j = 0; j < sizeY; j++) {
                if (this.world[i][j].getCellSate() == State.ALIVE) {
                    count++;
                }
            }
        }
        return count
    }

    //plaing game
    action() {

        let livePoints: number = -1
        let isOptimal: boolean = false

        do {
            this.repaint()
            this.copyWorld()
            this.nextWorldGeneration()

            isOptimal = this.compareWorld()
            livePoints = this.getLiveCount()

            if (isOptimal) {
                console.log("Optimal configuration searched")
            }

            if (livePoints == 0) {
                console.log("All points died")
            }

            setTimeout(() => {
                console.log('evolutio');
            }, pause);

        } while (livePoints != 0 && !isOptimal)

        console.log("Game ower")
    }

    // repaint game field
    private repaint() {

        for (let i = 0; i < this.sizeX; i++) {
            for (let j = 0; j < this.sizeY; j++) {
                console.log(this.world[i][j].getCellSate())
            }
            console.log("/n")
        }
    }

    // Количество живых соседей у клетки по координатам xy
    private getCountLiveNeighbors(x: number, y: number): number {
        let count: number = 0
        let nbs: number[][]

        nbs = this.world[x][y].getNeightbors()


        for (let i = 0; i < 8; i++) {
            x = nbs[i][0];
            y = nbs[i][1];

            if (x < 0 || y < 0) {
                continue;
            }
            if (x >= sizeX || y >= sizeY) {
                continue;
            }

            if (this.world[x][y].getCellSate() == State.ALIVE) {
                count++;
            }
        }

        return count;
    }

}

const sizeX = 2
const sizeY = 2
const pause = 1000; // Интервал времени между поколениями

let playingWorld: PlayingWorld = new PlayingWorld(sizeX, sizeY)
playingWorld.action()

