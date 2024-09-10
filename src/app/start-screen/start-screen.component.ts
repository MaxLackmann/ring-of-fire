import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Game } from '../../models/game';


@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

  constructor(private firestore: Firestore, private router: Router) { // Inject Router

  }

    newGame() {
      let game = new Game();
      // Erstelle eine Referenz auf die Sammlung 'games'
  const gamesCollection = collection(this.firestore, 'games');

  // Füge ein neues Dokument zu dieser Sammlung hinzu
  addDoc(gamesCollection, game.toJson())
      .then((gameInfo) => {
        this.router.navigateByUrl('/game/' + gameInfo.id);
      })
      .catch((error) => {
        console.error('Fehler beim Hinzufügen des Dokuments: ', error);
      });
  }
}
