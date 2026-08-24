/**
 * In-Memory Product Data
 * Contains initial realistic sample products for the Product Management Application.
 */

const products = [
  {
    id: 1,
    name: "ThinkPad X1 Carbon",
    price: 1499,
    category: "Hardware",
    sku: "LNV-1092",
    status: "Active",
    createdAt: "2026-10-24",
    description: "14\" ultralight premium laptop with Intel Core Ultra processor and OLED display.",
    stock: 45,
    iconType: "laptop"
  },
  {
    id: 2,
    name: "Cloud Storage Enterprise",
    price: 49,
    category: "Software",
    sku: "SW-C500",
    status: "Active",
    createdAt: "2026-10-22",
    description: "High-availability scalable cloud file storage with granular team permissions.",
    stock: 999,
    iconType: "cloud"
  },
  {
    id: 3,
    name: "Pro Audio Headset",
    price: 129,
    category: "Accessories",
    sku: "ACC-882",
    status: "Draft",
    createdAt: "2026-10-20",
    description: "Noise-cancelling wireless headset with boom mic for clear conference audio.",
    stock: 80,
    iconType: "headset"
  },
  {
    id: 4,
    name: "iPhone 15 Pro Max",
    price: 1199,
    category: "Hardware",
    sku: "SKU-PHN-089",
    status: "Active",
    createdAt: "2026-10-18",
    description: "Titanium aerospace-grade design with A17 Pro chip and 48MP camera.",
    stock: 62,
    iconType: "phone"
  },
  {
    id: 5,
    name: "Sony WH-1000XM5",
    price: 398,
    category: "Electronics",
    sku: "SKU-AUD-012",
    status: "Active",
    createdAt: "2026-10-15",
    description: "Industry-leading noise canceling wireless headphones with dual processors.",
    stock: 14,
    iconType: "headset"
  },
  {
    id: 6,
    name: "Dell UltraSharp 32 4K",
    price: 850,
    category: "Electronics",
    sku: "SKU-MON-055",
    status: "Active",
    createdAt: "2026-10-12",
    description: "31.5-inch 4K UHD IPS display with USB-C 90W power delivery hub.",
    stock: 28,
    iconType: "monitor"
  },
  {
    id: 7,
    name: "Keychron Q1 Pro",
    price: 199,
    category: "Accessories",
    sku: "SKU-ACC-021",
    status: "Draft",
    createdAt: "2026-10-09",
    description: "Full aluminum custom wireless mechanical keyboard with hot-swappable switches.",
    stock: 0,
    iconType: "keyboard"
  },
  {
    id: 8,
    name: "Ergonomic Task Chair",
    price: 450,
    category: "Furniture",
    sku: "FUR-CHR-102",
    status: "Active",
    createdAt: "2026-10-05",
    description: "High-back breathable mesh chair with 4D adjustable armrests and lumbar support.",
    stock: 35,
    iconType: "chair"
  },
  {
    id: 9,
    name: "Electric Standing Desk Pro",
    price: 680,
    category: "Furniture",
    sku: "FUR-DSK-301",
    status: "Active",
    createdAt: "2026-09-28",
    description: "Dual-motor motorized height adjustable standing desk with memory presets.",
    stock: 19,
    iconType: "chair"
  },
  {
    id: 10,
    name: "Developer Corporate Hoodie",
    price: 65,
    category: "Clothing",
    sku: "CLO-HD-004",
    status: "Active",
    createdAt: "2026-09-20",
    description: "Heavyweight organic cotton branded hoodie with embroidered ProductHub crest.",
    stock: 150,
    iconType: "clothing"
  },
  {
    id: 11,
    name: "USB4 Docking Station 12-in-1",
    price: 189,
    category: "Accessories",
    sku: "ACC-DCK-707",
    status: "Active",
    createdAt: "2026-09-14",
    description: "Dual 4K 60Hz display support, 100W PD charging, and 2.5Gbps Ethernet.",
    stock: 55,
    iconType: "default"
  },
  {
    id: 12,
    name: "Enterprise Security Suite",
    price: 199,
    category: "Software",
    sku: "SW-SEC-900",
    status: "Active",
    createdAt: "2026-09-02",
    description: "Zero-trust endpoint detection, threat prevention, and audit compliance tool.",
    stock: 999,
    iconType: "cloud"
  }
];

module.exports = products;
