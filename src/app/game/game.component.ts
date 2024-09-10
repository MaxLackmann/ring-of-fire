import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  docData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

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
  game!: Game;
  gameId: string | undefined;
  games$!: Observable<Game[]>;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.game = new Game();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.gameId = params['gameId']; // Hole die gameId aus den Routenparametern
      if (this.gameId) {
        this.loadGame();
      }
    });
  }

  loadGame() {
    if (this.gameId) {
      const gameDocRef = doc(this.firestore, 'games', this.gameId);
      const gameData$ = docData(gameDocRef, { idField: 'id' }) as Observable<
        Game & { id: string }
      >;

      gameData$.subscribe((game: Game & { id: string }) => {
        if (game) {
          this.game = game;
            this.game.players = game.players;
            this.game.stack = game.stack;
            this.game.playedCards = game.playedCards;
            this.game.pickCardAnimation = game.pickCardAnimation;
            this.game.currentCard = game.currentCard;
          console.log('Game loaded:', this.game);
        } else {
          console.error('Game not found!');
        }
      });
    } else {
      console.error('Game ID is undefined.');
    }
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop() || '';
      this.game.pickCardAnimation = true;
      console.log('New card: ' + this.game.currentCard);
      console.log('Game is', this.game);
      this.game.currentPlayer++;
      this.game.currentPlayer %= this.game.players.length;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.cdr.detectChanges();
        this.updateGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.updateGame();
      }
    });
  }

  updateGame() {
    if (this.gameId) {
      const gameDocRef = doc(this.firestore, 'games', this.gameId);
      const gameData = {
        players: this.game.players,
        stack: this.game.stack,
        playedCards: this.game.playedCards,
        currentPlayer: this.game.currentPlayer,
      };
      const sanitizedData = JSON.parse(JSON.stringify(gameData));
      updateDoc(gameDocRef, sanitizedData)
        .then(() => {
          console.log('Game updated successfully');
        })
        .catch((error) => {
          console.error('Error updating game: ', error);
        });
    } else {
      console.error('gameID is undefined. Cannot update game.');
    }
  }
}
