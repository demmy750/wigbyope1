// src/data/products.js
import Wig1 from "../assets/wig1.jpeg";
import StraightWig from "../assets/straightwig.jpeg";
import TwistedWig from "../assets/Twistedwig.jpeg";

// src/data/allProducts.js
const allProducts = [
  {
    id: 1,
    name: "Curly Lace Wig",
    price: 120,
    images: [TwistedWig],
    type: "Lace Wig",
    color: "Black",
    length: 18,
    description:
      "Beautiful curly lace wig with 100% human hair, Swiss lace, 180% density, 18 inches length. Lightweight, natural, and easy to style.",
    availability: "In Stock",
    reviews: [
      { id: 1, name: "Sophia", rating: 5, comment: "Love this wig! So natural." },
      { id: 2, name: "Maya", rating: 4, comment: "Great quality and soft." },
    ],
    relatedIds: [2, 3],
  },
  {
    id: 2,
    name: "Straight Closure Wig",
    price: 150,
    images: [
      Wig1,
    ],
    type: "Closure",
    color: "Brown",
    length: 20,
    description:
      "Silky straight closure wig with 150% density, 20 inches length, premium lace for a flawless finish.",
    availability: "In Stock",
    reviews: [
      { id: 3, name: "Jasmine", rating: 5, comment: "Perfect for everyday wear." },
    ],
    relatedIds: [1, 3],
  },
  {
    id: 3,
    name: "Body Wave Frontals",
    price: 180,
    images: [
      StraightWig,
      "https://placehold.co/600x600?text=Body+Wave+Frontals+2",
    ],
    type: "Frontal",
    color: "Blonde",
    length: 22,
    description:
      "Soft body wave frontals with 220% density, 22 inches length, natural shine and easy maintenance.",
    availability: "Out of Stock",
    reviews: [
      { id: 4, name: "Lily", rating: 4, comment: "Beautiful waves but a bit pricey." },
    ],
    relatedIds: [1, 2],
  },
  // Add more products as needed
];

export default allProducts;