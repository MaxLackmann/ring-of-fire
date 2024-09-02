import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game;

  constructor(public dialog: MatDialog) {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop() || '';
      this.pickCardAnimation = true;
      console.log('New Card:' + this.currentCard);
      console.log('Game is:', this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      // %  = Modulus-Operator zum errechnen des aktuellen Spielers 
      // Modulus ist immer der Restoperator und gibt einen ganzzahligen Rest aus

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
  
    dialogRef.afterClosed().subscribe((name : string) => {
      if(name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }



  //openDialog(): void {
  //  const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
  //    disableClose: false, // Verhindert das Schließen durch Klicken außerhalb
  //  });
//
  //  dialogRef.afterClosed().subscribe((name: string) => {
  //    if (name) {
  //      // Überprüfen, ob der Name nicht undefined oder leer ist
  //      this.game.players.push(name);
  //    }
  //  });
  //}
}
