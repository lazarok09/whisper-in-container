const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

if (modal) {
  closeModalBtn.addEventListener("click", () => {
    modal.classList.add("closing"); // Add the "closing" class
    modal.addEventListener(
      "animationend",
      () => {
        modal.close();
        modal.classList.remove("closing");
      },
      { once: true }
    );
    modal.classList.add("closing"); // Add the class *after* adding the listener
  });

  // Optional: Close the modal if the user clicks outside the modal content
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("closing");
      modal.addEventListener(
        "animationend",
        () => {
          modal.close();
          modal.classList.remove("closing");
        },
        { once: true }
      );
    }
  });

  // Close the modal when the Escape key is pressed

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModalWithAnimation();
    }
  });
}
