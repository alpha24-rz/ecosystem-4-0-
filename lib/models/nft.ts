export interface NFT {
  _id?: string
  tokenId: string
  name: string
  description: string
  image: string
  category: string
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"
  project: string
  owner: string
  ownerEmail: string
  mintDate: string
  status: "pending" | "minted" | "failed"
  metadata?: {
    [key: string]: any
  }
  contractAddress?: string
  transactionHash?: string | null
  createdAt: Date
  updatedAt: Date
}
