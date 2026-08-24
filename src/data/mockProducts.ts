import { Product, CategoryInfo, ActivityItem } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'ThinkPad X1 Carbon',
    sku: 'LNV-1092',
    category: 'Hardware',
    price: 1499.00,
    status: 'Active',
    createdAt: '2026-10-24',
    description: '14" ultralight premium laptop with Intel Core Ultra processor and OLED display.',
    stock: 45,
    iconType: 'laptop'
  },
  {
    id: '2',
    name: 'Cloud Storage Enterprise',
    sku: 'SW-C500',
    category: 'Software',
    price: 49.00,
    status: 'Active',
    createdAt: '2026-10-22',
    description: 'High-availability scalable cloud file storage with granular team permissions.',
    stock: 999,
    iconType: 'cloud'
  },
  {
    id: '3',
    name: 'Pro Audio Headset',
    sku: 'ACC-882',
    category: 'Accessories',
    price: 129.00,
    status: 'Draft',
    createdAt: '2026-10-20',
    description: 'Noise-cancelling wireless headset with boom mic for clear conference audio.',
    stock: 80,
    iconType: 'headset'
  },
  {
    id: '4',
    name: 'iPhone 15 Pro Max',
    sku: 'SKU-PHN-089',
    category: 'Hardware',
    price: 1199.00,
    status: 'Active',
    createdAt: '2026-10-18',
    description: 'Titanium aerospace-grade design with A17 Pro chip and 48MP camera.',
    stock: 62,
    iconType: 'phone'
  },
  {
    id: '5',
    name: 'Sony WH-1000XM5',
    sku: 'SKU-AUD-012',
    category: 'Electronics',
    price: 398.00,
    status: 'Active',
    createdAt: '2026-10-15',
    description: 'Industry-leading noise canceling wireless headphones with dual processors.',
    stock: 14,
    iconType: 'headset'
  },
  {
    id: '6',
    name: 'Dell UltraSharp 32 4K',
    sku: 'SKU-MON-055',
    category: 'Electronics',
    price: 850.00,
    status: 'Active',
    createdAt: '2026-10-12',
    description: '31.5-inch 4K UHD IPS display with USB-C 90W power delivery hub.',
    stock: 28,
    iconType: 'monitor'
  },
  {
    id: '7',
    name: 'Keychron Q1 Pro',
    sku: 'SKU-ACC-021',
    category: 'Accessories',
    price: 199.00,
    status: 'Draft',
    createdAt: '2026-10-09',
    description: 'Full aluminum custom wireless mechanical keyboard with hot-swappable switches.',
    stock: 0,
    iconType: 'keyboard'
  },
  {
    id: '8',
    name: 'Ergonomic Task Chair',
    sku: 'FUR-CHR-102',
    category: 'Furniture',
    price: 450.00,
    status: 'Active',
    createdAt: '2026-10-05',
    description: 'High-back breathable mesh chair with 4D adjustable armrests and lumbar support.',
    stock: 35,
    iconType: 'chair'
  },
  {
    id: '9',
    name: 'Electric Standing Desk Pro',
    sku: 'FUR-DSK-301',
    category: 'Furniture',
    price: 680.00,
    status: 'Active',
    createdAt: '2026-09-28',
    description: 'Dual-motor motorized height adjustable standing desk with memory presets.',
    stock: 19,
    iconType: 'chair'
  },
  {
    id: '10',
    name: 'Developer Corporate Hoodie',
    sku: 'CLO-HD-004',
    category: 'Clothing',
    price: 65.00,
    status: 'Active',
    createdAt: '2026-09-20',
    description: 'Heavyweight organic cotton branded hoodie with embroidered ProductHub crest.',
    stock: 150,
    iconType: 'clothing'
  },
  {
    id: '11',
    name: 'USB4 Docking Station 12-in-1',
    sku: 'ACC-DCK-707',
    category: 'Accessories',
    price: 189.00,
    status: 'Active',
    createdAt: '2026-09-14',
    description: 'Dual 4K 60Hz display support, 100W PD charging, and 2.5Gbps Ethernet.',
    stock: 55,
    iconType: 'default'
  },
  {
    id: '12',
    name: 'Enterprise Security Suite',
    sku: 'SW-SEC-900',
    category: 'Software',
    price: 199.00,
    status: 'Active',
    createdAt: '2026-09-02',
    description: 'Zero-trust endpoint detection, threat prevention, and audit compliance tool.',
    stock: 999,
    iconType: 'cloud'
  }
];

export const INITIAL_CATEGORIES: CategoryInfo[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    itemCount: 482,
    description: 'Laptops, monitors, peripherals, and network gear for enterprise setups.',
    icon: 'devices',
    color: '#3e32d3'
  },
  {
    id: 'furniture',
    name: 'Furniture',
    itemCount: 315,
    description: 'Ergonomic chairs, standing desks, and modular storage units.',
    icon: 'chair',
    color: '#883800'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    itemCount: 256,
    description: 'Cables, adapters, carrying cases, and protective gear.',
    icon: 'watch',
    color: '#575e70'
  },
  {
    id: 'clothing',
    name: 'Clothing',
    itemCount: 195,
    description: 'Branded apparel, uniforms, and corporate merch.',
    icon: 'checkroom',
    color: '#F59E0B'
  },
  {
    id: 'hardware',
    name: 'Hardware',
    itemCount: 340,
    description: 'Workstations, laptops, server blades, and physical IT components.',
    icon: 'laptop',
    color: '#3e32d3'
  },
  {
    id: 'software',
    name: 'Software',
    itemCount: 180,
    description: 'Enterprise SaaS licenses, productivity apps, and cloud tools.',
    icon: 'cloud',
    color: '#5850ec'
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'added',
    title: 'Product added',
    description: 'ThinkPad X1 Carbon Gen 11',
    timeAgo: '10 mins ago',
    actor: 'Sheran'
  },
  {
    id: 'act-2',
    type: 'updated',
    title: 'Product updated',
    description: 'Price changed for Sony WH-1000XM5',
    timeAgo: '2 hours ago',
    actor: 'System automated'
  },
  {
    id: 'act-3',
    type: 'deleted',
    title: 'Product deleted',
    description: 'Old Stock Monitor XYZ',
    timeAgo: 'Yesterday',
    actor: 'Admin Team'
  },
  {
    id: 'act-4',
    type: 'category_created',
    title: 'Category created',
    description: "'Refurbished Electronics'",
    timeAgo: 'Yesterday',
    actor: 'Sheran'
  }
];
