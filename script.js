document.addEventListener("DOMContentLoaded", () => {
  const contact = document.querySelector(".contact-button");
  contact?.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("#contact")?.scrollIntoView({behavior:"smooth"});
  });
});