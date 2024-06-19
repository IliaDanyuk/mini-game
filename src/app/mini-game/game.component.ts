import { Component } from "@angular/core";
import { interval, Subscription } from "rxjs";

enum CellColor {
  Blue = "blue",
  Yellow = "yellow",
  Green = "green",
  Red = "red",
}
const MAX_SCORE = 10;
const GRID_SIZE = 10;

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent {
  grid: { color: CellColor }[] = Array.from(
    { length: GRID_SIZE * GRID_SIZE },
    () => ({ color: CellColor.Blue })
  );
  availableCells: number[] = Array.from(
    { length: GRID_SIZE * GRID_SIZE },
    (_, index) => index
  );

  public playerScore = 0;
  public computerScore = 0;
  public timerProgress = 100;
  public timeLimit = 1000;
  public gameOver = false;
  public modalIsOpen = false;
  public winner = "";
  public errorMessage = "";
  public gameOn = false;
  public hardMode = false;
  private timerSubscription: Subscription | null = null;
  private currentYellowCellIndex: number | null = null;

  startGame() {
    if (!this.timeLimit || this.timeLimit < 100) {
      this.errorMessage = "Please enter a valid response time (minimum 100 ms)";
      return;
    }

    this.errorMessage = "";
    this.gameOn = true;
    this.resetGame();
    this.highlightRandomCell();
  }

  handleCellClick(index: number) {
    const cell = this.grid[index];
    if (cell.color === CellColor.Yellow) {
      cell.color = CellColor.Green;
      this.playerScore++;
      this.updateAvailableCells(index);
      this.checkGameOver();
      if (!this.gameOver) {
        this.highlightRandomCell();
      }
    } else if (this.hardMode && this.currentYellowCellIndex !== null) {
      this.grid[this.currentYellowCellIndex].color = CellColor.Red;
      this.computerScore++;
      this.updateAvailableCells(this.currentYellowCellIndex);
      this.checkGameOver();
      if (!this.gameOver) {
        this.highlightRandomCell();
      }
    }
  }

  getCellClass(index: number): string {
    return this.grid[index].color;
  }

  highlightRandomCell() {
    if (this.availableCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.availableCells.length);
    const cellIndex = this.availableCells[randomIndex];
    const cell = this.grid[cellIndex];

    cell.color = CellColor.Yellow;
    this.currentYellowCellIndex = cellIndex;
    this.startTimer(cellIndex);
  }

  startTimer(cellIndex: number) {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerProgress = 100;
    const step = 100 / (this.timeLimit / 100);

    this.timerSubscription = interval(100).subscribe(() => {
      if (this.timerProgress > 0) {
        this.timerProgress -= step;
      } else {
        this.timerSubscription.unsubscribe();
      }
    });

    setTimeout(() => {
      if (this.grid[cellIndex].color === CellColor.Yellow && !this.gameOver) {
        this.grid[cellIndex].color = CellColor.Red;
        this.computerScore++;
        this.updateAvailableCells(cellIndex);
        this.checkGameOver();
        if (!this.gameOver) {
          this.highlightRandomCell();
        }
      }
    }, this.timeLimit);
  }

  resetGame() {
    this.resetGrid();
    this.playerScore = 0;
    this.computerScore = 0;
    this.gameOver = false;
    this.modalIsOpen = false;
    this.timerProgress = 100;
    this.currentYellowCellIndex = null;
  }

  resetGrid() {
    this.grid.forEach((cell) => (cell.color = CellColor.Blue));
    this.availableCells = Array.from(
      { length: GRID_SIZE * GRID_SIZE },
      (_, index) => index
    );
  }

  updateAvailableCells(index: number) {
    this.availableCells = this.availableCells.filter(
      (cellIndex) => cellIndex !== index
    );
  }

  checkGameOver() {
    if (this.playerScore >= MAX_SCORE || this.computerScore >= MAX_SCORE) {
      this.gameOver = true;
      this.modalIsOpen = true;
      this.winner = this.playerScore >= MAX_SCORE ? "Player" : "Computer";
      this.gameOn = false;
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
    }
  }

  closeModal() {
    this.modalIsOpen = false;
  }
}
