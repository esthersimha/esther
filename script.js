
/*
  Machine à sous avec animation de rouleaux.
  - Chaque tour coûte 1 crédit.
  - Trois symboles identiques : +5 crédits.
  - Deux symboles identiques : +2 crédits.
*/
(function () {
  const symbols = ["😍", "😂", "😊", "😘", "😎", "😁"];
  let credits = 10;

  const creditSpan = document.getElementById("credit-value");
  const reels = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3"),
  ];
  const messageDiv = document.getElementById("message");
  const spinBtn = document.getElementById("spin");
  const Misebtn = document.getElementById("Mise");
  const fail = new Audio('./sons/8-bit-video-game-fail-version-2-145478.mp3');
  const gagne = new Audio('./sons/11l-victory_trumpet-1749704469779-358762.mp3');
  const roulette = new Audio('./sons/slot-machine-payout-81725.mp3');
  const jackpot =new Audio('./sons/winning-218995.mp3');

  // Met à jour le compteur de crédits et l'état du bouton
  function updateCredits(amount) {
    credits += amount;
    creditSpan.textContent = credits;
    Misebtn.max = credits > 1 ? credits : 1;
    if (credits <= 0) {
      messageDiv.textContent = "Plus de crédits !";
      spinBtn.disabled = true;
      Misebtn.disabled = true;
    }
  }

  function evaluate(results,Mise) {
    const [a, b, c] = results;
      if (a === b && b === c) {
       const win = Mise*5;
      updateCredits(win);
       messageDiv.textContent = `Jackpot ! +${win} crédits`;
       jackpot.play();
    } else if (a === b || a === c || b === c) {
       const win = Mise*2;
      updateCredits(win);
       messageDiv.textContent = `Presque ! +${win} crédits`;
       gagne.play();
    } else {
      messageDiv.textContent = "Raté...";
      fail.play();
    }
  }

  // Lance l'animation puis s'arrête successivement pour chaque rouleau
  function spin() {
    const Mise =parseInt(Misebtn.value, 10);
    if(isNaN(Mise) || Mise <1 || Mise > credits){
      alert("La mise est incorrecte. Veuillez rentrer une mise correcte");
      return;
    }
    
 roulette.currentTime  = 0;
 roulette.play();

    updateCredits(-Mise); // coût du tour
    spinBtn.disabled = true; // empêche plusieurs clics
    messageDiv.textContent = "Bonne chance !";

    const stopTimes = [1000, 1500, 2000]; // temps (ms) avant arrêt de chaque rouleau
    const intervals = [];
    const results = new Array(reels.length);
    let stopped = 0;

    reels.forEach((reel, index) => {
      // Ajoute l'effet de flou
      reel.classList.add("spinning");

      // Change rapidement le symbole pour simuler la rotation
      intervals[index] = setInterval(() => {
        const randomSymb = symbols[Math.floor(Math.random() * symbols.length)];
        reel.textContent = randomSymb;
      }, 80);

      // Arrête le rouleau après stopTimes[index] millisecondes
      setTimeout(() => {
        clearInterval(intervals[index]);
        const finalSymb = symbols[Math.floor(Math.random() * symbols.length)];
        reel.textContent = finalSymb;
        reel.classList.remove("spinning");

        results[index] = finalSymb;
        stopped++;

        // Lorsque tous les rouleaux sont arrêtés, évalue le résultat et réactive le bouton
        if (stopped === reels.length) {
          evaluate(results,Mise);
          if (credits > 0) spinBtn.disabled = false;
        }
      }, stopTimes[index]);
    });
  }
   Misebtn.addEventListener("input",()=>{
    if(Misebtn.value>credits) Misebtn.value = credits;
     if(Misebtn.value<1) Misebtn.value =1;
     })
   
   spinBtn.addEventListener("click", spin);

   Misebtn.Max=credits;
})();

