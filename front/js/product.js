
// Récupération de l'id du produit via l' URL
const params = new URLSearchParams(document.location.search);
// la variable id va récupérer la valeur du paramètre _id
const id = params.get("_id");

// Récupération des produits de l'api et traitement des données (voir script.js)

fetch("http://localhost:3000/api/products/" + id)
  .then((res) => res.json())
  .then((objetProduit) => {

    affichageProduit(objetProduit);
  })
  .catch((err) => {
    document.querySelector(".item").innerHTML = "<h1>erreur 404</h1>";
    console.log("erreur 404, sur ressource api: " + err);
  });

// Création d'objet articleClient
let panierClient = {};
// id du procuit
panierClient._id = id;

// fonction d'affichage du produit de l'api

function affichageProduit(produit) {

  // déclaration des variables selector
  let imageAlt = document.querySelector("article div.item__img");
  let titre = document.querySelector("#title");
  let prix = document.querySelector("#price");
  let description = document.querySelector("#description");
  let couleurOption = document.querySelector("#colors");


  //ajout innerHTML
  imageAlt.innerHTML = `<img src="${produit.imageUrl}" alt="${produit.altTxt}">`;
  titre.textContent = produit.name;
  prix.textContent = produit.price;
  description.textContent = produit.description;

  // on ajoute le prix dans le panier 
  //panierClient.prix = produit.price;
  // boucle pour chercher les couleurs pour chaque produit 
  for (let couleur of produit.colors) {
    couleurOption.innerHTML += `<option value="${couleur}">${couleur}</option>`;
  }


}


let choixCouleur = document.querySelector("#colors");
// On écoute ce qu'il se passe dans #colors
choixCouleur.addEventListener("input", (ec) => {
  let couleurProduit;
  // on récupère la valeur de la cible de l'évenement dans couleur
  couleurProduit = ec.target.value;
  // on ajoute la couleur à l'objet panierClient
  panierClient.couleur = couleurProduit;

});

// choix quantité dynamique
let choixQuantite = document.querySelector('input[id="quantity"]');
let quantiteProduit;

// On écoute ce qu'il se passe dans input[name="itemQuantity"]
choixQuantite.addEventListener("input", (eq) => {
  // on récupère la valeur de la cible de l'évenement dans couleur
  quantiteProduit = eq.target.value;
  // on ajoute la quantité à l'objet panierClient
  panierClient.quantite = quantiteProduit;

});

let choixProduit = document.querySelector("#addToCart");
// On écoute ce qu'il se passe sur le bouton #addToCart pour faire l'action :
choixProduit.addEventListener("click", () => {
  //conditions de validation du bouton ajouter au panier
  if (
    // les valeurs sont créées dynamiquement au click, et à l'arrivée sur la page, tant qu'il n'y a pas d'action sur la couleur et/ou la quantité, c'est 2 valeurs sont undefined.
    panierClient.quantite < 1 ||
    panierClient.quantite > 100 ||
    panierClient.quantite === undefined ||
    panierClient.couleur === "" ||
    panierClient.couleur === undefined
  ) {

    alert("Pour valider le choix de cet article, veuillez renseigner une couleur, et/ou une quantité valide entre 1 et 100");

  } else {

    ajoutPanier();
    //redirection vers la page panier
    window.location.assign("cart.html")

  }
});

// initialiser le panier
let choixProduitClient = [];
// ce qu'on récupère du local storage appelé panierStocke
let produitsEnregistres = [];
// déclaration tableau qui sera un choix d'article/couleur non effectué donc non présent dans le panierStocke
let produitsTemporaires = [];
// déclaration tableau qui sera la concaténation des produitsEnregistres et de produitsTemporaires
let produitsAPousser = [];

// fonction ajoutPremierProduit qui ajoute l'article choisi dans le tableau vierge
//-------------------------------------------------------------------------

function ajoutPremierProduit() {
  console.log(produitsEnregistres);
  //si produitsEnregistres est null c'est qu'il n'a pas été créé
  if (produitsEnregistres === null) {
    // pousse le produit choisit dans choixProduitClient
    choixProduitClient.push(panierClient);
    console.log(panierClient);
    // dernière commande, envoit choixProduitClient dans le local storage sous le nom de panierStocke de manière JSON stringifié
    return (localStorage.panierStocke = JSON.stringify(choixProduitClient));
  }
}

// fonction ajoutAutreProduit qui ajoute l'article dans le tableau non vierge et fait un tri
//------------------------------------------------------------------------- 

function ajoutAutreProduit() {
  // vide/initialise produitsAPousser pour recevoir les nouvelles données
  produitsAdd = [];
  // pousse le produit choisit dans produitsTemporaires
  produitsTemporaires.push(panierClient);
  // combine produitsTemporaires et/dans produitsEnregistres, ça s'appele produitsAPousser
  // autre manière de faire: produitsAPousser = produitsEnregistres.concat(produitsTemporaires);
  produitsAdd = [...produitsEnregistres, ...produitsTemporaires];
  //fonction pour trier et classer les id et couleurs
  produitsAdd.sort(function triage(a, b) {
    if (a._id < b._id) return -1;
    if (a._id > b._id) return 1;
    if (a._id = b._id) {
      if (a.couleur < b.couleur) return -1;
      if (a.couleur > b.couleur) return 1;
    }
    return 0;
  });

  produitsTemporaires = [];
  // dernière commande, envoit produitsAPousser dans le local storage sous le nom de panierStocke de manière JSON stringifié
  return (localStorage.panierStocke = JSON.stringify(produitsAdd));
}

function ajoutPanier() {

  produitsEnregistres = JSON.parse(localStorage.getItem("panierStocke"));
  // si produitEnregistrés existe (si des articles ont déja été choisis et enregistrés par le client)
  if (produitsEnregistres) {
    for (let choix of produitsEnregistres) {
      //comparateur d'égalité des articles actuellement choisis et ceux déja choisis
      if (choix._id === id && choix.couleur === panierClient.couleur) {
        //information client
        alert("Ce produit figure déjà dans votre panier.");
        // on modifie la quantité d'un produit existant dans le panier du localstorage
        //définition de additionQuantite qui est la valeur de l'addition de l'ancienne quantité parsée et de la nouvelle parsée pour le même produit
        let additionQuantite = parseInt(choix.quantite) + parseInt(quantiteProduit);
        // on convertit en JSON le résultat précédent dans la zone voulue
        choix.quantite = JSON.stringify(additionQuantite);
        // dernière commande, on renvoit un nouveau panierStocke dans le localStorage
        return (localStorage.panierStocke = JSON.stringify(produitsEnregistres));
      }
    }
    // appel fonction 
    return ajoutAutreProduit();
  }
  // appel fonction ajoutPremierProduit si produitsEnregistres n'existe pas
  return ajoutPremierProduit();
}