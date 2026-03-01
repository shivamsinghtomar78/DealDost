export interface Deal {
    id: string;
    type: "deal";
    title: string;
    description: string;
    platform: string;
    platformType: "ecommerce" | "quick_commerce";
    originalPrice: number;
    dealPrice: number;
    discountPercent: number;
    dealLink: string;
    image: string;
    category: string;
    expiresAt: string;
    upvotes: number;
    savesCount: number;
    commentsCount: number;
    verified: boolean;
    verifiedCount: number;
    postedBy: { name: string; username: string; avatar: string };
    createdAt: string;
    tags: string[];
}

export interface FoodSpot {
    id: string;
    type: "food_spot";
    placeName: string;
    dishName: string;
    dishCategory: string;
    description: string;
    priceRange: string;
    timing: string;
    image: string;
    area: string;
    city: string;
    landmark: string;
    isStreetStall: boolean;
    averageRating: number;
    ratingsCount: number;
    beenHereCount: number;
    upvotes: number;
    savesCount: number;
    tags: string[];
    postedBy: { name: string; username: string; avatar: string };
    createdAt: string;
    coordinates: { lat: number; lng: number };
}

export interface Event {
    id: string;
    type: "event" | "lost_found" | "service" | "alert";
    title: string;
    description: string;
    image: string;
    eventType: string;
    dateTime: string;
    venue: string;
    entryFee: string;
    organizer: string;
    interestedCount: number;
    area: string;
    city: string;
    upvotes: number;
    postedBy: { name: string; username: string; avatar: string };
    createdAt: string;
}

export interface AppUser {
    id: string;
    firebaseUid: string;
    name: string;
    username: string;
    email: string;
    avatarUrl: string;
    city: string;
    area: string;
    postsCount: number;
    totalUpvotes: number;
    totalSaved: number;
    savedDeals: string[];
    savedFoodSpots: string[];
    badges: string[];
    karmaPoints: number;
}
