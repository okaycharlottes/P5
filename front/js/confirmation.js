let id = (new URL(window.location).searchParams.get("id"));

document.querySelector("#orderId").textContent = id;