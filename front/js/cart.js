
const page = document.location.href;

if (page.match("cart")) {
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((objetProduits) => {
      console.log(objetProduits);
      // appel de la fonction affichagePanier
      affichagePanier(objetProduits);
  })
  .catch((err) => {
      document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
      console.log("erreur 404, sur ressource api: " + err);
  });
} else {
  console.log("sur page confirmation");
}

// Fonction détermine les conditions d'affichage des produits du panier
//--------------------------------------------------------------
function affichagePanier(index) {
  // on récupère le panier converti
  let panier = JSON.parse(localStorage.getItem("panierStocké"));
  // si il y a un panier avec une taille differente de 0 (donc supérieure à 0)
  if (panier && panier.length != 0) {
    // zone de correspondance clef/valeur de l'api et du panier
    for (let choix of panier) {
      for (let i = 0, h = index.length; i < h; i++) {
        if (choix._id === index[i]._id) {
          // création de valeurs pour l'affichage
          choix.name = index[i].name;
          choix.prix = index[i].price;
          choix.image = index[i].imageUrl;
          choix.description = index[i].description;
          choix.alt = index[i].altTxt;
        }
      }
    }
    // créait l'affichage si les conditions sont présentes
    affiche(panier);
  } else {
    // si il n'y a pas de panier on créait un H1 informatif et quantité appropriées
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML =
      "Vous n'avez pas d'article dans votre panier";
  }
  modifQuantité();
  suppression();
}

//Fonction d'affichage d'un panier (tableau)

function affiche(indexé) {
  // on déclare et on pointe la zone d'affichage
  let zonePanier = document.querySelector("#cart__items");
  // on créait les affichages des produits du panier via introduction de dataset dans le code
  zonePanier.innerHTML += indexé.map((produit) => 
  `<article class="cart__item" data-id="${produit._id}" data-couleur="${produit.couleur}" data-quantité="${produit.quantité}"> 
    <div class="cart__item__img">
      <img src="${produit.image}" alt="${produit.alt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__titlePrice">
        <h2>${produit.name}</h2>
        <span>couleur : ${produit.couleur}</span>
        <p data-prix="${produit.prix}">${produit.prix} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produit.quantité}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem" data-id="${produit._id}" data-couleur="${produit.couleur}">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
    ).join(""); //on remplace les virgules de jonctions des objets du tableau par un vide
  // reste à l'écoute des modifications de quantité pour l'affichage et actualiser les données
  totalProduit();
}

// fonction modifQuantité on modifie dynamiquement les quantités du panier
function modifQuantité() {
  const cart = document.querySelectorAll(".cart__item");
  
  cart.forEach((cart) => {
    cart.addEventListener("change", (eq) => {
      // vérification d'information de la valeur du clic et son positionnement dans les articles
      let panier = JSON.parse(localStorage.getItem("panierStocké"));
      // boucle pour modifier la quantité du produit du panier grace à la nouvelle valeur
      for (article of panier)
        if (
          article._id === cart.dataset.id &&
          cart.dataset.couleur === article.couleur
        ) {
          article.quantité = eq.target.value;
          localStorage.panierStocké = JSON.stringify(panier);
          // actualiser les données
          totalProduit();
        }
    });
  });
}

function suppression() {
    
    const cartdelete = document.querySelectorAll(".cart__item .deleteItem");
    // pour chaque élément cartdelete
    cartdelete.forEach((cartdelete) => {
      cartdelete.addEventListener("click", () => {
        // appel de la ressource du local storage
        let panier = JSON.parse(localStorage.getItem("panierStocké"));
        for (let d = 0, c = panier.length; d < c; d++)
          if (
            panier[d]._id === cartdelete.dataset.id &&
            panier[d].couleur === cartdelete.dataset.couleur
          ) {
            // variable pour la suppression
            const num = [d];
            // création d'un tableau miroir, voir mutation
            let nouveauPanier = JSON.parse(localStorage.getItem("panierStocké"));
            //suppression de 1 élément à l'indice num
            nouveauPanier.splice(num, 1);
            //affichage informatif
            if (nouveauPanier && nouveauPanier.length == 0) {
              // si il n'y a pas de panier on créait un H1 informatif et quantité appropriées
              document.querySelector("#totalQuantity").innerHTML = "0";
              document.querySelector("#totalPrice").innerHTML = "0";
              document.querySelector("h1").innerHTML =
                "Vous n'avez pas d'article dans votre panier";
            }
            // on renvoit le nouveau panier converti dans le local storage et on joue la fonction
            localStorage.panierStocké = JSON.stringify(nouveauPanier);
            totalProduit(); // logique mais pas obligatoire à cause du reload plus bas qui raffraichit l'affichage; serait necessaire avec suppression sans reload
            // on recharge la page qui s'affiche sans le produit grace au nouveau panier
            return location.reload();
          }
      });
    });
  }

  // fonction ajout nombre total produit et coût total
function totalProduit() {
    let panier = JSON.parse(localStorage.getItem("panierStocké"));
    // déclaration variable en tant que nombre
    let totalArticle = 0;
    
    let prixCombiné = 0;
    
    let totalPrix = 0;
    // calcule la somme/prix total
    for (let article of panier) {
      totalArticle += JSON.parse(article.quantité);
      prixCombiné = JSON.parse(article.quantité) * JSON.parse(article.prix);
      totalPrix += prixCombiné;
    }
    
    document.getElementById("totalQuantity").textContent = totalArticle;
    document.getElementById("totalPrice").textContent = totalPrix;
  }