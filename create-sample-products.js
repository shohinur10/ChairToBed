const mongoose = require('mongoose');
require('dotenv').config();

// Define the product schema (same as in your Product.model.ts)
const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productLeftCount: { type: Number, required: true },
  productDesc: { type: String },
  productImages: { type: [String], default: [] },
  productViews: { type: Number, default: 0 },
  productCategory: { 
    type: String, 
    enum: ['KIDS', 'BEDROOM', 'OUTDOOR', 'OFFICE', 'KITCHEN', 'OTHER'],
    required: true 
  },
  productMaterialType: { 
    type: String, 
    enum: ['WOOD', 'METAL', 'GLASS', 'PLASTIC', 'FABRIC', 'LEATHER', 'MARBLE', 'BAMBOO'],
    required: true 
  },
  productStyleType: { 
    type: String, 
    enum: ['MODERN', 'CONTEMPORARY', 'TRADITIONAL', 'RUSTIC', 'INDUSTRIAL', 'SCANDINAVIAN', 'BOHEMIAN', 'VINTAGE', 'MINIMALIST', 'OTHER'],
    required: true 
  },
  productStatus: { 
    type: String, 
    enum: ['PAUSE', 'PROCESS', 'DELETE'],
    default: 'PAUSE',
    required: true 
  },
  founderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member',
    required: true 
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Sample products data
const sampleProducts = [
  {
    productName: "Modern Leather Sofa",
    productPrice: 899.99,
    productLeftCount: 15,
    productDesc: "Comfortable 3-seater leather sofa perfect for modern living rooms",
    productImages: ["uploads/products/sofa-set.jpeg"],
    productCategory: "OTHER",
    productMaterialType: "LEATHER",
    productStyleType: "MODERN",
    productStatus: "PROCESS",
    founderId: new mongoose.Types.ObjectId() // Temporary ID - will need to be updated
  },
  {
    productName: "Wooden Dining Table",
    productPrice: 649.99,
    productLeftCount: 8,
    productDesc: "Solid oak dining table for 6 people",
    productImages: ["uploads/products/default.jpeg"],
    productCategory: "KITCHEN",
    productMaterialType: "WOOD",
    productStyleType: "TRADITIONAL",
    productStatus: "PROCESS",
    founderId: new mongoose.Types.ObjectId()
  },
  {
    productName: "Office Ergonomic Chair",
    productPrice: 299.99,
    productLeftCount: 25,
    productDesc: "Comfortable ergonomic office chair with lumbar support",
    productImages: ["uploads/products/default.jpeg"],
    productCategory: "OFFICE",
    productMaterialType: "FABRIC",
    productStyleType: "CONTEMPORARY",
    productStatus: "PROCESS",
    founderId: new mongoose.Types.ObjectId()
  },
  {
    productName: "Kids Bunk Bed",
    productPrice: 449.99,
    productLeftCount: 5,
    productDesc: "Safe and fun bunk bed for kids room",
    productImages: ["uploads/products/default.jpeg"],
    productCategory: "KIDS",
    productMaterialType: "WOOD",
    productStyleType: "OTHER",
    productStatus: "PROCESS",
    founderId: new mongoose.Types.ObjectId()
  }
];

async function createSampleProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, {});
    console.log('Connected to MongoDB');

    // Check if products already exist
    const existingProducts = await Product.find();
    console.log(`Found ${existingProducts.length} existing products`);

    if (existingProducts.length === 0) {
      // Get a founder ID from the database
      const Member = mongoose.model('Member', new mongoose.Schema({}, { strict: false }));
      const founder = await Member.findOne({ memberType: 'FOUNDER' });
      
      if (founder) {
        // Update sample products with real founder ID
        const productsWithFounder = sampleProducts.map(product => ({
          ...product,
          founderId: founder._id
        }));

        // Insert sample products
        await Product.insertMany(productsWithFounder);
        console.log('✅ Sample products created successfully!');
      } else {
        console.log('⚠️  No founder found. Please create a founder account first.');
      }
    } else {
      console.log('✅ Products already exist in database');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error creating sample products:', error);
    await mongoose.disconnect();
  }
}

createSampleProducts(); 