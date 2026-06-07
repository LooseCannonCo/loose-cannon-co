// heroDeck.types.ts
// Card shapes for the Loose Cannon homepage hero deck.
// `cardType` discriminates which face renders. Add new client brands as new types.

export type ReceiptLine = { label: string; value: string };

export type HeroCard =
  | { _key?: string; cardType: 'post'; imageUrl?: string; alt?: string; hotspot?: { x: number; y: number }; linkUrl?: string; ratio?: number }
  | { _key?: string; cardType: 'poster'; num: string; title: string; imageUrl?: string }
  | { _key?: string; cardType: 'quote'; eyebrow: string; text: string }
  | { _key?: string; cardType: 'review'; name: string; role: string; text: string; helpful?: string; avatarUrl?: string }
  | { _key?: string; cardType: 'ayyeStatement'; text: string; accentText?: string }
  | { _key?: string; cardType: 'ayyeReceipt'; head: string; sub: string; lines: ReceiptLine[]; totalLabel: string; totalValue: string }
  | { _key?: string; cardType: 'ayyeReview'; name: string; role: string; text: string };
