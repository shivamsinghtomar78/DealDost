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

const futureDate = (hours: number) => new Date(Date.now() + hours * 3600000).toISOString();
const pastDate = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString();

export const MOCK_DEALS: Deal[] = [
    {
        id: "d1",
        type: "deal",
        title: "Amul Butter 500g — Fresh Stock!",
        description: "Best price spotted today! Usually ₹120 everywhere. Grab it before it's gone on Zepto!",
        platform: "Zepto",
        platformType: "quick_commerce",
        originalPrice: 120,
        dealPrice: 89,
        discountPercent: 26,
        dealLink: "https://zepto.com",
        image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=300&fit=crop",
        category: "Grocery",
        expiresAt: futureDate(2.5),
        upvotes: 142,
        savesCount: 56,
        commentsCount: 23,
        verified: true,
        verifiedCount: 23,
        postedBy: { name: "Rahul Gupta", username: "dealmaster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
        createdAt: pastDate(2),
        tags: ["grocery", "dairy", "zepto"],
    },
    {
        id: "d2",
        type: "deal",
        title: "boAt Airdopes 141 — Lowest Ever!",
        description: "Amazon Great Indian Festival price! Amazing TWS under ₹1000. Sound quality is 🔥",
        platform: "Amazon",
        platformType: "ecommerce",
        originalPrice: 2999,
        dealPrice: 899,
        discountPercent: 70,
        dealLink: "https://amazon.in",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=300&fit=crop",
        category: "Electronics",
        expiresAt: futureDate(18),
        upvotes: 287,
        savesCount: 134,
        commentsCount: 67,
        verified: true,
        verifiedCount: 45,
        postedBy: { name: "Priya Sharma", username: "techdeals_priya", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
        createdAt: pastDate(4),
        tags: ["electronics", "earbuds", "amazon"],
    },
    {
        id: "d3",
        type: "deal",
        title: "Nike Air Max 270 — Flash Sale!",
        description: "Flipkart Big Billion Days leftover stock. Limited sizes available! Don't miss it.",
        platform: "Flipkart",
        platformType: "ecommerce",
        originalPrice: 8995,
        dealPrice: 3499,
        discountPercent: 61,
        dealLink: "https://flipkart.com",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
        category: "Fashion",
        expiresAt: futureDate(6),
        upvotes: 198,
        savesCount: 89,
        commentsCount: 34,
        verified: true,
        verifiedCount: 31,
        postedBy: { name: "Amit Kumar", username: "fashion_amit", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit" },
        createdAt: pastDate(3),
        tags: ["fashion", "shoes", "nike", "flipkart"],
    },
    {
        id: "d4",
        type: "deal",
        title: "Maggi 12-Pack — Stock Up!",
        description: "Blinkit has Maggi at great price. 10 min delivery to your door! Perfect for hostel kids 😄",
        platform: "Blinkit",
        platformType: "quick_commerce",
        originalPrice: 168,
        dealPrice: 139,
        discountPercent: 17,
        dealLink: "https://blinkit.com",
        image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop",
        category: "Grocery",
        expiresAt: futureDate(1),
        upvotes: 76,
        savesCount: 28,
        commentsCount: 12,
        verified: false,
        verifiedCount: 8,
        postedBy: { name: "Sneha Patel", username: "grocery_queen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha" },
        createdAt: pastDate(1),
        tags: ["grocery", "snacks", "blinkit"],
    },
    {
        id: "d5",
        type: "deal",
        title: "Levi's 501 Original — 68% Off!",
        description: "Myntra End of Season sale. All sizes available in dark blue and black. Grab now!",
        platform: "Myntra",
        platformType: "ecommerce",
        originalPrice: 3999,
        dealPrice: 1299,
        discountPercent: 68,
        dealLink: "https://myntra.com",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
        category: "Fashion",
        expiresAt: futureDate(48),
        upvotes: 156,
        savesCount: 72,
        commentsCount: 29,
        verified: true,
        verifiedCount: 19,
        postedBy: { name: "Vikram Singh", username: "style_vikram", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram" },
        createdAt: pastDate(5),
        tags: ["fashion", "jeans", "myntra"],
    },
    {
        id: "d6",
        type: "deal",
        title: "Tata Tea Gold 500g — Best Price",
        description: "Instamart special! Cheaper than your local kirana store. Stock up for the month.",
        platform: "Instamart",
        platformType: "quick_commerce",
        originalPrice: 280,
        dealPrice: 199,
        discountPercent: 29,
        dealLink: "https://swiggy.com",
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
        category: "Grocery",
        expiresAt: futureDate(5),
        upvotes: 93,
        savesCount: 41,
        commentsCount: 15,
        verified: true,
        verifiedCount: 14,
        postedBy: { name: "Meera Joshi", username: "savvy_meera", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera" },
        createdAt: pastDate(6),
        tags: ["grocery", "tea", "instamart"],
    },
    {
        id: "d7",
        type: "deal",
        title: "Nykaa — Maybelline Fit Me Foundation Set",
        description: "Complete foundation + concealer + setting powder combo at unbelievable price. All shades available!",
        platform: "Nykaa",
        platformType: "ecommerce",
        originalPrice: 1800,
        dealPrice: 699,
        discountPercent: 61,
        dealLink: "https://nykaa.com",
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop",
        category: "Beauty",
        expiresAt: futureDate(12),
        upvotes: 234,
        savesCount: 112,
        commentsCount: 45,
        verified: true,
        verifiedCount: 28,
        postedBy: { name: "Ananya Roy", username: "beauty_ananya", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya" },
        createdAt: pastDate(3),
        tags: ["beauty", "makeup", "nykaa"],
    },
    {
        id: "d8",
        type: "deal",
        title: "Meesho — Cotton Kurti Set of 3",
        description: "Meesho mega sale! 3 cotton kurtis in combo. Perfect for college and office wear 👗",
        platform: "Meesho",
        platformType: "ecommerce",
        originalPrice: 1500,
        dealPrice: 449,
        discountPercent: 70,
        dealLink: "https://meesho.com",
        image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=300&fit=crop",
        category: "Fashion",
        expiresAt: futureDate(72),
        upvotes: 312,
        savesCount: 189,
        commentsCount: 78,
        verified: true,
        verifiedCount: 55,
        postedBy: { name: "Ritu Verma", username: "fashion_ritu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ritu" },
        createdAt: pastDate(8),
        tags: ["fashion", "kurti", "meesho", "women"],
    },
];

export const MOCK_FOOD_SPOTS: FoodSpot[] = [
    {
        id: "f1",
        type: "food_spot",
        placeName: "Dolma Aunty Momos",
        dishName: "Momos",
        dishCategory: "Street Snacks",
        description: "The OG momos of North Campus! Steamed and fried both are 🔥 Must try the spicy chutney!",
        priceRange: "₹40-₹80",
        timing: "11 AM - 10 PM",
        image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&h=300&fit=crop",
        area: "North Campus",
        city: "Delhi",
        landmark: "Near Kamla Nagar Market",
        isStreetStall: true,
        averageRating: 4.7,
        ratingsCount: 234,
        beenHereCount: 189,
        upvotes: 156,
        savesCount: 89,
        tags: ["spicy", "must-try", "cheap", "vegetarian"],
        postedBy: { name: "Arjun Mehta", username: "foodie_arjun", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun" },
        createdAt: pastDate(72),
        coordinates: { lat: 28.6895, lng: 77.2076 },
    },
    {
        id: "f2",
        type: "food_spot",
        placeName: "Sita Ram Diwan Chand",
        dishName: "Chole Bhature",
        dishCategory: "Heavy Meals",
        description: "Legendary chole bhature since 1950! The bhature are perfectly fluffy and chole have that authentic taste.",
        priceRange: "₹80-₹120",
        timing: "8 AM - 4 PM",
        image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop",
        area: "Karol Bagh",
        city: "Delhi",
        landmark: "Near Gaffar Market",
        isStreetStall: false,
        averageRating: 4.8,
        ratingsCount: 567,
        beenHereCount: 423,
        upvotes: 312,
        savesCount: 198,
        tags: ["legendary", "must-try", "heavy", "breakfast"],
        postedBy: { name: "Delhi FoodWalk", username: "delhifoodwalk", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Delhi" },
        createdAt: pastDate(168),
        coordinates: { lat: 28.6447, lng: 77.1908 },
    },
    {
        id: "f3",
        type: "food_spot",
        placeName: "Al Jawahar",
        dishName: "Chicken Biryani",
        dishCategory: "Non-Veg",
        description: "Right opposite Jama Masjid. Their biryani and butter chicken are to die for. A Delhi institution!",
        priceRange: "₹200-₹350",
        timing: "12 PM - 11 PM",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
        area: "Jama Masjid",
        city: "Delhi",
        landmark: "Gate 1, Jama Masjid",
        isStreetStall: false,
        averageRating: 4.6,
        ratingsCount: 891,
        beenHereCount: 567,
        upvotes: 278,
        savesCount: 156,
        tags: ["non-veg", "biryani", "mughlai", "heritage"],
        postedBy: { name: "Kabir Khan", username: "nonveg_kabir", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir" },
        createdAt: pastDate(240),
        coordinates: { lat: 28.6507, lng: 77.2334 },
    },
    {
        id: "f4",
        type: "food_spot",
        placeName: "Blue Tokai Coffee",
        dishName: "Cold Coffee",
        dishCategory: "Cafe & Drinks",
        description: "Best specialty coffee in Delhi! Try their cold brew or the signature hazelnut latte. Great work-from-cafe vibes ☕",
        priceRange: "₹180-₹350",
        timing: "8 AM - 11 PM",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
        area: "Saket",
        city: "Delhi",
        landmark: "Select Citywalk Mall",
        isStreetStall: false,
        averageRating: 4.5,
        ratingsCount: 345,
        beenHereCount: 234,
        upvotes: 145,
        savesCount: 98,
        tags: ["coffee", "cafe", "work-friendly", "premium"],
        postedBy: { name: "Isha Kapoor", username: "cafe_isha", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isha" },
        createdAt: pastDate(120),
        coordinates: { lat: 28.5282, lng: 77.2195 },
    },
    {
        id: "f5",
        type: "food_spot",
        placeName: "Natraj Dahi Bhalle",
        dishName: "Chaat",
        dishCategory: "Street Snacks",
        description: "Chandni Chowk's most famous dahi bhalle! The sweet curd and tangy chutney combo is divine 🤤",
        priceRange: "₹50-₹100",
        timing: "10 AM - 9 PM",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
        area: "Chandni Chowk",
        city: "Delhi",
        landmark: "Paranthe Wali Gali",
        isStreetStall: true,
        averageRating: 4.9,
        ratingsCount: 1234,
        beenHereCount: 876,
        upvotes: 456,
        savesCount: 289,
        tags: ["legendary", "must-try", "cheap", "vegetarian", "heritage"],
        postedBy: { name: "Foodie Delhi", username: "foodie_delhi", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FoodieD" },
        createdAt: pastDate(360),
        coordinates: { lat: 28.6562, lng: 77.2310 },
    },
    {
        id: "f6",
        type: "food_spot",
        placeName: "Bittoo Tikki Wala",
        dishName: "Aloo Tikki",
        dishCategory: "Street Snacks",
        description: "Famous aloo tikki in Pitampura! Crispy outside, soft inside. The chutneys are the real star ⭐",
        priceRange: "₹30-₹60",
        timing: "4 PM - 10 PM",
        image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop",
        area: "Pitampura",
        city: "Delhi",
        landmark: "Near Pitampura Metro",
        isStreetStall: true,
        averageRating: 4.4,
        ratingsCount: 678,
        beenHereCount: 445,
        upvotes: 198,
        savesCount: 123,
        tags: ["cheap", "street-food", "evening-snack", "vegetarian"],
        postedBy: { name: "Street Food King", username: "streetfood_king", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=StreetK" },
        createdAt: pastDate(96),
        coordinates: { lat: 28.7044, lng: 77.1442 },
    },
];

export const MOCK_EVENTS: Event[] = [
    {
        id: "e1",
        type: "event",
        title: "Garba Night at Connaught Place 🎉",
        description: "Join Delhi's biggest garba event! Live music, dandiya sticks provided, food stalls, and prizes for best dressed!",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop",
        eventType: "event",
        dateTime: "Oct 12, 2024 · 7:00 PM",
        venue: "Central Park, Connaught Place",
        entryFee: "Free Entry",
        organizer: "Delhi Events Club",
        interestedCount: 234,
        area: "Connaught Place",
        city: "Delhi",
        upvotes: 89,
        postedBy: { name: "Delhi Events", username: "delhi_events", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Events" },
        createdAt: pastDate(48),
    },
    {
        id: "e2",
        type: "event",
        title: "Sunday Flea Market — Sarojini Nagar 🎪",
        description: "Biggest weekend flea market! Handmade crafts, vintage clothes, street food, live music. Every Sunday!",
        image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop",
        eventType: "event",
        dateTime: "Every Sunday · 10:00 AM - 6:00 PM",
        venue: "Sarojini Nagar Market Grounds",
        entryFee: "Free Entry",
        organizer: "Market Association",
        interestedCount: 456,
        area: "Sarojini Nagar",
        city: "Delhi",
        upvotes: 178,
        postedBy: { name: "Market Guide", username: "market_guide", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Market" },
        createdAt: pastDate(120),
    },
    {
        id: "e3",
        type: "event",
        title: "Open Mic Night — Hauz Khas 🎵",
        description: "Stand-up comedy + acoustic music night! Sign up to perform or just enjoy. Great chai and snacks available.",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
        eventType: "event",
        dateTime: "Oct 15, 2024 · 8:00 PM",
        venue: "Social, Hauz Khas Village",
        entryFee: "₹200 per person",
        organizer: "Comedy Club Delhi",
        interestedCount: 89,
        area: "Hauz Khas",
        city: "Delhi",
        upvotes: 45,
        postedBy: { name: "Comedy Delhi", username: "comedy_delhi", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Comedy" },
        createdAt: pastDate(24),
    },
    {
        id: "e4",
        type: "lost_found",
        title: "Lost: Golden Retriever near Lajpat Nagar 🔍",
        description: "Lost my golden retriever 'Bruno' near Lajpat Nagar central market area. He's wearing a red collar. Please contact if found!",
        image: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=300&fit=crop",
        eventType: "lost_found",
        dateTime: "Last seen: Oct 10, 2024 · 5:00 PM",
        venue: "Lajpat Nagar Central Market",
        entryFee: "Reward: ₹5,000",
        organizer: "",
        interestedCount: 45,
        area: "Lajpat Nagar",
        city: "Delhi",
        upvotes: 67,
        postedBy: { name: "Rohit Malhotra", username: "rohit_m", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit" },
        createdAt: pastDate(6),
    },
    {
        id: "e5",
        type: "service",
        title: "🔧 Expert Plumber — Same Day Service",
        description: "Licensed plumber with 15 years experience. All types of plumbing work — taps, pipes, geysers, water tanks. Affordable rates!",
        image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop",
        eventType: "service",
        dateTime: "Available Mon-Sat · 9AM-7PM",
        venue: "Serves all South Delhi areas",
        entryFee: "Starting ₹200",
        organizer: "Ram Kumar Plumbing",
        interestedCount: 123,
        area: "South Delhi",
        city: "Delhi",
        upvotes: 34,
        postedBy: { name: "Ram Kumar", username: "plumber_ram", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ram" },
        createdAt: pastDate(240),
    },
];

export const MOCK_USER = {
    id: "u1",
    name: "Shivam Singh",
    username: "shivam_deals",
    email: "shivam@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shivam",
    city: "Delhi",
    area: "Karol Bagh",
    totalUpvotes: 1247,
    postsCount: 34,
    savedDeals: ["d1", "d2", "d5"],
    savedFoodSpots: ["f1", "f2", "f5"],
    totalSaved: 2340,
    badges: ["top_contributor", "deal_hunter", "food_explorer"],
};

export const TRENDING_STATS = {
    totalDealsToday: 234,
    totalFoodSpots: 567,
    totalEvents: 12,
    activeCities: 28,
};

export const DISH_CATEGORIES = [
    { name: "All", emoji: "🍽️" },
    { name: "Momos", emoji: "🥟" },
    { name: "Chole Bhature", emoji: "🍛" },
    { name: "Biryani", emoji: "🍗" },
    { name: "Chai & Coffee", emoji: "☕" },
    { name: "Pizza & Burger", emoji: "🍕" },
    { name: "Thali", emoji: "🥘" },
    { name: "Chaat", emoji: "🧆" },
    { name: "Sweets", emoji: "🍰" },
    { name: "Rolls & Wraps", emoji: "🌯" },
    { name: "Dosa & Idli", emoji: "🫓" },
];

export const PLATFORMS = [
    { name: "All", color: "#666" },
    { name: "Amazon", color: "#FF9900" },
    { name: "Flipkart", color: "#2874F0" },
    { name: "Myntra", color: "#FF3F6C" },
    { name: "Zepto", color: "#8B2CF5" },
    { name: "Blinkit", color: "#F8D000" },
    { name: "Instamart", color: "#FC8019" },
    { name: "Meesho", color: "#9B2D8E" },
    { name: "Nykaa", color: "#FC2779" },
];
