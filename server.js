
import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

let books = [];

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Book API is running successfully"
    });
});

app.get("/api/books", (req, res) => {
    res.status(200).json({
        success: true,
        count: books.length,
        message: "Books fetched successfully",
        data: books
    });
});

app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Book fetched successfully",
        data: book
    });
});

app.post("/api/books", (req, res) => {
    const { id, title, author, category, quantity, available } = req.body;

    if (!id || !title || !author || !category || quantity === undefined || available === undefined) {
        return res.status(400).json({
            success: false,
            message: "All book fields are required"
        });
    }

    const existingBook = books.find(book => book.id === id);

    if (existingBook) {
        return res.status(409).json({
            success: false,
            message: "Book with this ID already exists"
        });
    }

    const newBook = {
        id,
        title,
        author,
        category,
        quantity,
        available
    };

    books.push(newBook);

    res.status(201).json({
        success: true,
        message: "Book added successfully",
        data: newBook
    });
});

app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    const { title, author, category, quantity, available } = req.body;

    books[bookIndex] = {
        id,
        title,
        author,
        category,
        quantity,
        available
    };

    res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: books[bookIndex]
    });
});

app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(bookIndex, 1);

    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: deletedBook[0]
    });
});

app.get("/api/books/search", (req, res) => {
    const { title } = req.query;

    const searchedBooks = books.filter(book =>
        book.title.toLowerCase().includes(title.toLowerCase())
    );

    res.status(200).json({
        success: true,
        count: searchedBooks.length,
        message: "Books searched successfully",
        data: searchedBooks
    });
});

app.post("/api/books/:id/issue", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    if (book.available === 0) {
        return res.status(400).json({
            success: false,
            message: "Book is unavailable"
        });
    }

    book.available--;

    res.status(200).json({
        success: true,
        message: "Book issued successfully",
        data: book
    });
});

app.post("/api/books/:id/return", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    if (book.available === book.quantity) {
        return res.status(400).json({
            success: false,
            message: "All copies are already available"
        });
    }

    book.available++;

    res.status(200).json({
        success: true,
        message: "Book returned successfully",
        data: book
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
