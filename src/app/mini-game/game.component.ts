import { Component } from "@angular/core";
import { interval, Subscription } from "rxjs";

enum CellColor {
  Blue = "blue",
  Yellow = "yellow",
  Green = "green",
  Red = "red",
}
const MAX_SCORE = 10;

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent {
  gridSize = 10;
  grid: { color: CellColor }[] = Array.from(
    { length: this.gridSize * this.gridSize },
    () => ({ color: CellColor.Blue })
  );

  public playerScore = 0;
  public computerScore = 0;
  public timeLimit = 1000;
  public gameOver = false;
  public winner = "";
  private gameSubscription: Subscription | null = null;

  startGame() {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
    this.resetGrid();
    this.playerScore = 0;
    this.computerScore = 0;
    this.gameOver = false;

    this.gameSubscription = interval(this.timeLimit).subscribe(() => {
      this.highlightRandomCell();
    });
  }

  handleCellClick(index: number) {
    const cell = this.grid[index];
    if (cell.color === CellColor.Yellow) {
      cell.color = CellColor.Green;
      this.playerScore++;
      this.checkGameOver();
    }
  }

  getCellClass(index: number): string {
    return this.grid[index].color;
  }

  highlightRandomCell() {
    const randomIndex = Math.floor(Math.random() * this.grid.length);
    const cell = this.grid[randomIndex];
    cell.color = CellColor.Yellow;

    setTimeout(() => {
      if (cell.color === CellColor.Yellow) {
        cell.color = CellColor.Red;
        this.computerScore++;
        this.checkGameOver();
      }
    }, this.timeLimit);
  }

  resetGrid() {
    this.grid.forEach((cell) => (cell.color = CellColor.Blue));
  }

  checkGameOver() {
    if (this.playerScore >= MAX_SCORE || this.computerScore >= MAX_SCORE) {
      this.gameOver = true;
      this.winner = this.playerScore >= MAX_SCORE ? "Player" : "Computer";
      if (this.gameSubscription) {
        this.gameSubscription.unsubscribe();
      }
    }
  }

  resetGame() {
    this.resetGrid();
    this.playerScore = 0;
    this.computerScore = 0;
    this.gameOver = false;
    this.winner = "";
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }
}
