import { promises as fs } from "fs";
import { nanoid } from "nanoid";

class ProductManager {
  constructor() {
    this.path = "./src/models/products.json";
  }

  async readProducts() {
    let products = await fs.readFile(this.path, "utf-8");
    return JSON.parse(products);
  }

  async writeProducts(product) {
    await fs.writeFile(this.path, JSON.stringify(product));
  }

  async exist(id){
    let products = await this.readProducts();
    return products.find(prod => prod.id === id)
  }

  async addProducts(product) {
    let productsOld = await this.readProducts();
    product.id = nanoid();
    let productALL = [...productsOld, product];
    await this.writeProducts(productALL);
    return "Producto Agregado";
  }

  async getProducts() {
    return await this.readProducts();
  }

  async getProductsById(id) {
    let ProductsById = await this.exist(id)
    if(!ProductsById) return "Producto No Encontrado"
    return ProductsById
  }

  async updateProduct(id, product) {
    let ProductsById = await this.exist(id)
    if(!ProductsById) return "Producto No Encontrado"
    await this.deleteProducts(id)
    let productsOld = await this.readProducts()
    let products = [{...product, id : id}, ...productsOld]
    await this.writeProducts(products)
    return "Producto Actualizado"
  }

  async deleteProducts(id) {
    let products = await this.readProducts();
    let existProducts = products.some(prod => prod.id === id)
    if (existProducts) {
      let filterProducts = products.filter(prod => prod.id != id)
      await this.writeProducts(filterProducts)
      return "Producto Eliminado"
    }
    return "Producto a Eliminar No Existe"
  }
  }

export default ProductManager;
