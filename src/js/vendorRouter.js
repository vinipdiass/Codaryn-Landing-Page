export async function routeToSeller() {
  try {
    const r = await fetch("http://localhost:3000/seller");
        // mesma origem ou mude para sua API
    const { link } = await r.json();
    window.open(link, "_blank", "noopener");
  } catch (err) {
    console.error("Erro ao buscar vendedor:", err);
    // fallback estático se a API falhar
    window.open("https://wa.me/555181331593", "_blank", "noopener");
  }
}
