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

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid book ID"
        });
    }

    const book = books.find((book) => book.id === id);

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

    if (
        id === undefined ||
        !title ||
        !author ||
        !category ||
        quantity === undefined ||
        available === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "All book fields are required"
        });
    }

    if (
        !Number.isInteger(id) ||
        !Number.isInteger(quantity) ||
        !Number.isInteger(available) ||
        quantity < 0 ||
        available < 0 ||
        available > quantity
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID, quantity or available count"
        });
    }

    const existingBook = books.find((book) => book.id === id);

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

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid book ID"
        });
    }

    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    const { title, author, category, quantity, available } = req.body;

    if (!title || !author || !category ||
        !Number.isInteger(quantity) ||
        !Number.isInteger(available) ||
        quantity < 0 || available < 0 || available > quantity) {
        return res.status(400).json({
            success: false,
            message: "Invalid book data"
        });
    }

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

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid book ID"
        });
    }

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
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
