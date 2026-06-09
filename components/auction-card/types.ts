export type Auction = {
  id: string;
  image: string;
  imageAlt: string;
  category: string;
  title: string;
  location: string;
  endsAt: string;
  currentBid: string;
  startingBid: string;
  isLive?: boolean;
};
