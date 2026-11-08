const BOOK_DATABASE_NAME = "bookstore_database";
const BOOK_STORE_NAME = "books";

function openBookDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(BOOK_DATABASE_NAME, 1);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(BOOK_STORE_NAME)) {
        database.createObjectStore(BOOK_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open book storage."));
  });
}

async function saveBook(book) {
  const database = await openBookDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(BOOK_STORE_NAME, "readwrite");
    transaction.objectStore(BOOK_STORE_NAME).put(book);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error("Could not save this book."));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error("Saving this book was cancelled."));
    };
  });
}

async function getBooks() {
  const database = await openBookDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(BOOK_STORE_NAME, "readonly");
    const request = transaction.objectStore(BOOK_STORE_NAME).getAll();
    let books;

    request.onsuccess = () => {
      books = request.result;
    };
    transaction.oncomplete = () => {
      database.close();
      resolve(books || []);
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error("Could not load book listings."));
    };
  });
}

function isEbookType(type) {
  return type.toLowerCase().replace(/[\s-]/g, "") === "ebook";
}

function addBookText(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

function createUploadedBookCard(book) {
  const card = document.createElement("article");
  card.className = "book-card";

  const uploadedFileUrl = book.file ? URL.createObjectURL(book.file) : null;
  if (book.file && book.file.type.startsWith("image/")) {
    const image = document.createElement("img");
    image.src = uploadedFileUrl;
    image.alt = `Cover of ${book.title}`;
    card.appendChild(image);
  } else {
    addBookText(
      card,
      "div",
      "book-cover-placeholder",
      book.file && book.file.type === "application/pdf" ? "Uploaded e-book" : "Book cover not provided"
    );
  }

  addBookText(card, "span", `badge ${book.isEbook ? "badge-ebook" : "badge-physical"}`, book.type);
  addBookText(card, "h3", "", book.title);
  addBookText(card, "p", "", `By ${book.author} · ${book.category} · ${book.condition}`);

  if (book.description) {
    addBookText(card, "p", "uploaded-book-description", book.description);
  }

  if (book.isEbook && uploadedFileUrl) {
    const fileLink = document.createElement("a");
    fileLink.className = "ebook-file-link";
    fileLink.href = uploadedFileUrl;
    fileLink.target = "_blank";
    fileLink.rel = "noopener noreferrer";
    fileLink.textContent = "Open uploaded e-book";
    card.appendChild(fileLink);
  }

  addBookText(card, "div", "price", `₹${Number(book.price).toFixed(2)}`);

  const addButton = document.createElement("button");
  addButton.className = "btn";
  addButton.type = "button";
  addButton.textContent = "Add to Cart";
  addButton.addEventListener("click", () => {
    if (typeof addToCart !== "function") {
      alert("The cart is unavailable. Please reload this page and try again.");
      return;
    }
    addToCart(book.title, book.price, book.type);
  });
  card.appendChild(addButton);

  return card;
}

async function renderUploadedBooks() {
  const bookGrid = document.querySelector(".book-grid");
  if (!bookGrid) return;

  try {
    const books = await getBooks();
    const currentPageIsEbook = window.location.pathname.toLowerCase().endsWith("ebook.html");
    books
      .filter((book) => book.isEbook === currentPageIsEbook)
      .forEach((book) => bookGrid.appendChild(createUploadedBookCard(book)));
  } catch (error) {
    console.error("Could not display uploaded books:", error);
    const message = document.createElement("p");
    message.setAttribute("role", "alert");
    message.textContent = "Uploaded books could not be loaded. Please reload the page.";
    bookGrid.before(message);
  }
}

function setupSellBookForm() {
  const form = document.getElementById("sellForm");
  if (!form) return;

  const typeInput = document.getElementById("Type");
  const titleInput = document.getElementById("bookTitle");
  const authorInput = document.getElementById("author");
  const priceInput = document.getElementById("price");
  const categoryInput = document.getElementById("category");
  const conditionInput = document.getElementById("condition");
  const descriptionInput = document.getElementById("description");
  const fileInput = document.getElementById("file-upload");
  const message = document.getElementById("sell-message");
  const previewCover = document.querySelector(".book-image");
  const previewTitle = document.getElementById("previewTitle");
  const previewAuthor = document.getElementById("previewAuthor");
  const previewPrice = document.getElementById("previewPrice");
  const previewSummary = document.getElementById("previewSummary");
  let previewUrl;

  function showMessage(text, isError) {
    message.textContent = text;
    message.style.color = isError ? "#b42318" : "#21633e";
  }

  function updatePreview() {
    previewTitle.textContent = titleInput.value || "The Alchemist";
    previewAuthor.textContent = authorInput.value || "Paulo Coelho";
    previewPrice.textContent = `₹${priceInput.value || "500"}`;
    previewSummary.textContent =
      `Condition: ${conditionInput.value} · Category: ${categoryInput.value}` +
      (descriptionInput.value ? ` · ${descriptionInput.value}` : "");
  }

  function updateCoverPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    previewCover.replaceChildren();

    const file = fileInput.files[0];
    if (!file) {
      previewCover.textContent = "Book";
      return;
    }

    previewUrl = URL.createObjectURL(file);
    if (file.type.startsWith("image/")) {
      const image = document.createElement("img");
      image.src = previewUrl;
      image.alt = "Uploaded book cover preview";
      previewCover.appendChild(image);
    } else {
      previewCover.textContent = "PDF e-book";
    }
  }

  [titleInput, authorInput, priceInput, descriptionInput].forEach((input) => {
    input.addEventListener("input", updatePreview);
  });
  [categoryInput, conditionInput].forEach((input) => {
    input.addEventListener("change", updatePreview);
  });
  fileInput.addEventListener("change", updateCoverPreview);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("", false);

    const file = fileInput.files[0] || null;
    const isEbook = isEbookType(typeInput.value);
    if (isEbook && (!file || file.type !== "application/pdf")) {
      showMessage("Please upload a PDF file for an e-book listing.", true);
      return;
    }

    const book = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: titleInput.value.trim(),
      author: authorInput.value.trim(),
      type: typeInput.value,
      category: categoryInput.value,
      condition: conditionInput.value,
      price: Number(priceInput.value),
      description: descriptionInput.value.trim(),
      isEbook,
      file
    };

    try {
      await saveBook(book);
      form.reset();
      updateCoverPreview();
      updatePreview();
      showMessage(
        `Book listed successfully in the ${isEbook ? "E-Books" : "Shop Books"} page.`,
        false
      );
    } catch (error) {
      console.error("Could not save uploaded book:", error);
      showMessage("The book could not be saved in this browser. Please try again.", true);
    }
  });

  updatePreview();
}

document.addEventListener("DOMContentLoaded", () => {
  setupSellBookForm();
  renderUploadedBooks();
});
