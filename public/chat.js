document.addEventListener("DOMContentLoaded", function () {
  const socket = io();

  // Function to append a new message to the chat
  function appendMessage(msg, sent = false) {
    const messages = document.getElementById("messages");
    const item = document.createElement("li");
    item.classList.add("message");
    if (msg.text) {
      item.textContent = msg.text;
    } else if (msg.image) {
      const img = document.createElement("img");
      img.src = msg.image;
      img.onload = function () {
        window.scrollTo(0, document.body.scrollHeight);
      };
      item.appendChild(img);
    }
    item.classList.add(sent ? "sent" : "received");
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  }

  // Handle sending a new message from the chat input
  const form = document.getElementById("form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = document.getElementById("input");
    if (input.value) {
      appendMessage({ text: input.value }, true);
      socket.emit("chat message", { text: input.value, sent: true });
      input.value = "";
    }
  });

  // Handle image upload form
  const imageForm = document.getElementById("image-form");
  imageForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        appendMessage({ image: data.src }, true);
        socket.emit("chat message", { image: data.src, sent: true });
      })
      .catch((error) => console.error("Error:", error));
  });

  // Handle incoming messages
  socket.on("chat message", function (msg) {
    appendMessage(msg);
  });
});
