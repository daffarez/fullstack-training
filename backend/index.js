import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let users = [
  { id: 1, name: "Alice", email: "alice@mail.com" },
  { id: 2, name: "Bob", email: "bob@mail.com" },
  { id: 3, name: "Charlie", email: "charlie@mail.com" },
  { id: 4, name: "David", email: "david@mail.com" },
];

// GET all users
app.get("/api/users", (_, res) => {
  res.status(200).json(users);
});

// POST create user
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ message: "Name and email required" });

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const newUser = { id: Date.now(), name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT update user
app.put("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return res.status(404).json({ message: "User not found" });

  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
});

// DELETE user
app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  users = users.filter((u) => u.id !== id);
  res.status(204).send();
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
