const fs = require('fs');
const path = require('path');
let {productStorage} = require("../data/dataFs")

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		return res.render("products",{products, toThousand})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let {idProduct} = req.params
		let product = products.find(product => product.id === +idProduct) 
		return res.render("detail",{
			product
		})
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render("product-create-form")
	},
	
	// Create -  Method to store
	store: (req, res) => {
		let lastId = 0;
		products.forEach(product => {
			if(product.id > lastId){
				lastId = product.id
			}
		});
		let {name, discount, price, description, category} = req.body
		let newProduct = {
			id : lastId+1,
			name,
			discount,
			price,
			description,
			category,
			image : req.file ? req.file.filename : "default-image.png"
		}
		products.push(newProduct)
		productStorage(products)
		return res.redirect("/products")
		/* return res.send (newProduct) */
		
	},

	// Update - Form to edit
	edit: (req, res) => {
		let {idProduct} = req.params
		let product = products.find(product => product.id === +idProduct) 
		return res.render("product-edit-form",{
			product
		})
	},
	// Update - Method to update
	update: (req, res) => {
		let {name, discount, price, description, category} = req.body
		products.forEach(product => {
			if (product.id === +req.params.id) {
				product.id = product.id,
				product.name = name,
				product.discount = discount,
				product.price = price,
				product.description = description,
				product.category = category
				product.image = "default-image.png"
			}
		})
		
		productStorage(products)
		return res.redirect("/products")
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		products.forEach(product => {
			if (product.id === +req.params.id) {
				let eraseProduct = products.indexOf(product)
				products.splice(eraseProduct, 1)
			}
		})
		productStorage(products)
		return res.redirect("/products")
		
	}
};

module.exports = controller;