const page = document.location.href;

//if (page.match("cart")) {
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
/*} else {
  console.log("sur page confirmation");
}*/

// Fonction détermine les conditions d'affichage des produits du panier
//--------------------------------------------------------------
function affichagePanier(index) {
  // on récupère le panier converti
  let panier = JSON.parse(localStorage.getItem("panierStocke"));
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
  modifQuantite();
  suppression();
}

//Fonction d'affichage d'un panier (tableau)

function affiche(indexe) {
  // on déclare et on pointe la zone d'affichage
  let zonePanier = document.querySelector("#cart__items");
  // on créait les affichages des produits du panier via introduction de dataset dans le code
  zonePanier.innerHTML += indexe.map((produit) =>
    `<article class="cart__item" data-id="${produit._id}" data-couleur="${produit.couleur}" data-quantite="${produit.quantite}"> 
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
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produit.quantite}">
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

// fonction modifQuantite on modifie dynamiquement les quantités du panier
function modifQuantite() {
  const cart = document.querySelectorAll(".cart__item");

  cart.forEach((cart) => {
    cart.addEventListener("change", (eq) => {
      // vérification d'information de la valeur du clic et son positionnement dans les articles
      let panier = JSON.parse(localStorage.getItem("panierStocke"));
      // boucle pour modifier la quantité du produit du panier grace à la nouvelle valeur
      for (article of panier)
        if (
          article._id === cart.dataset.id &&
          cart.dataset.couleur === article.couleur
        ) {
          article.quantite = eq.target.value;
          localStorage.panierStocke = JSON.stringify(panier);
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
      let panier = JSON.parse(localStorage.getItem("panierStocke"));
      for (let d = 0, c = panier.length; d < c; d++)
        if (
          panier[d]._id === cartdelete.dataset.id &&
          panier[d].couleur === cartdelete.dataset.couleur
        ) {
          // variable pour la suppression
          const num = [d];
          // création d'un tableau miroir, voir mutation
          let nouveauPanier = JSON.parse(localStorage.getItem("panierStocke"));
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
          localStorage.panierStocke = JSON.stringify(nouveauPanier);
          totalProduit(); // logique mais pas obligatoire à cause du reload plus bas qui raffraichit l'affichage; serait necessaire avec suppression sans reload
          // on recharge la page qui s'affiche sans le produit grace au nouveau panier
          return location.reload();
        }
    });
  });
}

// fonction ajout nombre total produit et coût total
function totalProduit() {
  let panier = JSON.parse(localStorage.getItem("panierStocke"));
  // déclaration variable en tant que nombre
  let totalArticle = 0;

  let prixCombiné = 0;

  let totalPrix = 0;
  // calcule la somme/prix total
  for (let article of panier) {
    totalArticle += JSON.parse(article.quantite);
    prixCombiné = JSON.parse(article.quantite) * JSON.parse(article.prix);
    totalPrix += prixCombiné;
  }

  document.getElementById("totalQuantity").textContent = totalArticle;
  document.getElementById("totalPrice").textContent = totalPrix;
}


//  formulaire

// les données du client seront stockées dans ce tableau pour la commande sur page panier
//if (page.match("cart")) {
  var contactClient = {};
  localStorage.contactClient = JSON.stringify(contactClient);

  var prenom = document.querySelector("#firstName");
  prenom.classList.add("regex_texte");

  var nom = document.querySelector("#lastName");
  nom.classList.add("regex_texte");

  var ville = document.querySelector("#city");
  ville.classList.add("regex_texte");

  var adresse = document.querySelector("#address");
  adresse.classList.add("regex_adresse");

  var email = document.querySelector("#email");
  email.classList.add("regex_email");
  // on pointe les élément qui ont la classe .regex_texte
  var regexTexte = document.querySelectorAll(".regex_texte");
  // modification du type de l'input type email à text à cause d'un comportement de l'espace blanc non voulu vis à vis de la regex 
  document.querySelector("#email").setAttribute("type", "text");
//}

let regexLettre = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
// /^ début regex qui valide les caratères chiffre lettre et caratères spéciaux a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ aussi les espaces blancs et tiret \s- comprit entre 1 et 60 caratères (nombre de caractère maximum sur carte identité) {1,60} et on termine la regex $/i en indiquant que les éléments selectionnés ne sont pas sensible à la casse
let regexChiffreLettre = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,60}$/i;
let regValideEmail = /^[a-z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]{1,60}$/i;
let regMatchEmail = /^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i;

// Ecoute et attribution de point(pour sécurité du clic) si ces champs sont ok d'après la regex

//if (page.match("cart")) {
  regexTexte.forEach((regexTexte) =>
    regexTexte.addEventListener("input", (e) => {
      // valeur sera la valeur de l'input en dynamique
      valeur = e.target.value;
      // regNormal sera la valeur de la réponse regex, 0 ou -1
      let regNormal = valeur.search(regexLettre);
      if (regNormal === 0) {
        contactClient.firstName = prenom.value;
        contactClient.lastName = nom.value;
        contactClient.city = ville.value;
      }
      if (
        contactClient.city !== "" &&
        contactClient.lastName !== "" &&
        contactClient.firstName !== "" &&
        regNormal === 0
      ) {
        contactClient.regexNormal = 3;
      } else {
        contactClient.regexNormal = 0;
      }
      localStorage.contactClient = JSON.stringify(contactClient);
      couleurRegex(regNormal, valeur, regexTexte);
      valideClic();
    })
  );
//}

// le champ écouté via la regex regexLettre fera réagir, grâce à texteInfo, la zone concernée

texteInfo(regexLettre, "#firstNameErrorMsg", prenom);
texteInfo(regexLettre, "#lastNameErrorMsg", nom);
texteInfo(regexLettre, "#cityErrorMsg", ville);

// Ecoute et attribution de point(pour sécurité du clic) si ces champs sont ok d'après la regex

//if (page.match("cart")) {
  let regexAdresse = document.querySelector(".regex_adresse");
  regexAdresse.addEventListener("input", (e) => {
    // valeur sera la valeur de l'input en dynamique
    valeur = e.target.value;
    // regNormal sera la valeur de la réponse regex, 0 ou -1
    let regAdresse = valeur.search(regexChiffreLettre);
    if (regAdresse == 0) {
      contactClient.address = adresse.value;
    }
    if (contactClient.address !== "" && regAdresse === 0) {
      contactClient.regexAdresse = 1;
    } else {
      contactClient.regexAdresse = 0;
    }
    localStorage.contactClient = JSON.stringify(contactClient);
    couleurRegex(regAdresse, valeur, regexAdresse);
    valideClic();
  });
//}

// le champ écouté via la regex regexChiffreLettre fera réagir, grâce à texteInfo, la zone concernée

texteInfo(regexChiffreLettre, "#addressErrorMsg", adresse);

// Ecoute et attribution de point(pour sécurité du clic) si ce champ est ok d'après les regex

//if (page.match("cart")) {
  let regexEmail = document.querySelector(".regex_email");
  regexEmail.addEventListener("input", (e) => {
    // valeur sera la valeur de l'input en dynamique
    valeur = e.target.value;

    let regMatch = valeur.match(regMatchEmail);
    // quand le resultat sera correct, le console log affichera une autre réponse que null; regValide sera la valeur de la réponse regex, 0 ou -1
    let regValide = valeur.search(regValideEmail);
    if (regValide === 0 && regMatch !== null) {
      contactClient.email = email.value;
      contactClient.regexEmail = 1;
    } else {
      contactClient.regexEmail = 0;
    }
    localStorage.contactClient = JSON.stringify(contactClient);
    couleurRegex(regValide, valeur, regexEmail);
    valideClic();
  });
//}

// fonction d'affichage individuel des paragraphes sous input sauf pour l'input email

function texteInfo(regex, pointage, zoneEcoute) {
  if (page.match("cart")) {
    zoneEcoute.addEventListener("input", (e) => {
      // valeur sera la valeur de l'input en dynamique
      valeur = e.target.value;
      index = valeur.search(regex);
      // si valeur est toujours un string vide et la regex différante de 0 (regex à -1 et le champ est vide mais pas d'erreur)
      if (valeur === "" && index != 0) {
        document.querySelector(pointage).textContent = "Veuillez renseigner ce champ.";
        document.querySelector(pointage).style.color = "white";
        // si valeur n'est plus un string vide et la regex différante de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
      } else if (valeur !== "" && index != 0) {
        document.querySelector(pointage).innerHTML = "Reformulez cette donnée";
        document.querySelector(pointage).style.color = "white";
        // pour le reste des cas (quand la regex ne décèle aucune erreur et est à 0 peu importe le champ vu qu'il est validé par la regex)
      } else {

      }
    });
  }
}

//--------------------------------------------------------------
// Fonction de validation/d'accés au clic du bouton du formulaire
//--------------------------------------------------------------
let commande = document.querySelector("#order");
// la fonction sert à valider le clic de commande de manière interactive
function valideClic() {
  let contactRef = JSON.parse(localStorage.getItem("contactClient"));
  let somme =
    contactRef.regexNormal + contactRef.regexAdresse + contactRef.regexEmail;
  if (somme === 5) {
    commande.removeAttribute("disabled", "disabled");
    document.querySelector("#order").setAttribute("value", "Commander !");
  } else {
    commande.setAttribute("disabled", "disabled");
    document.querySelector("#order").setAttribute("value", "Remplir le formulaire");
  }
}
//----------------------------------------------------------------
// Envoi de la commande
//----------------------------------------------------------------
if (page.match("cart")) {
  commande.addEventListener("click", (e) => {
    // empeche de recharger la page on prévient le reload du bouton
    e.preventDefault();
    valideClic();
    envoiPaquet();
  });
}
//----------------------------------------------------------------
// fonction récupérations des id puis mis dans un tableau
//----------------------------------------------------------------
// définition du panier quine comportera que les id des produits choisi du local storage
let panierId = [];
function tableauId() {
// appel des ressources
let panier = JSON.parse(localStorage.getItem("panierStocké"));
// récupération des id produit dans panierId
if (panier && panier.length > 0) {
  for (let indice of panier) {
    panierId.push(indice._id);
  }
} else {
  console.log("le panier est vide");
  document.querySelector("#order").setAttribute("value", "Panier vide!");
}
}
//----------------------------------------------------------------
// fonction récupération des donnée client et panier avant transformation
//----------------------------------------------------------------
let contactRef;
let commandeFinale;
function paquet() {
  contactRef = JSON.parse(localStorage.getItem("contactClient"));
  // définition de l'objet commande
  commandeFinale = {
    contact: {
      firstName: contactRef.firstName,
      lastName: contactRef.lastName,
      address: contactRef.address,
      city: contactRef.city,
      email: contactRef.email,
    },
    products: panierId,
  };
}
//----------------------------------------------------------------
// fonction sur la validation de l'envoi
//----------------------------------------------------------------
function envoiPaquet() {
  tableauId();
  paquet();
  // vision sur le paquet que l'on veut envoyer
  console.log(commandeFinale);
  let somme = contactRef.regexNormal + contactRef.regexAdresse + contactRef.regexEmail;
  // si le panierId contient des articles et que le clic est autorisé
  if (panierId.length != 0 && somme === 5) {
    // envoi à la ressource api
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commandeFinale),
    })
      .then((res) => res.json())
      .then((data) => {
        // envoyé à la page confirmation, autre écriture de la valeur "./confirmation.html?commande=${data.orderId}"
        window.location.href = `/front/html/confirmation.html?commande=${data.orderId}`;
      })
      .catch(function (err) {
        console.log(err);
        alert("erreur");
      });
  }
}
