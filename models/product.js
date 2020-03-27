const products = [];

module.exports = class Product {
    constructor(t) {
        this.name = t.name;
        this.price = t.price;
        this.description = t.description;
    }
    save() {
        products.push(this);
    }
    static fetchAll() {
        return products;
    }
}