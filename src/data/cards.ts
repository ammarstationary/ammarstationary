export interface TCGCard {
  id: string;
  name: string;
  set: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Ultra Rare" | "Secret Rare" | "Grail";
  condition: "Mint" | "Near Mint" | "Excellent" | "Good" | "Played";
  price: number;
  image: string;
  category: "Pokemon" | "Yu-Gi-Oh" | "Magic" | "One Piece" | "Dragon Ball";
  collectorNotes?: string;
  featured?: boolean;
}

export const cards: TCGCard[] = [
  {
    id: "1",
    name: "Charizard VMAX",
    set: "Darkness Ablaze",
    rarity: "Secret Rare",
    condition: "Mint",
    price: 45000,
    image: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=400&h=560&fit=crop",
    category: "Pokemon",
    collectorNotes: "Rainbow rare, perfect centering, PSA 10 candidate",
    featured: true,
  },
  {
    id: "2",
    name: "Blue-Eyes White Dragon",
    set: "Legend of Blue Eyes",
    rarity: "Grail",
    condition: "Near Mint",
    price: 120000,
    image: "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=400&h=560&fit=crop",
    category: "Yu-Gi-Oh",
    collectorNotes: "1st Edition, original artwork, iconic collector piece",
    featured: true,
  },
  {
    id: "3",
    name: "Black Lotus",
    set: "Alpha",
    rarity: "Grail",
    condition: "Excellent",
    price: 500000,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=560&fit=crop",
    category: "Magic",
    collectorNotes: "Ultimate MTG grail, investment grade",
    featured: true,
  },
  {
    id: "4",
    name: "Pikachu Illustrator",
    set: "Promo",
    rarity: "Grail",
    condition: "Mint",
    price: 850000,
    image: "https://images.unsplash.com/photo-1606569628013-348dc4c9db45?w=400&h=560&fit=crop",
    category: "Pokemon",
    collectorNotes: "Rarest Pokemon card in existence, museum quality",
    featured: true,
  },
  {
    id: "5",
    name: "Monkey D. Luffy",
    set: "Romance Dawn",
    rarity: "Secret Rare",
    condition: "Mint",
    price: 35000,
    image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=560&fit=crop",
    category: "One Piece",
    collectorNotes: "Alternate art, first print run",
  },
  {
    id: "6",
    name: "Ultra Instinct Goku",
    set: "Tournament of Power",
    rarity: "Ultra Rare",
    condition: "Near Mint",
    price: 28000,
    image: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=400&h=560&fit=crop",
    category: "Dragon Ball",
    collectorNotes: "SPR variant, stunning artwork",
  },
  {
    id: "7",
    name: "Mewtwo GX",
    set: "Shiny Star V",
    rarity: "Ultra Rare",
    condition: "Mint",
    price: 15000,
    image: "https://images.unsplash.com/photo-1628960227755-1baf2ba86ab3?w=400&h=560&fit=crop",
    category: "Pokemon",
    collectorNotes: "Full art, Japanese exclusive",
  },
  {
    id: "8",
    name: "Dark Magician Girl",
    set: "Magician's Force",
    rarity: "Ultra Rare",
    condition: "Near Mint",
    price: 55000,
    image: "https://images.unsplash.com/photo-1611602132416-da2ad715afc4?w=400&h=560&fit=crop",
    category: "Yu-Gi-Oh",
    collectorNotes: "1st Edition, iconic fan favorite",
  },
];

export const categories = ["All", "Pokemon", "Yu-Gi-Oh", "Magic", "One Piece", "Dragon Ball"] as const;
export const rarities = ["All", "Common", "Uncommon", "Rare", "Ultra Rare", "Secret Rare", "Grail"] as const;
