/**
 * Array to store books
 * @type {Array<Object>}
 */
let books = [];

/**
 * Get book input from form
 * @returns {Object} Book data
 */
const getBookInput = () => {
  const title = document.querySelector("#inputBookTitle").value;
  const author = document.querySelector("#inputBookAuthor").value;
  const year = Number(document.querySelector("#inputBookYear").value);
  const isComplete = document.querySelector("#inputBookIsComplete").checked;

  return { title, author, year, isComplete };
};

/**
 * Create a book object
 * @param {Object} param0 Book data
 * @returns {Object} Book object
 */
const createBook = ({ title, author, year, isComplete }) => {
  return {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };
};

/**
 * Add a book to the books array
 * @param {Event} event Form submit event
 */
const addBook = (event) => {
  event.preventDefault();
  const book = createBook(getBookInput());
  books.push(book);
  document.dispatchEvent(new Event("bookChanged"));
};

/**
 * Get search query from form
 * @returns {string} Search query
 */
const getSearchQuery = () => document.querySelector("#searchBookTitle").value;

/**
 * Filter books by title
 * @param {string} query Search query
 * @returns {Array<Object>} Filtered books
 */
const filterBooks = (query) =>
  books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

/**
 * Search for a book
 * @param {Event} event Form submit event
 */
const searchBook = (event) => {
  event.preventDefault();
  const query = getSearchQuery();
  const filteredBooks = filterBooks(query);
  displayBooks(query ? filteredBooks : books);
};

/**
 * Update a book's status
 * @param {Event} event Click event
 * @param {boolean} isComplete Book completion status
 */
const updateBookStatus = (event, isComplete) => {
  const bookId = Number(event.target.id);
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], isComplete };
    document.dispatchEvent(new Event("bookChanged"));
  }
};

/**
 * Mark a book as complete
 * @param {Event} event Click event
 */
const markAsComplete = (event) => updateBookStatus(event, true);

/**
 * Mark a book as incomplete
 * @param {Event} event Click event
 */
const markAsIncomplete = (event) => updateBookStatus(event, false);

/**
 * Remove a book from the books array
 * @param {Event} event Click event
 */
const removeBook = (event) => {
  const bookId = Number(event.target.id);
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    const isConfirmed = confirm("Apakah Anda yakin ingin menghapus buku ini?");
    if (isConfirmed) {
      books.splice(bookIndex, 1);
      document.dispatchEvent(new Event("bookChanged"));
    }
  }
};

/**
 * Clear bookshelves
 */
const clearBookshelves = () => {
  document.querySelector("#incompleteBookshelfList").innerHTML = "";
  document.querySelector("#completeBookshelfList").innerHTML = "";
};

/**
 * Create a book item element
 * @param {string} title Book title
 * @param {string} author Book author
 * @param {string} year Book year
 * @param {number} id Book id
 * @param {boolean} isComplete Book completion status
 * @returns {HTMLElement} Book item element
 */
const createBookItem = (title, author, year, id, isComplete) => {
  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");

  const titleElement = document.createElement("h2");
  titleElement.innerText = title;
  const authorElement = document.createElement("p");
  authorElement.innerText = `Penulis: ${author}`;
  const yearElement = document.createElement("p");
  yearElement.innerText = `Tahun: ${year}`;

  bookItem.append(titleElement, authorElement, yearElement);

  const actionDiv = document.createElement("div");
  actionDiv.classList.add("action");
  const markButton = document.createElement("button");
  markButton.id = id;
  markButton.innerText = isComplete ? "Belum Selesai dibaca" : "Selesai dibaca";
  markButton.classList.add("green");
  markButton.addEventListener(
    "click",
    isComplete ? markAsIncomplete : markAsComplete
  );

  const removeButton = document.createElement("button");
  removeButton.id = id;
  removeButton.innerText = "Hapus buku";
  removeButton.classList.add("red");
  removeButton.addEventListener("click", removeBook);

  actionDiv.append(markButton, removeButton);

  bookItem.appendChild(actionDiv);

  return bookItem;
};

/**
 * Display books on the page
 * @param {Array<Object>} bookList List of books
 */
const displayBooks = (bookList) => {
  clearBookshelves();

  bookList.forEach((book) => {
    const { title, author, year, isComplete, id } = book;
    const bookItem = createBookItem(title, author, year, id, isComplete);

    isComplete
      ? document.querySelector("#completeBookshelfList").appendChild(bookItem)
      : document
          .querySelector("#incompleteBookshelfList")
          .appendChild(bookItem);
  });
};

/**
 * Save books to local storage
 */
const saveBooks = () => {
  localStorage.setItem("books", JSON.stringify(books));
  displayBooks(books);
};

/**
 * Initialize the app
 */
window.addEventListener("load", () => {
  books = JSON.parse(localStorage.getItem("books")) || [];
  displayBooks(books);

  document.querySelector("#inputBook").addEventListener("submit", addBook);
  document.querySelector("#searchBook").addEventListener("submit", searchBook);
  document.addEventListener("bookChanged", saveBooks);
});
