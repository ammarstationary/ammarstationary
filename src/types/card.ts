export interface CardWithCategory {
  id: string;
  name: string;
  set_name: string;
  rarity: string;
  condition: string;
  price: number;
  image: string;
  category_id: string | null;
  collector_notes: string | null;
  featured: boolean | null;
  available: boolean | null;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
  } | null;
}
