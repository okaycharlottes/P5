
// Récupération de l'id du produit via l' URL
const params = new URLSearchParams(document.location.search); 
// la variable id va récupérer la valeur du paramètre _id
const id = params.get("_id");
console.log(id); 

// Récupération des produits de l'api et traitement des données (voir script.js)

fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((objetProduits) => {

    lesProduits(objetProduits);
  })
  .catch((err) => {
    document.querySelector(".item").innerHTML = "<h1>erreur 404</h1>";
    console.log("erreur 404, sur ressource api: " + err);
  });

// Création d'objet articleClient
let articleClient = {};
// id du procuit
articleClient._id = id;

// fonction d'affichage du produit de l'api

function lesProduits(produit) {
  // déclaration des variables selector
  let imageAlt = document.querySelector("article div.item__img");
  let titre = document.querySelector("#title");
  let prix = document.querySelector("#price");
  let description = document.querySelector("#description");
  let couleurOption = document.querySelector("#colors");
  
  for (let choix of produit) {
    
    if (id === choix._id) {
      //ajout innerHTML
      imageAlt.innerHTML = `<img src="${choix.imageUrl}" alt="${choix.altTxt}">`;
      titre.textContent = `${choix.name}`;
      prix.textContent = `${choix.price}`;
      description.textContent = `${choix.description}`;
      // on ajoute le prix dans le panier 
      articleClient.prix = `${choix.price}`;
      // boucle pour chercher les couleurs pour chaque produit 
      for (let couleur of choix.colors) {
        couleurOption.innerHTML += `<option value="${couleur}">${couleur}</option>`;
      }
    }
  }
  
}