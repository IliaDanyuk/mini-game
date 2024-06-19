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
  // public remainingTime = 0;
  public timerProgress = 100;
  public timeLimit = 1000;
  public gameOver = false;
  public modalIsOpen = false;
  public winner = "";
  private gameSubscription: Subscription | null = null;
  private timerSubscription: Subscription | null = null;

  startGame() {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
    this.resetGrid();
    this.playerScore = 0;
    this.computerScore = 0;
    this.gameOver = false;
    this.modalIsOpen = false;
    this.timerProgress = 100;

    this.gameSubscription = interval(this.timeLimit).subscribe(() => {
      this.highlightRandomCell();
    });
  }

  handleCellClick(index: number) {
    const cell = this.grid[index];
    if (cell.color === CellColor.Yellow) {
      cell.color = CellColor.Green;
      this.playerScore++;
      this.updateAvailableCells(index);
      this.checkGameOver();
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
    this.startTimer();
    // this.remainingTime = this.timeLimit;

    // const timer = interval(100).subscribe(() => {  // SIMPLE TIMER
    //   if (this.remainingTime > 0) {
    //     this.remainingTime -= 100;
    //   }
    // });

    setTimeout(() => {
      if (cell.color === CellColor.Yellow && !this.gameOver) {
        cell.color = CellColor.Red;
        this.computerScore++;
        this.updateAvailableCells(cellIndex);
        this.checkGameOver();
      }
      // timer.unsubscribe();
    }, this.timeLimit);
  }

  startTimer() {
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
      if (this.gameSubscription) {
        this.gameSubscription.unsubscribe();
      }
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
    }
  }

  closeModal() {
    this.modalIsOpen = false;
  }
}
