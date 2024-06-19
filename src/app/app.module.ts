import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { GameComponent } from "./mini-game/game.component";

@NgModule({
  declarations: [GameComponent],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [GameComponent],
})
export class AppModule {}
