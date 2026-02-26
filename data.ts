import { Product } from "@/types/product";

export const CATEGORIES = [
  "All",
  "Earrings",
  "Necklace",
  "Bracelet",
  "Ring",
] as const;

export const STYLES = [
  "All",
  "Modern",
  "Traditional",
  "Party",
  "Minimal",
] as const;

export const TYPES = ["All", "Everyday", "Anti Tarnish"] as const;

export const products: Product[] = [
  /* ---------- EARRINGS ---------- */

  {
    id: "earring-1",
    name: "Gold Pearl Drop Earrings",
    category: "Earrings",
    style: "Modern",
    type: "Anti Tarnish",
    description:
      "Elegant pearl drop earrings crafted for modern sophistication and everyday luxury.",
    variants: [
      {
        id: "v1",
        name: "Gold",
        code: "VJ-101-G",
        price: 3499,
        images: ["/hero1.webp"],
        inStock: true,
      },
      {
        id: "v2",
        name: "Silver",
        code: "VJ-101-S",
        price: 3299,
        images: ["/hero2.webp"],
        inStock: false,
      },
    ],
  },

  {
    id: "earring-2",
    name: "Minimal Stud Earrings",
    category: "Earrings",
    style: "Minimal",
    type: "Everyday",
    description: "Clean minimal studs designed for daily wear.",
    variants: [
      {
        id: "v1",
        name: "Gold",
        code: "VJ-102-G",
        price: 1899,
        images: ["/hero2.webp"],
        inStock: true,
      },
      {
        id: "v2",
        name: "Rose Gold",
        code: "VJ-102-R",
        price: 1999,
        images: ["/hero3.webp"],
        inStock: true,
      },
    ],
  },

  /* ---------- NECKLACE ---------- */

  {
    id: "necklace-1",
    name: "Traditional Temple Necklace",
    category: "Necklace",
    style: "Traditional",
    type: "Anti Tarnish",
    description:
      "Heritage inspired temple necklace with intricate detailing and timeless craftsmanship.",
    variants: [
      {
        id: "v1",
        name: "Classic Gold",
        code: "VJ-201-G",
        price: 12999,
        images: ["/hero1.webp"],
        inStock: true,
      },
      {
        id: "v2",
        name: "Matte Gold",
        code: "VJ-201-M",
        price: 11999,
        images: ["/hero3.webp"],
        inStock: false,
      },
    ],
  },

  {
    id: "necklace-2",
    name: "Layered Party Necklace",
    category: "Necklace",
    style: "Party",
    type: "Everyday",
    description:
      "Statement layered necklace designed to elevate festive looks.",
    variants: [
      {
        id: "v1",
        name: "Gold Finish",
        code: "VJ-202-G",
        price: 4599,
        images: ["/hero3.webp"],
        inStock: true,
      },
    ],
  },

  /* ---------- RINGS ---------- */

  {
    id: "ring-1",
    name: "Minimal Gold Ring",
    category: "Ring",
    style: "Minimal",
    type: "Anti Tarnish",
    description: "Simple minimal ring crafted for modern everyday elegance.",
    variants: [
      {
        id: "v1",
        name: "Size 6",
        code: "VJ-301-6",
        price: 1999,
        images: ["/hero2.webp"],
        inStock: false,
      },
      {
        id: "v2",
        name: "Size 7",
        code: "VJ-301-7",
        price: 1999,
        images: ["/hero1.webp"],
        inStock: true,
      },
      {
        id: "v3",
        name: "Size 8",
        code: "VJ-301-8",
        price: 1999,
        images: ["/hero3.webp"],
        inStock: true,
      },
    ],
  },

  {
    id: "ring-2",
    name: "Statement Cocktail Ring",
    category: "Ring",
    style: "Party",
    type: "Everyday",
    description: "Bold cocktail ring designed to stand out at celebrations.",
    variants: [
      {
        id: "v1",
        name: "Emerald Stone",
        code: "VJ-302-E",
        price: 4999,
        images: ["/hero1.webp"],
        inStock: true,
      },
    ],
  },

  /* ---------- BRACELETS ---------- */

  {
    id: "bracelet-1",
    name: "Elegant Chain Bracelet",
    category: "Bracelet",
    style: "Modern",
    type: "Anti Tarnish",
    description: "Delicate chain bracelet offering refined sophistication.",
    variants: [
      {
        id: "v1",
        name: "Gold",
        code: "VJ-401-G",
        price: 2599,
        images: ["/hero3.webp"],
        inStock: true,
      },
      {
        id: "v2",
        name: "Silver",
        code: "VJ-401-S",
        price: 2399,
        images: ["/hero2.webp"],
        inStock: true,
      },
    ],
  },

  {
    id: "bracelet-2",
    name: "Traditional Kada Bracelet",
    category: "Bracelet",
    style: "Traditional",
    type: "Everyday",
    description:
      "Traditional kada bracelet inspired by heritage craftsmanship.",
    variants: [
      {
        id: "v1",
        name: "Gold Finish",
        code: "VJ-402-G",
        price: 6999,
        images: ["/hero1.webp"],
        inStock: false,
      },
      {
        id: "v2",
        name: "Antique Finish",
        code: "VJ-402-A",
        price: 7299,
        images: ["/hero3.webp"],
        inStock: false,
      },
    ],
  },

  /* ---------- EXTRA FOR GRID FILL ---------- */

  {
    id: "earring-3",
    name: "Pearl Hoop Earrings",
    category: "Earrings",
    style: "Party",
    type: "Anti Tarnish",
    description: "Hoop earrings adorned with elegant pearls.",
    variants: [
      {
        id: "v1",
        name: "Classic",
        code: "VJ-103",
        price: 3799,
        images: ["/hero3.webp"],
        inStock: true,
      },
    ],
  },

  {
    id: "necklace-3",
    name: "Minimal Pendant Necklace",
    category: "Necklace",
    style: "Minimal",
    type: "Everyday",
    description: "Elegant pendant necklace for everyday wear.",
    variants: [
      {
        id: "v1",
        name: "Gold",
        code: "VJ-203",
        price: 2799,
        images: ["/hero2.webp"],
        inStock: true,
      },
    ],
  },
];
