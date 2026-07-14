(() => {
  const cards = document.querySelectorAll(".role-card");

  cards.forEach((card) => {
    const setPressed = () => {
      card.setAttribute("aria-pressed", card.classList.contains("is-flipped") ? "true" : "false");
    };

    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
      setPressed();
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      card.classList.toggle("is-flipped");
      setPressed();
    });

    card.addEventListener("mouseleave", () => {
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        card.classList.remove("is-flipped");
        setPressed();
      }
    });
  });
})();
