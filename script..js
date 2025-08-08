// Efeito de animação suave ao rolar para seções
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Configuração avançada para imagem SVG de ultra resolução
const productImage = document.getElementById("productImage");
if (productImage) {
  productImage.setAttribute("decoding", "async");
  productImage.setAttribute("fetchpriority", "high");
  productImage.setAttribute("draggable", "false");
}
