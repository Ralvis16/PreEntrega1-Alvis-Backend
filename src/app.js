import express from "express";
import ProductRouter from "./router/product.router.js";
import CartRouter from "./router/carts.router.js"
import { engine } from "express-handlebars";
import * as path from "path"
import __dirname from "./utils.js";
import ProductManager from "./controllers/ProductManager.js";
import { Server } from "socket.io";

const app = express();
const httpServer = app.listen(4000, () =>console.log("Listening on PORT 4000"));
const product = new ProductManager();


const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

// static
app.use("/", express.static(__dirname + "/public"))


socketServer.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");
  });

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