
// Récupération des produits dans l'api

fetch("http://localhost:3000/api/products")
  // quand tu as la réponse donne le résultat en json.
  .then((res) => res.json())
  // ce que l'on a reçu et qui a été traité en json sera appelé objetProduits
  .then((objetProduits) => {
    // appel de la fonction d'affichage des produits
    lesKanaps(objetProduits);
  })
  // dans le cas d'une erreur remplace le contenu de titre par un h1 au contenu de erreur 404 et renvoit en console l'erreur.
  .catch((err) => {
    document.querySelector(".titles").innerHTML = "<h1>La page n'est pas trouvée</h1>";
    console.log("erreur 404, sur ressource api:" + err);
  });

// fonction d'affichage des produits de l'api sur la page index

  function lesKanaps(produits) {
    let zoneArticle = document.querySelector("#items");
    // boucle 
    for (let produit of produits) {
      zoneArticle.innerHTML += `<a href="./product.html?_id=${produit._id}">
      <article>
        <img src="${produit.imageUrl}" alt="${produit.altTxt}">
        <h3 class="productName">${produit.name}</h3>
        <p class="productDescription">${produit.description}</p>
      </article>
    </a>`;
    }
  }