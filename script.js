let myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.read ? "read" : "not read yet"
    }`;
  };
}

const defaultBook = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);
const bookDisplay = document.getElementById("books");

function addBookToLibrary(Book) {
  myLibrary.push(Book);
}

addBookToLibrary(defaultBook);
updateDisplay();

function updateDisplay() {
  let arrLength = myLibrary.length;

  for (let i = 0; i < arrLength; i++) {
    let node = document.createElement("div");

    node.innerHTML = `<div class="book" data-index="${i}">
                    <h3>${myLibrary[i].title}</h3>
                    <p>${myLibrary[i].info()}</p>
                    <button class="read btn-green">Mark as read</button>
                    <button class="btn-green">Edit</button>
                    <button class="btn-red">Remove</button>
                </div>
            </div>`;

    bookDisplay.appendChild(node);
  }
}