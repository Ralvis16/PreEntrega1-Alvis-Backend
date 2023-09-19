import express from "express";
import ProductRouter from "./routes/product.routes.js";
import CartRouter from "./routes/carts.routes.js"
import { engine } from "express-handlebars";
import * as path from "path"
import __dirname from "./utils.js";
import ProductManager from "./controllers/ProductManager.js";

const app = express();
const PORT = 4000;
const product = new ProductManager();

const server = app.listen(PORT, () => {
  console.log(`Server run Express port: ${PORT}`);
});

const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

// static
app.use("/", express.static(__dirname + "/public"))

app.get("/", async (req, res) => {
  let allProducts = await product.getProducts()
  res.render("home",{
    title: "Express Avanzado | Handlebars",
    products : allProducts
  })
})

app.get("/:id", async (req, res) => {
  console.log(req.params)
  let prod = await product.getProductsById(req.params.id)
  res.render("prod",{
    title: "Express Avanzado | Handlebars",
    products : prod
  })
})

app.use("/api/products", ProductRouter)
app.use("/api/cart", CartRouter)

app.listen(PORT, () => {
  console.log(`Servidor Express Puerto ${PORT}`);
});