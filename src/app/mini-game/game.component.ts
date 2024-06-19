import { Component } from "@angular/core";
import { interval, Subscription } from "rxjs";

interface Cell {
  color: string;
}

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent {
  gridSize = 10;
  grid: { color: string }[] = Array.from(
    { length: this.gridSize * this.gridSize },
    () => ({ color: "blue" })
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

    console.log(this.grid);
  }

  handleCellClick(index: number) {
    const cell = this.grid[index];
    if (cell.color === "yellow") {
      cell.color = "green";
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
    cell.color = "yellow";

    setTimeout(() => {
      if (cell.color === "yellow") {
        cell.color = "red";
        this.computerScore++;
        this.checkGameOver();
      }
    }, this.timeLimit);
  }

  //   resetHighlightedCell() {
  //     for (const row of this.grid) {
  //       for (const cell of row) {
  //         if (cell.color === "yellow") {
  //           cell.color = "blue";
  //         }
  //       }
  //     }
  //   }

  resetGrid() {
    this.grid.forEach((cell) => (cell.color = "blue"));
  }

  checkGameOver() {
    if (this.playerScore >= 10 || this.computerScore >= 10) {
      this.gameOver = true;
      this.winner = this.playerScore >= 10 ? "Игрок" : "Компьютер";
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
