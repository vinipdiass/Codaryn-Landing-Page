window.routeToSeller = async function () {
  try {
    const r = await fetch("http://localhost:3000/seller");
    const { link } = await r.json();
    window.open(link, "_blank", "noopener");
  } catch (err) {
    console.error("Erro ao buscar vendedor:", err);
    window.open("https://wa.me/555181331593", "_blank", "noopener");
  }
};
