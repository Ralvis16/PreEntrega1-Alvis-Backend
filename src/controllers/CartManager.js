import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import ProductManager from "./ProductManager.js";

const productALL = new ProductManager

class CartManager {
    constructor() {
        this.path = "./src/models/carts.json"
    }

    async readCarts() {
        let carts = await fs.readFile(this.path, "utf-8");
        return JSON.parse(carts);
      }
    
      async writeCarts(carts) {
        await fs.writeFile(this.path, JSON.stringify(carts));
      }

      async exist(id){
        let carts = await this.readCarts();
        return carts.find(cart => cart.id === id)
      }

      async addCarts () {
        let cartsOld = await this.readCarts();
        let id = nanoid();
        let cartsConcat = [{id :id, products : []}, ...cartsOld]
        await this.writeCarts(cartsConcat)
        return "Carrito Agregado"
      }

      async getCartsById(id) {
        let cartById = await this.exist(id)
        if(!cartById) return "Carrito No Encontrado"
        return cartById
      }

      async addProductInCart (cartId, productId) {
        let cartById = await this.exist(cartId)
        if(!cartById) return "Carrito No Encontrado"
        let productById = await productALL.exist(productId)
        if(!cartById) return "Producto No Encontrado"

        let cartsALL = await this.readCarts()
        let cartFilter = cartsALL.filter((cart) => cart.id != cartId)

        if(cartById.products.some((prod) => prod.id === productId)) {
            let moreProductInCart = cartById.products.find((prod) => prod.id === productId)
            moreProductInCart.cantidad++
            console.log(moreProductInCart.cantidad)
            let cartsConcat = [cartById, ...cartFilter]
            await this.writeCarts(cartsConcat)
            return "Producto sumado al Carrito";
        }
        cartById.products.push({id:productById.id, cantidad: 1})
        let cartsConcat = [cartById, ...cartFilter]
        await this.writeCarts(cartsConcat)
        return "Producto Agregado al Carrito"
      }
}

export default CartManager