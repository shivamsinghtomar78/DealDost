import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Deal from "@/models/Deal";
import FoodSpot from "@/models/FoodSpot";
import Event from "@/models/Event";
import User from "@/models/User";
import { handleRouteError, respondError, respondOk } from "@/lib/api-helpers";

export const runtime = "nodejs";

// POST /api/seed Ã¢â‚¬â€ Populate database with initial mock data
export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const secret = searchParams.get("secret");
        const seedSecret = process.env.SEED_SECRET;

        if (!seedSecret) {
            return respondError("SEED_SECRET is not configured on the server", 503);
        }

        if (secret !== seedSecret) {
            return respondError("Unauthorized", 401);
        }

        await connectDB();

        // Sample user
        const user = await User.findOneAndUpdate(
            { firebaseUid: "seed_user_1" },
            {
                $setOnInsert: {
                    firebaseUid: "seed_user_1",
                    name: "Shivam Singh",
                    username: "shivam_deals",
                    email: "shivam@dealdost.app",
                    area: "Karol Bagh",
                    city: "Delhi",
                    badges: ["top_contributor", "deal_hunter", "food_explorer"],
                    karmaPoints: 1247,
                    postsCount: 34,
                    totalUpvotes: 1247,
                    totalSaved: 2340,
                },
            },
            { upsert: true, new: true }
        );

        // Seed Deals
        const deals = [
            {
                title: "Amul Butter 500g Ã¢â‚¬â€ Fresh Stock at Lowest!",
                description: "Zepto flash deal! Fresh Amul butter at just Ã¢â€šÂ¹89. Running out fast, grab before stock ends.",
                platform: "Zepto", platformType: "quick_commerce", category: "Grocery",
                originalPrice: 120, dealPrice: 89, discountPercent: 26,
                dealLink: "https://zepto.co/deal/amul-butter", imageUrl: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=300&fit=crop",
                expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
                postedBy: user.firebaseUid, postedByUsername: user.username,
                upvotes: 89, verifiedCount: 32, isActive: true, tags: ["grocery", "dairy", "flash"],
            },
            {
                title: "boAt Airdopes 141 Ã¢â‚¬â€ Lowest Ever!",
                description: "Amazon Great Indian Festival price! Amazing TWS under Ã¢â€šÂ¹900. Grab before stock runs out!",
                platform: "Amazon", platformType: "ecommerce", category: "Electronics",
                originalPrice: 2999, dealPrice: 899, discountPercent: 70,
                dealLink: "https://amazon.in/deal/boat-airdopes", imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=300&fit=crop",
                expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
                postedBy: user.firebaseUid, postedByUsername: user.username,
                upvotes: 234, verifiedCount: 45, isActive: true, tags: ["electronics", "earbuds", "amazon"],
            },
            {
                title: "Meesho Ã¢â‚¬â€ Cotton Kurti Set of 3",
                description: "Meesho mega sale! 3 cotton kurtis in combo. Perfect for office and casual wear.",
                platform: "Meesho", platformType: "ecommerce", category: "Fashion",
                originalPrice: 1500, dealPrice: 449, discountPercent: 70,
                dealLink: "https://meesho.com/deal/kurti-set", imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=300&fit=crop",
                expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
                postedBy: user.firebaseUid, postedByUsername: user.username,
                upvotes: 55, verifiedCount: 18, isActive: true, tags: ["fashion", "kurti", "combo"],
            },
            {
                title: "Nykaa Ã¢â‚¬â€ Maybelline Fit Me Foundation Set",
                description: "Complete foundation + concealer + setting powder combo at unbeatable price.",
                platform: "Nykaa", platformType: "ecommerce", category: "Beauty",
                originalPrice: 1800, dealPrice: 699, discountPercent: 61,
                dealLink: "https://nykaa.com/deal/maybelline-set", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
                expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
                postedBy: user.firebaseUid, postedByUsername: user.username,
                upvotes: 28, verifiedCount: 12, isActive: true, tags: ["beauty", "makeup", "foundation"],
            },
            {
                title: "Maggi 12-Pack Ã¢â‚¬â€ Stock Up!",
                description: "Blinkit flash sale! 12-pack Maggi at lowest price. Perfect for hostel life.",
                platform: "Blinkit", platformType: "quick_commerce", category: "Grocery",
                originalPrice: 192, dealPrice: 139, discountPercent: 28,
                dealLink: "https://blinkit.com/deal/maggi-12", imageUrl: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop",
                expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
                postedBy: user.firebaseUid, postedByUsername: user.username,
                upvotes: 45, verifiedCount: 22, isActive: true, tags: ["grocery", "instant", "flash"],
            },
        ];

        for (const deal of deals) {
            await Deal.findOneAndUpdate({ title: deal.title }, { $setOnInsert: deal }, { upsert: true });
        }

        // Seed Food Spots
        const foodSpots = [
            {
                name: "Dolma Aunty Momos",
                description: "The OG momos spot in North Campus! Steamed momos with spicy red chutney that'll blow your mind.",
                dishCategory: "Momos", dishTags: ["Steamed", "Fried", "Tandoori"],
                priceRange: { min: 40, max: 80 },
                area: "North Campus", city: "Delhi", address: "Satya Narayan Park, GTB Nagar",
                landmark: "Near Kamla Nagar Market",
                location: { type: "Point", coordinates: [77.2090, 28.6913] },
                timing: "11 AM - 10 PM", imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop",
                rating: 4.8, ratingBreakdown: { taste: 4.9, portion: 4.5, value: 4.7, hygiene: 4.2 },
                totalRatings: 234, beenHereCount: 342, upvotes: 342,
                postedBy: user.firebaseUid, postedByUsername: user.username,
                spotType: "street_stall", tags: ["momos", "street food", "campus"],
            },
            {
                name: "Sita Ram Diwan Chand",
                description: "Iconic chole bhature since 1955! The OG taste of Old Delhi Ã¢â‚¬â€ thick crispy bhature and spicy chole.",
                dishCategory: "Chole Bhature", dishTags: ["Chole Bhature", "Lassi"],
                priceRange: { min: 60, max: 120 },
                area: "Paharganj", city: "Delhi", address: "2243, Rajguru Marg, Chuna Mandi",
                landmark: "Near New Delhi Railway Station",
                location: { type: "Point", coordinates: [77.2128, 28.6416] },
                timing: "8 AM - 4 PM", imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&h=300&fit=crop",
                rating: 4.7, ratingBreakdown: { taste: 4.8, portion: 4.6, value: 4.5, hygiene: 4.3 },
                totalRatings: 567, beenHereCount: 890, upvotes: 567,
                postedBy: user.firebaseUid, postedByUsername: user.username,
                spotType: "restaurant", tags: ["chole bhature", "iconic", "old delhi"],
            },
            {
                name: "Al Jawahar Ã¢â‚¬â€ Jama Masjid",
                description: "The legendary Mughlai restaurant at Jama Masjid! Butter Chicken, Nihari, and the famous Seekh Kebabs.",
                dishCategory: "Butter Chicken", dishTags: ["Butter Chicken", "Nihari", "Seekh Kebab"],
                priceRange: { min: 200, max: 450 },
                area: "Old Delhi", city: "Delhi", address: "8, Matia Mahal Rd, Jama Masjid",
                landmark: "Opposite Gate 1, Jama Masjid",
                location: { type: "Point", coordinates: [77.2334, 28.6507] },
                timing: "7 AM - 12 AM", imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
                rating: 4.6, ratingBreakdown: { taste: 4.8, portion: 4.4, value: 4.3, hygiene: 4.1 },
                totalRatings: 345, beenHereCount: 567, upvotes: 456,
                postedBy: user.firebaseUid, postedByUsername: user.username,
                spotType: "restaurant", tags: ["mughlai", "iconic", "non-veg"],
            },
        ];

        for (const spot of foodSpots) {
            await FoodSpot.findOneAndUpdate({ name: spot.name }, { $setOnInsert: spot }, { upsert: true });
        }

        // Seed Events
        const events = [
            {
                title: "Garba Night at Connaught Place Ã°Å¸Å½â€°",
                description: "Join Delhi's biggest garba event! Live music, dandiya sticks provided, food stalls, and prizes for best dressed.",
                eventType: "event", date: "Oct 12, 2024", time: "7:00 PM",
                venue: "Central Park, Connaught Place", area: "Connaught Place", city: "Delhi",
                imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",
                entryFee: "Free", interestedCount: 234, upvotes: 89,
                postedBy: user.firebaseUid, postedByUsername: "delhi_events",
                tags: ["garba", "navratri", "dandiya"],
            },
            {
                title: "Sunday Flea Market Ã¢â‚¬â€ Sarojini Nagar Ã°Å¸â€ºÂÃ¯Â¸Â",
                description: "Biggest weekend flea market! Handmade crafts, vintage clothes, street food, live music. Every Sunday!",
                eventType: "event", date: "Every Sunday", time: "10:00 AM - 6:00 PM",
                venue: "Sarojini Nagar Market Grounds", area: "Sarojini Nagar", city: "Delhi",
                imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop",
                entryFee: "Free", interestedCount: 456, upvotes: 178,
                postedBy: user.firebaseUid, postedByUsername: "market_guide",
                tags: ["flea market", "shopping", "weekend"],
            },
        ];

        for (const event of events) {
            await Event.findOneAndUpdate({ title: event.title }, { $setOnInsert: event }, { upsert: true });
        }

        const counts = await Promise.all([
            Deal.countDocuments(),
            FoodSpot.countDocuments(),
            Event.countDocuments(),
            User.countDocuments(),
        ]);

        return respondOk({
            message: "Database seeded successfully",
            counts: { deals: counts[0], foodSpots: counts[1], events: counts[2], users: counts[3] },
        });
    } catch (error) {
        return handleRouteError("POST /api/seed", error);
    }
}




