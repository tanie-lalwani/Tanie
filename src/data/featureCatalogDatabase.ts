export type PriceType =
  | "flat"
  | "per_form"
  | "per_location"
  | "per_brand"
  | "per_page"
  | "per_product"
  | "per_service"
  | "per_post"
  | "per_image"
  | "per_account"
  | "per_hour"
  | "per_month"
  | "starting_at";

export interface CatalogFeature {
  id: string;
  categoryId: string;
  name: string;
  priceInr: number;
  priceUsd: number;
  priceType: PriceType;
  unitLabel?: string;
  defaultQty?: number;
  minQty?: number;
  maxQty?: number;
  description: string;
  badge?: string;
  isPopular?: boolean;
}

export interface FeatureCategory {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  displayOrder: number;
  description: string;
  features: CatalogFeature[];
}

export interface IndustryPreset {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  recommendedBasePriceInr: number;
  recommendedBasePriceUsd: number;
  targetAudience: string;
  defaultFeatureIds: string[];
  recommendedAddonIds: string[];
  discountPercent: number; // e.g., 20%
}

export interface SelectedFeatureItem {
  featureId: string;
  quantity: number;
}

// -----------------------------------------------------------------------------
// 18 MASTER CATEGORIES WITH FULL ATOMIC FEATURE PRICING
// -----------------------------------------------------------------------------

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: "customer_website",
    name: "1. Customer & Website Features",
    shortName: "Website Essentials",
    icon: "🌐",
    displayOrder: 1,
    description: "Core website architecture, customer navigation, accounts, and discovery elements.",
    features: [
      { id: "homepage", categoryId: "customer_website", name: "Homepage", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Bespoke hero section, value proposition, and key conversions.", isPopular: true },
      { id: "about_us", categoryId: "customer_website", name: "About us page", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Brand narrative, mission, vision, and milestones." },
      { id: "services_page", categoryId: "customer_website", name: "Services page", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Comprehensive directory of offered services." },
      { id: "product_catalog", categoryId: "customer_website", name: "Product catalog", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Grid/list view product catalog with pagination/infinite scroll.", isPopular: true },
      { id: "product_detail_page", categoryId: "customer_website", name: "Product detail page system", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Dynamic templated detail page for single products." },
      { id: "service_detail_page", categoryId: "customer_website", name: "Service detail page system", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "In-depth service landing pages with deliverables breakdown." },
      { id: "categories", categoryId: "customer_website", name: "Categories", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Structured product/service category hierarchy." },
      { id: "subcategories", categoryId: "customer_website", name: "Subcategories", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Multi-level nested subcategories for deep inventory." },
      { id: "search", categoryId: "customer_website", name: "Search", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Instant predictive search bar with live result dropdown." },
      { id: "filters", categoryId: "customer_website", name: "Filters", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Faceted filtering (price, size, color, brand, rating)." },
      { id: "sorting", categoryId: "customer_website", name: "Sorting", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Sort by price, newest, popularity, and rating." },
      { id: "pricing_packages", categoryId: "customer_website", name: "Pricing/packages", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Tiered pricing table cards with feature checkmarks." },
      { id: "comparison_tables", categoryId: "customer_website", name: "Comparison tables", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Side-by-side feature and specification comparison matrix." },
      { id: "product_variants", categoryId: "customer_website", name: "Product variants", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Color, size, material variant selector with dynamic pricing." },
      { id: "product_addons", categoryId: "customer_website", name: "Product options/add-ons", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Customizable gift wraps, engraving, and warranty add-ons." },
      { id: "related_products", categoryId: "customer_website", name: "Related products/services", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Automated upsell suggestions based on category." },
      { id: "featured_products", categoryId: "customer_website", name: "Featured products/services", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Homepage highlight showcase carousels." },
      { id: "recently_viewed", categoryId: "customer_website", name: "Recently viewed items", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Cookie/session-persisted customer viewing history." },
      { id: "wishlist", categoryId: "customer_website", name: "Wishlist", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Customer save-for-later wishlist system." },
      { id: "favorites", categoryId: "customer_website", name: "Favorites", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Heart/favorite toggle across items." },
      { id: "cart", categoryId: "customer_website", name: "Cart", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Slide-over drawer & full cart with quantity adjustments." },
      { id: "checkout", categoryId: "customer_website", name: "Checkout", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Multi-step or single-page checkout flow." },
      { id: "guest_checkout", categoryId: "customer_website", name: "Guest checkout", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Frictionless purchase without mandatory registration." },
      { id: "customer_accounts", categoryId: "customer_website", name: "Customer accounts", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "User registration, session tokens, and security." },
      { id: "login_signup", categoryId: "customer_website", name: "Login/signup", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Email/password & social login authentication modals." },
      { id: "forgot_password", categoryId: "customer_website", name: "Forgot password", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Automated secure password reset email flow." },
      { id: "customer_profile", categoryId: "customer_website", name: "Customer profile", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Client profile details, address book, and contact settings." },
      { id: "customer_dashboard", categoryId: "customer_website", name: "Customer dashboard", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Client portal hub with quick actions and metrics." },
      { id: "order_history", categoryId: "customer_website", name: "Order history", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "List of past purchases, receipts, and order dates." },
      { id: "order_tracking", categoryId: "customer_website", name: "Order tracking", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Live tracking timeline with shipment courier status." },
      { id: "downloadable_invoices", categoryId: "customer_website", name: "Downloadable invoices", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Automated branded PDF invoice generation." },
      { id: "reviews", categoryId: "customer_website", name: "Reviews", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Customer review submission and moderation queue." },
      { id: "ratings", categoryId: "customer_website", name: "Ratings", priceInr: 500, priceUsd: 10, priceType: "flat", description: "5-star rating summary and aggregation." },
      { id: "testimonials", categoryId: "customer_website", name: "Testimonials", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Curated client testimonial carousel with avatars." },
      { id: "faq", categoryId: "customer_website", name: "FAQ", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Interactive accordion FAQ component." },
      { id: "knowledge_base", categoryId: "customer_website", name: "Knowledge base", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Structured help articles with category search." },
      { id: "blog", categoryId: "customer_website", name: "Blog", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "SEO-optimized articles list and reader view." },
      { id: "blog_categories", categoryId: "customer_website", name: "Blog categories", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Categorized archive routing for articles." },
      { id: "comments", categoryId: "customer_website", name: "Comments", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Discussion comment section with replies." },
      { id: "portfolio", categoryId: "customer_website", name: "Portfolio", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Filterable work and project visual showcase." },
      { id: "case_studies", categoryId: "customer_website", name: "Case studies", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Deep-dive problem, solution, and ROI stories." },
      { id: "gallery", categoryId: "customer_website", name: "Gallery", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Responsive masonry grid image lightbox." },
      { id: "video_gallery", categoryId: "customer_website", name: "Video gallery", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Hosted or YouTube/Vimeo embedded video hub." },
      { id: "before_after_gallery", categoryId: "customer_website", name: "Before/after gallery", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Interactive split slider comparison viewer." },
      { id: "team_directory", categoryId: "customer_website", name: "Team/staff directory", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Member cards, bios, and social links." },
      { id: "contact_page", categoryId: "customer_website", name: "Contact page", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Full contact info, hours, and map." },
      { id: "contact_forms", categoryId: "customer_website", name: "Contact forms", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Validated contact inquiry form with email routing." },
      { id: "multiple_contact_forms", categoryId: "customer_website", name: "Multiple contact forms", priceInr: 500, priceUsd: 10, priceType: "per_form", unitLabel: "per form", defaultQty: 2, minQty: 1, maxQty: 10, description: "Department-specific forms (e.g., Sales, Support, HR)." },
      { id: "whatsapp_integration", categoryId: "customer_website", name: "WhatsApp integration", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Direct click-to-chat WhatsApp widget with pre-filled message.", isPopular: true },
      { id: "click_to_call", categoryId: "customer_website", name: "Click-to-call", priceInr: 300, priceUsd: 5, priceType: "flat", description: "Mobile-friendly instant dial action links." },
      { id: "email_integration", categoryId: "customer_website", name: "Email integration", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Resend / SMTP transactional notifications." },
      { id: "social_media_links", categoryId: "customer_website", name: "Social media links", priceInr: 300, priceUsd: 5, priceType: "flat", description: "Branded social media icon link bars." },
      { id: "social_media_feed", categoryId: "customer_website", name: "Social media feed", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Live Instagram or Twitter grid integration." },
      { id: "newsletter_signup", categoryId: "customer_website", name: "Newsletter signup", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Email subscription capture banner." },
      { id: "location_maps", categoryId: "customer_website", name: "Location + maps", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Interactive embedded Google Maps with directions pin." },
      { id: "multiple_locations", categoryId: "customer_website", name: "Multiple locations", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Multi-branch listing with individual addresses." },
      { id: "store_locator", categoryId: "customer_website", name: "Store locator", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Zip code / radius geolocation store finder." },
      { id: "opening_hours", categoryId: "customer_website", name: "Opening hours", priceInr: 300, priceUsd: 5, priceType: "flat", description: "Live 'Open Now' badge with weekly schedule." },
      { id: "holiday_notices", categoryId: "customer_website", name: "Holiday/closure notices", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Emergency and scheduled closure banner alerts." },
      { id: "announcements", categoryId: "customer_website", name: "Announcements", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Top header marquee notification banner." },
      { id: "popups", categoryId: "customer_website", name: "Pop-ups", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Exit-intent or timed promotional lead modals." },
      { id: "sticky_cta", categoryId: "customer_website", name: "Sticky CTA", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Fixed floating book/buy button on mobile." },
      { id: "floating_contact_bar", categoryId: "customer_website", name: "Floating contact bar", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Bottom action bar with phone, WhatsApp, and email." }
    ]
  },
  {
    id: "booking_appointment",
    name: "2. Booking & Appointment",
    shortName: "Booking Systems",
    icon: "📅",
    displayOrder: 2,
    description: "Calendars, appointments, staff scheduling, deposits, and automated reminders.",
    features: [
      { id: "basic_booking_form", categoryId: "booking_appointment", name: "Basic booking form", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Simple date and service reservation inquiry form." },
      { id: "appointment_scheduling", categoryId: "booking_appointment", name: "Appointment scheduling", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "End-to-end appointment engine with automated calendar sync.", isPopular: true },
      { id: "calendar_interface", categoryId: "booking_appointment", name: "Calendar interface", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Interactive interactive month/week calendar view." },
      { id: "available_time_slots", categoryId: "booking_appointment", name: "Available time slots", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Real-time slot blocker preventing double-bookings." },
      { id: "staff_selection", categoryId: "booking_appointment", name: "Staff selection", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Allows clients to choose specific stylists, doctors, or agents." },
      { id: "service_selection", categoryId: "booking_appointment", name: "Service selection", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Multi-select service picker with dynamic duration." },
      { id: "location_selection", categoryId: "booking_appointment", name: "Location selection", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Choose physical branch or virtual meeting." },
      { id: "date_time_selection", categoryId: "booking_appointment", name: "Date/time selection", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Timezone-aware date and time picker." },
      { id: "booking_confirmation", categoryId: "booking_appointment", name: "Booking confirmation", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Dedicated confirmation screen with add-to-calendar ICS file." },
      { id: "booking_cancellation", categoryId: "booking_appointment", name: "Booking cancellation", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Self-service cancellation link with policy check." },
      { id: "rescheduling", categoryId: "booking_appointment", name: "Rescheduling", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Self-service client date/time rescheduling portal." },
      { id: "booking_reminders", categoryId: "booking_appointment", name: "Booking reminders", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Automated 24h & 2h pre-appointment alerts." },
      { id: "email_booking_notifications", categoryId: "booking_appointment", name: "Email booking notifications", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Transactional booking receipt sent to client and admin." },
      { id: "whatsapp_booking_notifications", categoryId: "booking_appointment", name: "WhatsApp booking notifications", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Direct WhatsApp booking confirmation message." },
      { id: "staff_calendar", categoryId: "booking_appointment", name: "Staff calendar", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Internal employee calendar view of daily duties." },
      { id: "employee_availability", categoryId: "booking_appointment", name: "Employee availability", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Staff shift configuration, breaks, and days off." },
      { id: "recurring_appointments", categoryId: "booking_appointment", name: "Recurring appointments", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Weekly/monthly repeating reservation rules." },
      { id: "waitlist", categoryId: "booking_appointment", name: "Waitlist", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Automated queue when preferred slots are full." },
      { id: "booking_deposits", categoryId: "booking_appointment", name: "Booking deposits", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Charge partial advance token to reduce no-shows." },
      { id: "booking_payments", categoryId: "booking_appointment", name: "Booking payments", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Full online prepayment via Razorpay / Stripe." },
      { id: "booking_history", categoryId: "booking_appointment", name: "Booking history", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Past and upcoming client appointment log." },
      { id: "booking_availability_engine", categoryId: "booking_appointment", name: "Booking availability engine", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Advanced multi-resource algorithm balancing staff, rooms & tools." },
      { id: "multi_staff_booking", categoryId: "booking_appointment", name: "Multi-staff booking", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Simultaneous appointments across different specialists." },
      { id: "multi_location_booking", categoryId: "booking_appointment", name: "Multi-location booking", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Cross-city branch booking router." },
      { id: "resource_room_booking", categoryId: "booking_appointment", name: "Resource/room booking", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Equipment, studio, conference, or table booking." },
      { id: "event_booking", categoryId: "booking_appointment", name: "Event booking", priceInr: 2500, priceUsd: 40, priceType: "flat", description: "Ticketed group event booking with seat counts." },
      { id: "class_course_booking", categoryId: "booking_appointment", name: "Class/course booking", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Multi-session workshop and batch enrollment." }
    ]
  },
  {
    id: "ecommerce_ordering",
    name: "3. E-commerce & Ordering",
    shortName: "E-Commerce & Orders",
    icon: "🛍️",
    displayOrder: 3,
    description: "Cart, checkout, payments, shipping calculation, inventory, and order management.",
    features: [
      { id: "online_ordering", categoryId: "ecommerce_ordering", name: "Online ordering", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Direct product & takeaway menu ordering engine.", isPopular: true },
      { id: "ecom_cart", categoryId: "ecommerce_ordering", name: "Cart", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Persistent cart with coupon and tax calculations." },
      { id: "ecom_checkout", categoryId: "ecommerce_ordering", name: "Checkout", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Secure single-page checkout with address autocompletion." },
      { id: "payment_gateway", categoryId: "ecommerce_ordering", name: "Payment gateway", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "UPI, Cards, NetBanking via Razorpay / Stripe.", isPopular: true },
      { id: "cod", categoryId: "ecommerce_ordering", name: "COD (Cash on Delivery)", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Cash on delivery toggle with pincode verification." },
      { id: "coupon_codes", categoryId: "ecommerce_ordering", name: "Coupon codes", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Percentage & flat discount coupon validation." },
      { id: "gift_cards", categoryId: "ecommerce_ordering", name: "Gift cards", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Digital voucher gift card issuance and redemption." },
      { id: "discounts", categoryId: "ecommerce_ordering", name: "Discounts", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Automated sale price strikethroughs across catalog." },
      { id: "bulk_discounts", categoryId: "ecommerce_ordering", name: "Bulk discounts", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Tiered volume pricing (Buy 5+ get 15% off)." },
      { id: "membership_pricing", categoryId: "ecommerce_ordering", name: "Membership pricing", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Exclusive discounted rates for VIP members." },
      { id: "subscription_products", categoryId: "ecommerce_ordering", name: "Subscription products", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Monthly recurring product billing & auto-deliveries." },
      { id: "ecom_variants", categoryId: "ecommerce_ordering", name: "Product variants", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "SKU-level variant management with stock counts." },
      { id: "inventory_tracking", categoryId: "ecommerce_ordering", name: "Inventory tracking", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Real-time stock deduction upon order placement." },
      { id: "low_stock_alerts", categoryId: "ecommerce_ordering", name: "Low-stock alerts", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Automated email alerts when stock dips below threshold." },
      { id: "stock_reservations", categoryId: "ecommerce_ordering", name: "Stock reservations", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Holds inventory for 15 minutes during active checkout." },
      { id: "order_management", categoryId: "ecommerce_ordering", name: "Order management", priceInr: 2500, priceUsd: 40, priceType: "flat", description: "Internal portal to view, fulfill, and manage orders." },
      { id: "order_status_system", categoryId: "ecommerce_ordering", name: "Order status system", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Order states (Processing, Shipped, Delivered, Cancelled)." },
      { id: "shipping_calculation", categoryId: "ecommerce_ordering", name: "Shipping calculation", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Weight & pincode based shipping cost matrix." },
      { id: "delivery_zones", categoryId: "ecommerce_ordering", name: "Delivery zones", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Local, Regional, and National delivery boundary rules." },
      { id: "delivery_charges", categoryId: "ecommerce_ordering", name: "Delivery charges", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Custom flat & tier-based delivery pricing." },
      { id: "free_shipping_rules", categoryId: "ecommerce_ordering", name: "Free-shipping rules", priceInr: 500, priceUsd: 10, priceType: "flat", description: "'Free shipping on orders above ₹999' banner & logic." },
      { id: "pickup_option", categoryId: "ecommerce_ordering", name: "Pickup option", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Self-pickup / Curbside pickup checkout selector." },
      { id: "store_pickup_scheduling", categoryId: "ecommerce_ordering", name: "Store pickup scheduling", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Pick a specific hour window for in-store collection." },
      { id: "delivery_tracking", categoryId: "ecommerce_ordering", name: "Delivery tracking", priceInr: 2500, priceUsd: 40, priceType: "flat", description: "API tracking webhook for Shiprocket / Delhivery." },
      { id: "returns_system", categoryId: "ecommerce_ordering", name: "Returns system", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Customer return request form with photo upload." },
      { id: "refund_management", categoryId: "ecommerce_ordering", name: "Refund management", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "1-click gateway refund processing in dashboard." },
      { id: "invoice_generation", categoryId: "ecommerce_ordering", name: "Invoice generation", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Automated GST/tax invoice PDF email attachment." },
      { id: "gst_invoice_support", categoryId: "ecommerce_ordering", name: "GST invoice support", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Captures B2B GSTIN with CGST/SGST/IGST breakdown.", isPopular: true },
      { id: "abandoned_cart_recovery", categoryId: "ecommerce_ordering", name: "Abandoned cart recovery", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Automated recovery emails & WhatsApp discount links." },
      { id: "product_recommendations", categoryId: "ecommerce_ordering", name: "Product recommendations", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "'Frequently bought together' cross-sell widget." },
      { id: "ecom_wishlist", categoryId: "ecommerce_ordering", name: "Wishlist", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Save products with stock back-in-alert." },
      { id: "product_comparison", categoryId: "ecommerce_ordering", name: "Product comparison", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Side-by-side spec comparison tray." },
      { id: "ecom_recently_viewed", categoryId: "ecommerce_ordering", name: "Recently viewed products", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Bottom history slider of viewed items." },
      { id: "bulk_product_upload", categoryId: "ecommerce_ordering", name: "Bulk product upload", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Upload hundreds of products via Excel/CSV." },
      { id: "product_import_export", categoryId: "ecommerce_ordering", name: "Product import/export", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Export catalog data to CSV / Shopify / WooCommerce." }
    ]
  },
  {
    id: "lead_generation",
    name: "4. Lead Generation",
    shortName: "Lead Gen & CRM",
    icon: "🎯",
    displayOrder: 4,
    description: "Capture high-intent inquiries, CRM pipeline, lead scoring, and instant WhatsApp alerts.",
    features: [
      { id: "lead_capture_form", categoryId: "lead_generation", name: "Lead capture form", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "High-converting inquiry capture widget with validation.", isPopular: true },
      { id: "quote_request_form", categoryId: "lead_generation", name: "Quote request form", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Detailed multi-field project quotation request form." },
      { id: "callback_request", categoryId: "lead_generation", name: "Callback request", priceInr: 500, priceUsd: 10, priceType: "flat", description: "10-second phone number callback request form." },
      { id: "consultation_request", categoryId: "lead_generation", name: "Consultation request", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Book a 1-on-1 discovery consultation call." },
      { id: "demo_request", categoryId: "lead_generation", name: "Demo request", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Product demo scheduler for B2B & SaaS." },
      { id: "lead_database", categoryId: "lead_generation", name: "Lead database", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Internal searchable repository of all incoming prospects.", isPopular: true },
      { id: "automatic_lead_creation", categoryId: "lead_generation", name: "Automatic lead creation", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Syncs form submissions straight into database & CRM." },
      { id: "lead_status_tracking", categoryId: "lead_generation", name: "Lead status tracking", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Stages: New, Contacted, Qualified, Won, Lost." },
      { id: "lead_scoring", categoryId: "lead_generation", name: "Lead scoring", priceInr: 2500, priceUsd: 40, priceType: "flat", description: "Algorithmic intent rating based on company size & budget." },
      { id: "lead_assignment", categoryId: "lead_generation", name: "Lead assignment", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Round-robin distribution of leads to team members." },
      { id: "employee_lead_assignment", categoryId: "lead_generation", name: "Employee lead assignment", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Assign specific leads to dedicated sales reps." },
      { id: "follow_up_reminders", categoryId: "lead_generation", name: "Follow-up reminders", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Calendar task alerts for pending client calls." },
      { id: "sales_pipeline", categoryId: "lead_generation", name: "Sales pipeline", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Kanban board drag-and-drop deal management." },
      { id: "lead_notes", categoryId: "lead_generation", name: "Lead notes", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Timestamped internal call & meeting notes." },
      { id: "lead_tags", categoryId: "lead_generation", name: "Lead tags", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Custom tags (VIP, Enterprise, Urgent, Cold)." },
      { id: "lead_source_tracking", categoryId: "lead_generation", name: "Lead source tracking", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Tracks whether lead came from Google, Instagram, or Ads." },
      { id: "campaign_attribution", categoryId: "lead_generation", name: "Campaign attribution", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Connects leads directly to active ad campaign IDs." },
      { id: "customer_history", categoryId: "lead_generation", name: "Customer history", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Full interaction log across forms, emails, and visits." },
      { id: "automated_follow_ups", categoryId: "lead_generation", name: "Automated follow-ups", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Email & WhatsApp drip campaign for cold leads." },
      { id: "lead_notifications", categoryId: "lead_generation", name: "Lead notifications", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Instant push notification when an inquiry is submitted." },
      { id: "whatsapp_lead_alerts", categoryId: "lead_generation", name: "WhatsApp lead alerts", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Instant WhatsApp ping to business owner on every lead.", isPopular: true },
      { id: "email_lead_alerts", categoryId: "lead_generation", name: "Email lead alerts", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Instant email alert with full form response." },
      { id: "crm_integration", categoryId: "lead_generation", name: "CRM integration", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "HubSpot / Zoho CRM two-way contact sync." },
      { id: "whatsapp_crm", categoryId: "lead_generation", name: "WhatsApp CRM", priceInr: 3500, priceUsd: 50, priceType: "flat", description: "Wati / Interakt / Gallabox WhatsApp CRM funnel." },
      { id: "email_crm", categoryId: "lead_generation", name: "Email CRM", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Mailchimp / Klaviyo audience segmentation." }
    ]
  },
  {
    id: "marketing_conversion",
    name: "5. Marketing & Conversion",
    shortName: "Marketing & Growth",
    icon: "📈",
    displayOrder: 5,
    description: "SEO setup, Meta/Google tracking pixels, A/B testing, and conversion funnels.",
    features: [
      { id: "seo_setup", categoryId: "marketing_conversion", name: "SEO setup", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Foundational search engine indexing and sitemap.", isPopular: true },
      { id: "on_page_seo", categoryId: "marketing_conversion", name: "On-page SEO", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "H1-H6 hierarchy, semantic content structure, and internal links." },
      { id: "technical_seo", categoryId: "marketing_conversion", name: "Technical SEO", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Lighthouse optimization, crawlability, and schema JSON-LD." },
      { id: "keyword_optimization", categoryId: "marketing_conversion", name: "Keyword optimization", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Target keyword placement across core titles and copy." },
      { id: "meta_tags", categoryId: "marketing_conversion", name: "Meta tags", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Page title, meta description, and OpenGraph social cards." },
      { id: "schema_markup", categoryId: "marketing_conversion", name: "Schema markup", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Rich snippets for Organization, LocalBusiness, and FAQs." },
      { id: "sitemap", categoryId: "marketing_conversion", name: "Sitemap", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Auto-generated XML sitemap submitted to Google." },
      { id: "robots_txt", categoryId: "marketing_conversion", name: "Robots.txt", priceInr: 300, priceUsd: 5, priceType: "flat", description: "Configures bot crawler access rules." },
      { id: "google_search_setup", categoryId: "marketing_conversion", name: "Google Search setup", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Google Search Console domain ownership verification." },
      { id: "google_business_integration", categoryId: "marketing_conversion", name: "Google Business integration", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Connects Google Maps listing and reviews." },
      { id: "campaign_landing_page", categoryId: "marketing_conversion", name: "Campaign landing page", priceInr: 1500, priceUsd: 25, priceType: "per_page", unitLabel: "per page", defaultQty: 1, minQty: 1, maxQty: 10, description: "Dedicated distraction-free ad landing page." },
      { id: "dynamic_landing_pages", categoryId: "marketing_conversion", name: "Dynamic landing pages", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Dynamic headline swapping based on ad UTM parameters." },
      { id: "utm_tracking", categoryId: "marketing_conversion", name: "UTM tracking", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Passes UTM source, medium, and campaign to forms." },
      { id: "conversion_tracking", categoryId: "marketing_conversion", name: "Conversion tracking", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Tracks button clicks, form submissions, and purchases." },
      { id: "meta_pixel", categoryId: "marketing_conversion", name: "Meta Pixel", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Facebook & Instagram Pixel with standard conversion events.", isPopular: true },
      { id: "google_ads_tracking", categoryId: "marketing_conversion", name: "Google Ads tracking", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Google Ads conversion tag & enhanced conversions." },
      { id: "retargeting", categoryId: "marketing_conversion", name: "Retargeting", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Sets custom audience tracking for remarketing." },
      { id: "ab_testing", categoryId: "marketing_conversion", name: "A/B testing", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Split testing headlines, buttons, and layouts." },
      { id: "funnel_tracking", categoryId: "marketing_conversion", name: "Funnel tracking", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Drop-off analytics from landing to final checkout." },
      { id: "marketing_funnel", categoryId: "marketing_conversion", name: "Marketing funnel", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Multi-step lead magnet -> tripwire -> offer funnel." },
      { id: "personalized_offers", categoryId: "marketing_conversion", name: "Personalized offers", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Geo-targeted and return-visitor personalized banners." },
      { id: "referral_tracking", categoryId: "marketing_conversion", name: "Referral tracking", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Unique referral affiliate links and commissions." },
      { id: "email_marketing_integration", categoryId: "marketing_conversion", name: "Email marketing integration", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Automated list subscription to Mailchimp/Klaviyo." },
      { id: "sms_integration", categoryId: "marketing_conversion", name: "SMS integration", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Twilio / Fast2SMS promotional broadcast integration." },
      { id: "whatsapp_marketing_integration", categoryId: "marketing_conversion", name: "WhatsApp marketing integration", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Broadcast discount campaigns over official WhatsApp API." },
      { id: "push_notifications", categoryId: "marketing_conversion", name: "Push notifications", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "OneSignal browser web push notifications." },
      { id: "newsletter_system", categoryId: "marketing_conversion", name: "Newsletter system", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Self-hosted email newsletter broadcast sender." },
      { id: "blog_content_system", categoryId: "marketing_conversion", name: "Blog/content system", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Content marketing hub built for organic traffic growth." },
      { id: "analytics_dashboard", categoryId: "marketing_conversion", name: "Analytics dashboard", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Integrated dashboard showing page views and sessions." },
      { id: "conversion_dashboard", categoryId: "marketing_conversion", name: "Conversion dashboard", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Charts displaying cost-per-lead and conversion rates." }
    ]
  },
  {
    id: "admin_management",
    name: "6. Admin & Business Management",
    shortName: "Admin Dashboard",
    icon: "⚙️",
    displayOrder: 6,
    description: "Executive portal to manage products, services, bookings, customers, and analytics.",
    features: [
      { id: "admin_dashboard", categoryId: "admin_management", name: "Admin dashboard", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Secure executive back-office hub with KPI metrics.", isPopular: true },
      { id: "product_management", categoryId: "admin_management", name: "Product management", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Create, edit, archive products with images and pricing." },
      { id: "service_management", categoryId: "admin_management", name: "Service management", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Add and update services, durations, and staff assignments." },
      { id: "category_management", categoryId: "admin_management", name: "Category management", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Organize parent categories, tags, and display sequences." },
      { id: "admin_inventory_management", categoryId: "admin_management", name: "Inventory management", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Quick batch stock updates, warehouse logs, and warnings." },
      { id: "admin_order_management", categoryId: "admin_management", name: "Order management", priceInr: 2500, priceUsd: 40, priceType: "flat", description: "Process orders, print pack slips, and update dispatch." },
      { id: "customer_management", categoryId: "admin_management", name: "Customer management", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Client profiles, spend lifetime value, and order history." },
      { id: "booking_management", categoryId: "admin_management", name: "Booking management", priceInr: 2500, priceUsd: 40, priceType: "flat", description: "Master appointment calendar with drag-to-reschedule." },
      { id: "employee_management", categoryId: "admin_management", name: "Employee management", priceInr: 2500, priceUsd: 40, priceType: "flat", description: "Staff accounts, permissions, and commission records." },
      { id: "content_management", categoryId: "admin_management", name: "Content management", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Live inline text and image editing across all pages." },
      { id: "pricing_management", categoryId: "admin_management", name: "Pricing management", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Bulk price adjustments and seasonal price overrides." },
      { id: "coupon_management", categoryId: "admin_management", name: "Coupon management", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Generate promo codes, expiry dates, and usage limits." },
      { id: "promotion_management", categoryId: "admin_management", name: "Promotion management", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Schedule site-wide sales banners and discounts." },
      { id: "review_management", categoryId: "admin_management", name: "Review management", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Approve, respond to, or feature customer testimonials." },
      { id: "blog_management", categoryId: "admin_management", name: "Blog management", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Rich text article publisher with SEO metadata." },
      { id: "media_management", categoryId: "admin_management", name: "Media management", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Centralized cloud asset library with CDN optimization." },
      { id: "form_submissions", categoryId: "admin_management", name: "Form submissions", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Central inbox for all contact and quote submissions." },
      { id: "admin_lead_management", categoryId: "admin_management", name: "Lead management", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Prospect pipeline status and assignment." },
      { id: "report_generation", categoryId: "admin_management", name: "Report generation", priceInr: 2500, priceUsd: 40, priceType: "flat", description: "Exportable PDF/Excel business summary reports." },
      { id: "sales_reports", categoryId: "admin_management", name: "Sales reports", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Revenue over time, top selling products, and trends." },
      { id: "customer_reports", categoryId: "admin_management", name: "Customer reports", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Customer acquisition, retention, and churn metrics." },
      { id: "inventory_reports", categoryId: "admin_management", name: "Inventory reports", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Stock turnover rates and dead stock identifiers." },
      { id: "booking_reports", categoryId: "admin_management", name: "Booking reports", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Occupancy rates, peak hours, and staff utilization." },
      { id: "export_data", categoryId: "admin_management", name: "Export data", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "1-click data backup download." },
      { id: "csv_import_export", categoryId: "admin_management", name: "CSV import/export", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Bulk spreadsheet import for products, leads & orders." },
      { id: "automated_notifications", categoryId: "admin_management", name: "Automated notifications", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Automated business alerts sent to manager devices." },
      { id: "role_based_access", categoryId: "admin_management", name: "Role-based access", priceInr: 2500, priceUsd: 40, priceType: "flat", description: "Admin, Manager, Staff, Accountant granular permissions." },
      { id: "admin_activity_logs", categoryId: "admin_management", name: "Admin activity logs", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Audit trail of every modification made in backend." },
      { id: "staff_permissions", categoryId: "admin_management", name: "Staff permissions", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Hide sensitive financial data from junior staff." },
      { id: "multi_admin_support", categoryId: "admin_management", name: "Multi-admin support", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Multiple simultaneous administrator logins." }
    ]
  },
  {
    id: "employee_staff",
    name: "7. Employee / Staff Systems",
    shortName: "Staff Systems",
    icon: "👥",
    displayOrder: 7,
    description: "Employee portals, shift scheduling, commissions, tasks, and attendance tracking.",
    features: [
      { id: "employee_profiles", categoryId: "employee_staff", name: "Employee profiles", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Staff bio, specialized skills, and contact details." },
      { id: "employee_dashboard", categoryId: "employee_staff", name: "Employee dashboard", priceInr: 2500, priceUsd: 40, priceType: "flat", description: "Personalized workspace for assigned jobs and tasks." },
      { id: "employee_login", categoryId: "employee_staff", name: "Employee login", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Dedicated staff portal login credentials." },
      { id: "employee_permissions", categoryId: "employee_staff", name: "Employee permissions", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Access level locks based on job title." },
      { id: "employee_scheduling", categoryId: "employee_staff", name: "Employee scheduling", priceInr: 2500, priceUsd: 40, priceType: "flat", description: "Weekly roster assignment and schedule calendar." },
      { id: "shift_management", categoryId: "employee_staff", name: "Shift management", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Morning/Evening shift swaps and notifications." },
      { id: "attendance", categoryId: "employee_staff", name: "Attendance", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Digital check-in / check-out timesheet logging." },
      { id: "leave_management", categoryId: "employee_staff", name: "Leave management", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Leave request submission and manager approval." },
      { id: "task_management", categoryId: "employee_staff", name: "Task management", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Internal to-do lists and project milestones." },
      { id: "staff_lead_assignment", categoryId: "employee_staff", name: "Lead assignment", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Assign client inquiries to specific sales reps." },
      { id: "staff_booking_assignment", categoryId: "employee_staff", name: "Booking assignment", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Route appointment bookings to specific practitioners." },
      { id: "sales_tracking", categoryId: "employee_staff", name: "Sales tracking", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Tracks individual sales volume per employee." },
      { id: "commission_tracking", categoryId: "employee_staff", name: "Commission tracking", priceInr: 2500, priceUsd: 40, priceType: "flat", description: "Automated commission percentage calculation on services." },
      { id: "employee_performance_reports", categoryId: "employee_staff", name: "Employee performance reports", priceInr: 2500, priceUsd: 40, priceType: "flat", description: "Rating scorecards and revenue generated reports." },
      { id: "internal_notes", categoryId: "employee_staff", name: "Internal notes", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Private staff-only remarks on client accounts." },
      { id: "employee_portal", categoryId: "employee_staff", name: "Employee portal", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Complete custom portal for internal team operations.", isPopular: true }
    ]
  },
  {
    id: "customer_retention",
    name: "8. Customer Retention",
    shortName: "Retention & Loyalty",
    icon: "🎁",
    displayOrder: 8,
    description: "Loyalty points, referral programs, VIP subscriptions, and automated rebooking reminders.",
    features: [
      { id: "loyalty_points", categoryId: "customer_retention", name: "Loyalty points", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Earn reward points on every ₹100 spent.", isPopular: true },
      { id: "loyalty_tiers", categoryId: "customer_retention", name: "Loyalty tiers", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Silver, Gold, and Platinum tier perks." },
      { id: "rewards_system", categoryId: "customer_retention", name: "Rewards system", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Redeem points for discounts or free gifts at checkout." },
      { id: "referral_program", categoryId: "customer_retention", name: "Referral program", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "'Give ₹200, Get ₹200' referral link generator." },
      { id: "retention_referral_tracking", categoryId: "customer_retention", name: "Referral tracking", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Dashboard showing top referring ambassadors." },
      { id: "membership_system", categoryId: "customer_retention", name: "Membership system", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Recurring paid VIP membership club." },
      { id: "subscription_system", categoryId: "customer_retention", name: "Subscription system", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Automated monthly recurring billing subscription." },
      { id: "member_dashboard", categoryId: "customer_retention", name: "Member dashboard", priceInr: 2500, priceUsd: 40, priceType: "flat", description: "VIP portal with exclusive downloads and content." },
      { id: "member_only_content", categoryId: "customer_retention", name: "Member-only content", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Lock premium articles or video tutorials behind paywall." },
      { id: "member_pricing", categoryId: "customer_retention", name: "Member pricing", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Automatic member-only price badges across catalog." },
      { id: "birthday_offers", categoryId: "customer_retention", name: "Birthday offers", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Automated celebratory coupon sent on client birthdays." },
      { id: "retention_personalized_offers", categoryId: "customer_retention", name: "Personalized offers", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Discounts tailored to past purchasing behavior." },
      { id: "reorder_system", categoryId: "customer_retention", name: "Reorder system", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "1-click reorder button in client purchase history." },
      { id: "rebooking_system", categoryId: "customer_retention", name: "Rebooking system", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Automated 'Time for your next appointment' notification." },
      { id: "customer_reminders", categoryId: "customer_retention", name: "Customer reminders", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Service maintenance and annual renewal reminders." },
      { id: "retention_automated_followups", categoryId: "customer_retention", name: "Automated follow-ups", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Post-purchase check-in message flows." },
      { id: "review_requests", categoryId: "customer_retention", name: "Review requests", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Automated WhatsApp prompt asking for Google 5-star review." },
      { id: "win_back_campaigns", categoryId: "customer_retention", name: "Win-back campaigns", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Re-engage customers who haven't ordered in 60 days." }
    ]
  },
  {
    id: "communication",
    name: "9. Communication",
    shortName: "Communication",
    icon: "💬",
    displayOrder: 9,
    description: "Live chat, WhatsApp chatbots, SMS alerts, automated email sequences, and push alerts.",
    features: [
      { id: "comm_contact_form", categoryId: "communication", name: "Contact form", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Standard inquiry form with instant email delivery." },
      { id: "comm_email_notifications", categoryId: "communication", name: "Email notifications", priceInr: 500, priceUsd: 10, priceType: "flat", description: "HTML branded transactional emails." },
      { id: "comm_whatsapp_integration", categoryId: "communication", name: "WhatsApp integration", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Floating WhatsApp button with customer greetings.", isPopular: true },
      { id: "comm_whatsapp_notifications", categoryId: "communication", name: "WhatsApp notifications", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Automated order & booking updates on WhatsApp." },
      { id: "whatsapp_chatbot", categoryId: "communication", name: "WhatsApp chatbot", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Automated menu-driven WhatsApp bot for FAQs & bookings." },
      { id: "live_chat", categoryId: "communication", name: "Live chat", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Tawk.to / Crisp / Intercom live customer support widget." },
      { id: "comm_ai_chatbot", categoryId: "communication", name: "AI chatbot", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Smart AI conversational assistant trained on business docs.", isPopular: true },
      { id: "comm_sms_notifications", categoryId: "communication", name: "SMS notifications", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Transactional SMS OTP and shipping alerts." },
      { id: "comm_push_notifications", categoryId: "communication", name: "Push notifications", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Browser push announcements for flash sales." },
      { id: "comm_newsletter", categoryId: "communication", name: "Newsletter", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Subscriber list manager and HTML broadcast." },
      { id: "automated_emails", categoryId: "communication", name: "Automated emails", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Welcome email series & onboarding nurture sequence." },
      { id: "automated_whatsapp_messages", categoryId: "communication", name: "Automated WhatsApp messages", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Scheduled WhatsApp follow-ups after service." },
      { id: "comm_appointment_reminders", categoryId: "communication", name: "Appointment reminders", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Timely WhatsApp & SMS appointment notifications." },
      { id: "comm_order_notifications", categoryId: "communication", name: "Order notifications", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Instant order confirmation receipts." },
      { id: "comm_delivery_notifications", categoryId: "communication", name: "Delivery notifications", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "'Out for delivery' real-time dispatch alerts." },
      { id: "internal_notifications", categoryId: "communication", name: "Internal notifications", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Slack / Telegram webhook alerts to internal team." }
    ]
  },
  {
    id: "ai_features",
    name: "10. AI Features",
    shortName: "AI Copilots & GenAI",
    icon: "🧠",
    displayOrder: 10,
    description: "Gemini & OpenAI intelligent copilots, automated proposals, search, and document AI.",
    features: [
      { id: "ai_chatbot", categoryId: "ai_features", name: "AI chatbot", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Streaming Gemini/OpenAI chat assistant grounded in your data.", isPopular: true },
      { id: "ai_faq_assistant", categoryId: "ai_features", name: "AI FAQ assistant", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Instant intelligent answers synthesized from company policies." },
      { id: "ai_product_assistant", categoryId: "ai_features", name: "AI product assistant", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Guides customers to the exact right product based on their needs." },
      { id: "ai_service_recommendation", categoryId: "ai_features", name: "AI service recommendation", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Suggests the best service package based on client problem description." },
      { id: "ai_search", categoryId: "ai_features", name: "AI search", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Vector semantic search matching concepts and intent, not just keywords." },
      { id: "ai_quotation_generation", categoryId: "ai_features", name: "AI quotation generation", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Generates custom price estimate PDFs based on user input.", isPopular: true },
      { id: "ai_proposal_generation", categoryId: "ai_features", name: "AI proposal generation", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Drafts client project proposal text automatically." },
      { id: "ai_email_generation", categoryId: "ai_features", name: "AI email generation", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Drafts personalized sales outreach and responses." },
      { id: "ai_customer_support", categoryId: "ai_features", name: "AI customer support", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Resolves 80% of customer support tickets automatically." },
      { id: "ai_lead_qualification", categoryId: "ai_features", name: "AI lead qualification", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Conversational bot that asks budget and timeline before booking." },
      { id: "ai_lead_scoring", categoryId: "ai_features", name: "AI lead scoring", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Predicts close probability for incoming prospects." },
      { id: "ai_appointment_assistant", categoryId: "ai_features", name: "AI appointment assistant", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Conversational appointment booking through natural language." },
      { id: "ai_content_generation", categoryId: "ai_features", name: "AI content generation", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "1-click blog post and landing page copy generator." },
      { id: "ai_product_descriptions", categoryId: "ai_features", name: "AI product descriptions", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Generates SEO-rich product descriptions from image and specs." },
      { id: "ai_personalization", categoryId: "ai_features", name: "AI personalization", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Dynamically shifts homepage content based on visitor persona." },
      { id: "ai_recommendation_engine", categoryId: "ai_features", name: "AI recommendation engine", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Machine learning collaborative filtering for e-commerce." },
      { id: "ai_document_processing", categoryId: "ai_features", name: "AI document processing", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Extracts key data from uploaded PDF receipts, IDs, or forms." },
      { id: "ai_image_generation_integration", categoryId: "ai_features", name: "AI image generation integration", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Generates custom product mockup visuals on demand." },
      { id: "ai_voice_assistant", categoryId: "ai_features", name: "AI voice assistant", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Speech-to-text and text-to-speech voice interaction interface." },
      { id: "ai_powered_search_filtering", categoryId: "ai_features", name: "AI-powered search/filtering", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Natural language query bar ('Show red dresses under ₹2000')." }
    ]
  },
  {
    id: "interactive_features",
    name: "11. Advanced Interactive Features",
    shortName: "Interactive & 3D",
    icon: "✨",
    displayOrder: 11,
    description: "Interactive calculators, 3D WebGL viewers, custom configurators, and customer portals.",
    features: [
      { id: "interactive_calculator", categoryId: "interactive_features", name: "Interactive calculator", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Custom pricing/estimation slider calculator.", isPopular: true },
      { id: "roi_calculator", categoryId: "interactive_features", name: "ROI calculator", priceInr: 2500, priceUsd: 40, priceType: "flat", description: "Demonstrates cost savings and return on investment." },
      { id: "loan_emi_calculator", categoryId: "interactive_features", name: "Loan/EMI calculator", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Interest rate & monthly installment computation." },
      { id: "price_calculator", categoryId: "interactive_features", name: "Price calculator", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Dynamic service dimension and volume cost estimator." },
      { id: "quote_calculator", categoryId: "interactive_features", name: "Quote calculator", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Step-by-step interactive project scope quote builder." },
      { id: "product_configurator", categoryId: "interactive_features", name: "Product configurator", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Modular customizer (colors, materials, components, live preview)." },
      { id: "service_configurator", categoryId: "interactive_features", name: "Service configurator", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Build-your-own custom service package selector." },
      { id: "interactive_comparison", categoryId: "interactive_features", name: "Interactive comparison", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Interactive product difference highlighter." },
      { id: "interactive_map", categoryId: "interactive_features", name: "Interactive map", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Custom styled map with interactive regional pins." },
      { id: "interactive_store_locator", categoryId: "interactive_features", name: "Store locator", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Filter stores by services offered and operating hours." },
      { id: "interactive_timeline", categoryId: "interactive_features", name: "Interactive timeline", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Scroll-triggered history and roadmap progression." },
      { id: "interactive_charts", categoryId: "interactive_features", name: "Interactive charts", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Chart.js / Recharts data graphs with hover tooltips." },
      { id: "interactive_customer_dashboard", categoryId: "interactive_features", name: "Customer dashboard", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Full client portal with active projects and billing." },
      { id: "vendor_dashboard", categoryId: "interactive_features", name: "Vendor dashboard", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Supplier portal to upload inventory and manage payouts." },
      { id: "interactive_employee_portal", categoryId: "interactive_features", name: "Employee portal", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Staff dashboard for internal documents and roster." },
      { id: "vendor_portal", categoryId: "interactive_features", name: "Vendor portal", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Third-party partner order fulfillment portal." },
      { id: "partner_portal", categoryId: "interactive_features", name: "Partner portal", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Distributor & franchise resource hub." },
      { id: "custom_user_portal", categoryId: "interactive_features", name: "Custom user portal", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Tailored portal architecture matching specific business workflow." },
      { id: "threejs_3d_product_viewer", categoryId: "interactive_features", name: "3D product viewer", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Interactive 360-degree 3D model orbit viewer in Three.js.", isPopular: true },
      { id: "webgl_experience", categoryId: "interactive_features", name: "3D/WebGL experience", priceInr: 8000, priceUsd: 120, priceType: "flat", description: "Full-page immersive 3D WebGL world and physics.", isPopular: true },
      { id: "product_visualization", categoryId: "interactive_features", name: "Interactive product visualization", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Exploded 3D parts view with annotation hotspots." },
      { id: "virtual_showroom", categoryId: "interactive_features", name: "Virtual showroom", priceInr: 8000, priceUsd: 120, priceType: "flat", description: "Walk-through digital 3D store with clickable products." },
      { id: "virtual_tour", categoryId: "interactive_features", name: "Virtual tour", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "360-degree panoramic virtual property or clinic tour." }
    ]
  },
  {
    id: "multi_location",
    name: "12. Multi-business / Multi-location",
    shortName: "Multi-Location & Brands",
    icon: "🏢",
    displayOrder: 12,
    description: "Multi-branch setups, separate brand catalogs, centralized backend, and location pages.",
    features: [
      { id: "multi_location_system", categoryId: "multi_location", name: "Multi-location system", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Architecture supporting multiple branches under one domain.", isPopular: true },
      { id: "location_specific_pages", categoryId: "multi_location", name: "Location-specific pages", priceInr: 1000, priceUsd: 15, priceType: "per_location", unitLabel: "per location", defaultQty: 3, minQty: 1, maxQty: 50, description: "Dedicated SEO landing page for each city or branch." },
      { id: "location_specific_services", categoryId: "multi_location", name: "Location-specific services", priceInr: 1000, priceUsd: 15, priceType: "per_location", unitLabel: "per location", defaultQty: 2, minQty: 1, maxQty: 50, description: "Varying services menu available only at specific branches." },
      { id: "location_specific_pricing", categoryId: "multi_location", name: "Location-specific pricing", priceInr: 1000, priceUsd: 15, priceType: "per_location", unitLabel: "per location", defaultQty: 2, minQty: 1, maxQty: 50, description: "Tiered pricing based on city (Tier 1 vs Tier 2 cities)." },
      { id: "location_specific_staff", categoryId: "multi_location", name: "Location-specific staff", priceInr: 1500, priceUsd: 25, priceType: "per_location", unitLabel: "per location", defaultQty: 2, minQty: 1, maxQty: 50, description: "Filter staff directory and bookings by branch." },
      { id: "location_specific_bookings", categoryId: "multi_location", name: "Location-specific bookings", priceInr: 2000, priceUsd: 30, priceType: "per_location", unitLabel: "per location", defaultQty: 2, minQty: 1, maxQty: 50, description: "Appointment scheduling routed to local branch calendars." },
      { id: "location_specific_inventory", categoryId: "multi_location", name: "Location-specific inventory", priceInr: 2000, priceUsd: 30, priceType: "per_location", unitLabel: "per location", defaultQty: 2, minQty: 1, maxQty: 50, description: "Stock availability tracked across local retail stores." },
      { id: "location_specific_contact_info", categoryId: "multi_location", name: "Location-specific contact info", priceInr: 500, priceUsd: 10, priceType: "per_location", unitLabel: "per location", defaultQty: 2, minQty: 1, maxQty: 50, description: "Direct branch phone numbers, manager emails, and maps." },
      { id: "location_specific_seo", categoryId: "multi_location", name: "Location-specific SEO", priceInr: 1000, priceUsd: 15, priceType: "per_location", unitLabel: "per location", defaultQty: 3, minQty: 1, maxQty: 50, description: "Local schema and city keyword optimization." },
      { id: "multi_brand_architecture", categoryId: "multi_location", name: "Multi-brand architecture", priceInr: 8000, priceUsd: 120, priceType: "flat", description: "Manage multiple sibling brands under single codebase.", isPopular: true },
      { id: "centralized_backend", categoryId: "multi_location", name: "Centralized backend", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Single admin hub to manage all branches and brands." },
      { id: "separate_brand_catalogs", categoryId: "multi_location", name: "Separate brand catalogs", priceInr: 2000, priceUsd: 30, priceType: "per_brand", unitLabel: "per brand", defaultQty: 2, minQty: 1, maxQty: 10, description: "Distinct product lines with separated styling." },
      { id: "separate_brand_pages", categoryId: "multi_location", name: "Separate brand pages", priceInr: 1500, priceUsd: 25, priceType: "per_brand", unitLabel: "per brand", defaultQty: 2, minQty: 1, maxQty: 10, description: "Dedicated microsite landing per brand." },
      { id: "separate_campaigns", categoryId: "multi_location", name: "Separate campaigns", priceInr: 2000, priceUsd: 30, priceType: "per_brand", unitLabel: "per brand", defaultQty: 2, minQty: 1, maxQty: 10, description: "Isolated analytics pixels and ad funnels per brand." },
      { id: "separate_whatsapp_channels", categoryId: "multi_location", name: "Separate WhatsApp channels", priceInr: 1000, priceUsd: 15, priceType: "per_brand", unitLabel: "per brand", defaultQty: 2, minQty: 1, maxQty: 10, description: "Route inquiries to distinct brand phone numbers." },
      { id: "multi_brand_admin", categoryId: "multi_location", name: "Multi-brand admin", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Switch between brands with 1-click in admin header." }
    ]
  },
  {
    id: "integrations",
    name: "13. Integrations",
    shortName: "API Integrations",
    icon: "🔌",
    displayOrder: 13,
    description: "Payment gateways, CRMs, ERPs, accounting software, social APIs, and webhooks.",
    features: [
      { id: "int_payment_gateway", categoryId: "integrations", name: "Payment gateway", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Razorpay / Stripe / PayU integration.", isPopular: true },
      { id: "int_whatsapp", categoryId: "integrations", name: "WhatsApp", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "WhatsApp Business API connection." },
      { id: "int_google_maps", categoryId: "integrations", name: "Google Maps", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Google Maps JavaScript API key and embed." },
      { id: "int_google_analytics", categoryId: "integrations", name: "Google Analytics (GA4)", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Google Analytics 4 setup with custom events." },
      { id: "int_google_search_console", categoryId: "integrations", name: "Google Search Console", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Search console indexing verification and telemetry." },
      { id: "int_meta_pixel", categoryId: "integrations", name: "Meta Pixel", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Meta Conversions API + client pixel setup." },
      { id: "int_google_ads", categoryId: "integrations", name: "Google Ads", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Google Ads conversion tag installation." },
      { id: "int_email_service", categoryId: "integrations", name: "Email service", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Resend / SendGrid / Postmark transactional API." },
      { id: "int_sms_provider", categoryId: "integrations", name: "SMS provider", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Twilio / Gupshup / MSG91 SMS gateway." },
      { id: "int_shipping_provider", categoryId: "integrations", name: "Shipping provider", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Shiprocket / Delhivery / Bluedart shipping API.", isPopular: true },
      { id: "int_crm", categoryId: "integrations", name: "CRM", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "HubSpot / Salesforce / Zoho CRM contact sync." },
      { id: "int_accounting_software", categoryId: "integrations", name: "Accounting software", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "QuickBooks / Zoho Books / Tally invoice sync." },
      { id: "int_inventory_software", categoryId: "integrations", name: "Inventory software", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Unicommerce / Increff real-time stock sync." },
      { id: "int_erp", categoryId: "integrations", name: "ERP", priceInr: 5000, priceUsd: 75, priceType: "starting_at", unitLabel: "starts at", description: "SAP / Oracle / ERPNext enterprise integration." },
      { id: "int_pos", categoryId: "integrations", name: "POS (Point of Sale)", priceInr: 4000, priceUsd: 60, priceType: "flat", description: "Petpooja / Posist / Square POS menu and order sync." },
      { id: "int_calendar", categoryId: "integrations", name: "Calendar (Google / Outlook)", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Two-way Google Calendar / Outlook sync." },
      { id: "int_zoom_meet", categoryId: "integrations", name: "Zoom/Meet", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Auto-generates Zoom / Google Meet link for bookings." },
      { id: "int_newsletter_platform", categoryId: "integrations", name: "Newsletter platform", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Mailchimp / Beehiiv / ConvertKit audience sync." },
      { id: "int_social_media_apis", categoryId: "integrations", name: "Social media APIs", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Instagram Graph API / YouTube Data API feeds." },
      { id: "int_external_api", categoryId: "integrations", name: "External API", priceInr: 3000, priceUsd: 45, priceType: "starting_at", unitLabel: "starts at", description: "Custom third-party REST / GraphQL API integration." },
      { id: "int_custom_api_integration", categoryId: "integrations", name: "Custom API integration", priceInr: 3000, priceUsd: 45, priceType: "starting_at", unitLabel: "starts at", description: "Bespoke webhook listeners and payload transformation." },
      { id: "int_webhooks", categoryId: "integrations", name: "Webhooks", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Incoming & outgoing event webhooks (e.g. Zapier / Make)." },
      { id: "int_api_development", categoryId: "integrations", name: "API development", priceInr: 3000, priceUsd: 45, priceType: "starting_at", unitLabel: "starts at", description: "Custom REST endpoints to expose data to external apps." }
    ]
  },
  {
    id: "security_infrastructure",
    name: "14. Security & Infrastructure",
    shortName: "Security & Hosting",
    icon: "🛡️",
    displayOrder: 14,
    description: "Hosting setup, SSL, automated backups, speed tuning, 2FA, and performance optimization.",
    features: [
      { id: "domain_setup", categoryId: "security_infrastructure", name: "Domain setup", priceInr: 500, priceUsd: 10, priceType: "flat", description: "DNS record configuration (A, CNAME, TXT, MX)." },
      { id: "hosting_setup", categoryId: "security_infrastructure", name: "Hosting setup", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Vercel / AWS / VPS server environment deployment.", isPopular: true },
      { id: "ssl", categoryId: "security_infrastructure", name: "SSL", priceInr: 500, priceUsd: 10, priceType: "flat", description: "HTTPS Let's Encrypt / Cloudflare SSL certificate." },
      { id: "cdn", categoryId: "security_infrastructure", name: "CDN", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Cloudflare global edge content delivery network." },
      { id: "database_setup", categoryId: "security_infrastructure", name: "Database setup", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Supabase PostgreSQL database provisioning with tables." },
      { id: "database_backups", categoryId: "security_infrastructure", name: "Database backups", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Scheduled database snapshot storage." },
      { id: "automated_backups", categoryId: "security_infrastructure", name: "Automated backups", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Daily automated code and data cloud backups." },
      { id: "security_setup", categoryId: "security_infrastructure", name: "Security setup", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Security headers (CSP, HSTS, X-Frame-Options)." },
      { id: "spam_protection", categoryId: "security_infrastructure", name: "Spam protection", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Honeypot fields and bot submission blockers." },
      { id: "captcha", categoryId: "security_infrastructure", name: "CAPTCHA", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Cloudflare Turnstile / Google reCAPTCHA v3." },
      { id: "rate_limiting", categoryId: "security_infrastructure", name: "Rate limiting", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Prevents DDoS and API abuse on endpoints." },
      { id: "authentication_security", categoryId: "security_infrastructure", name: "Authentication security", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Bcrypt password hashing and secure HTTP-only cookies." },
      { id: "two_factor_auth", categoryId: "security_infrastructure", name: "Two-factor authentication (2FA)", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Authenticator app OTP 2FA for admin and user accounts." },
      { id: "admin_security", categoryId: "security_infrastructure", name: "Admin security", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Admin URL masking and brute-force lockout." },
      { id: "access_control", categoryId: "security_infrastructure", name: "Access control", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Row Level Security (RLS) policies on database." },
      { id: "error_monitoring", categoryId: "security_infrastructure", name: "Error monitoring", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Sentry / Highlight real-time bug crash telemetry." },
      { id: "uptime_monitoring", categoryId: "security_infrastructure", name: "Uptime monitoring", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "BetterStack 24/7 uptime check with SMS alerts." },
      { id: "performance_optimization", categoryId: "security_infrastructure", name: "Performance optimization", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Lighthouse 95+ speed tuning and bundle minification.", isPopular: true },
      { id: "image_optimization", categoryId: "security_infrastructure", name: "Image optimization", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Automatic Next/Image WebP/AVIF modern compression." },
      { id: "lazy_loading", categoryId: "security_infrastructure", name: "Lazy loading", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Deferred asset loading for sub-second first contentful paint." },
      { id: "caching", categoryId: "security_infrastructure", name: "Caching", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Server-side ISR and Redis / edge caching." },
      { id: "mobile_optimization", categoryId: "security_infrastructure", name: "Mobile optimization", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Touch target sizing, viewport tuning, and fluid typography." },
      { id: "pwa", categoryId: "security_infrastructure", name: "PWA (Progressive Web App)", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Installable web app with offline splash screen." },
      { id: "cookie_consent", categoryId: "security_infrastructure", name: "Cookie consent", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "GDPR / CCPA compliant cookie banner with opt-in." },
      { id: "privacy_controls", categoryId: "security_infrastructure", name: "Privacy controls", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "User data deletion and export privacy compliance." }
    ]
  },
  {
    id: "seo",
    name: "15. SEO (Search Engine Optimization)",
    shortName: "Advanced SEO",
    icon: "🔍",
    displayOrder: 15,
    description: "Granular on-page, local, technical, schema, and Core Web Vitals optimization.",
    features: [
      { id: "seo_basic_setup", categoryId: "seo", name: "Basic SEO setup", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Foundational search engine registration and verification.", isPopular: true },
      { id: "seo_page_title_opt", categoryId: "seo", name: "Page title optimization", priceInr: 500, priceUsd: 10, priceType: "flat", description: "CTR-focused title tags crafted per page." },
      { id: "seo_meta_descriptions", categoryId: "seo", name: "Meta descriptions", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Compelling 155-character meta snippet descriptions." },
      { id: "seo_keyword_research", categoryId: "seo", name: "Keyword research", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Identifies top search volume and low difficulty keywords." },
      { id: "seo_keyword_mapping", categoryId: "seo", name: "Keyword mapping", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Assigns primary and secondary keywords to specific pages." },
      { id: "seo_on_page", categoryId: "seo", name: "On-page SEO", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Header tags, keyword density, and internal linking." },
      { id: "seo_technical", categoryId: "seo", name: "Technical SEO", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Fixes crawl errors, redirect loops, and duplicate content." },
      { id: "seo_image", categoryId: "seo", name: "Image SEO", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Descriptive image filenames and image sitemap." },
      { id: "seo_alt_text", categoryId: "seo", name: "Alt text optimization", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Accessibility and SEO alt attributes on all media." },
      { id: "seo_internal_linking", categoryId: "seo", name: "Internal linking", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Topic clusters and contextual cross-linking." },
      { id: "seo_friendly_urls", categoryId: "seo", name: "SEO-friendly URLs", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Clean slugs without query strings." },
      { id: "seo_canonical_urls", categoryId: "seo", name: "Canonical URLs", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Prevents duplicate content penalties." },
      { id: "seo_sitemap", categoryId: "seo", name: "Sitemap", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Dynamic sitemap.xml indexing all valid URLs." },
      { id: "seo_robots_txt", categoryId: "seo", name: "Robots.txt", priceInr: 300, priceUsd: 5, priceType: "flat", description: "Configures Googlebot directives." },
      { id: "seo_schema_markup", categoryId: "seo", name: "Schema markup", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "JSON-LD structured data for Google rich snippets." },
      { id: "seo_local", categoryId: "seo", name: "Local SEO", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Optimizes site for 'near me' local intent searches.", isPopular: true },
      { id: "seo_location_specific", categoryId: "seo", name: "Location SEO", priceInr: 1000, priceUsd: 15, priceType: "per_location", unitLabel: "per location", defaultQty: 2, minQty: 1, maxQty: 50, description: "City-specific landing page optimization." },
      { id: "seo_google_search_console", categoryId: "seo", name: "Google Search Console", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Sitemap submission and index coverage audit." },
      { id: "seo_google_business_profile", categoryId: "seo", name: "Google Business Profile integration", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Embeds verified GMB profile & map citation." },
      { id: "seo_breadcrumbs", categoryId: "seo", name: "Breadcrumb SEO", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Hierarchical breadcrumb navigation markup." },
      { id: "seo_open_graph", categoryId: "seo", name: "Open Graph", priceInr: 500, priceUsd: 10, priceType: "flat", description: "High-resolution preview card for Facebook/LinkedIn." },
      { id: "seo_social_metadata", categoryId: "seo", name: "Social metadata", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Twitter Card meta tags." },
      { id: "seo_blog_structure", categoryId: "seo", name: "Blog SEO structure", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Author schema, reading time, and publish dates." },
      { id: "seo_product", categoryId: "seo", name: "Product SEO", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Product schema with price, availability & reviews." },
      { id: "seo_search_filter", categoryId: "seo", name: "Search/filter SEO", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Indexable filtered URLs without duplicate bloat." },
      { id: "seo_analytics", categoryId: "seo", name: "SEO analytics", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Search query and organic impression reports." },
      { id: "seo_core_web_vitals", categoryId: "seo", name: "Core Web Vitals optimization", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Passes Google LCP, FID, and CLS speed metrics." }
    ]
  },
  {
    id: "design_ux",
    name: "16. Design & UX Add-ons",
    shortName: "Design & UX Polish",
    icon: "🎨",
    displayOrder: 16,
    description: "Custom UI design systems, GSAP scroll choreographies, Three.js 3D scenes, and dark mode.",
    features: [
      { id: "custom_ui_design", categoryId: "design_ux", name: "Custom UI design", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Bespoke Figma UI/UX mockups tailored to brand essence.", isPopular: true },
      { id: "custom_homepage_design", categoryId: "design_ux", name: "Custom homepage design", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "High-impact signature hero layout design." },
      { id: "custom_dashboard_design", categoryId: "design_ux", name: "Custom dashboard design", priceInr: 2500, priceUsd: 40, priceType: "flat", description: "Ergonomic client/admin back-office interface." },
      { id: "mobile_specific_ui", categoryId: "design_ux", name: "Mobile-specific UI", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Bottom sheet navigation and touch drawer patterns." },
      { id: "responsive_redesign", categoryId: "design_ux", name: "Responsive redesign", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Overhaul desktop-only site to look stunning on phones." },
      { id: "design_system", categoryId: "design_ux", name: "Design system", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Color palette tokens, typography scales, and buttons." },
      { id: "custom_animations", categoryId: "design_ux", name: "Custom animations", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Smooth entry animations with Framer Motion." },
      { id: "scroll_animations", categoryId: "design_ux", name: "Scroll animations", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Lenis smooth scroll with pinned narrative sections." },
      { id: "micro_interactions", categoryId: "design_ux", name: "Micro-interactions", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Magnetic button snaps, ripple clicks, and hover glows." },
      { id: "page_transitions", categoryId: "design_ux", name: "Page transitions", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Seamless curtain swipe transitions between pages." },
      { id: "parallax_effects", categoryId: "design_ux", name: "Parallax effects", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Multi-layered depth scroll physics." },
      { id: "gsap_animations", categoryId: "design_ux", name: "GSAP animations", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "High-performance GreenSock timeline choreography.", isPopular: true },
      { id: "threejs_section", categoryId: "design_ux", name: "Three.js section", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Embedded 3D canvas banner with mouse particle interaction." },
      { id: "threejs_interactive_scene", categoryId: "design_ux", name: "Three.js interactive scene", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Full 3D spatial viewport with camera spline pathing." },
      { id: "ux_webgl_experience", categoryId: "design_ux", name: "WebGL experience", priceInr: 8000, priceUsd: 120, priceType: "flat", description: "Awwwards-tier custom GLSL shader liquid effects." },
      { id: "ux_3d_product_visualization", categoryId: "design_ux", name: "3D product visualization", priceInr: 5000, priceUsd: 75, priceType: "flat", description: "Photorealistic material shaders for luxury goods." },
      { id: "custom_icons", categoryId: "design_ux", name: "Custom icons", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Handcrafted SVG vector icon set." },
      { id: "custom_illustrations", categoryId: "design_ux", name: "Custom illustrations", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Custom digital 2D/3D brand illustrations." },
      { id: "dark_mode", categoryId: "design_ux", name: "Dark mode", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Smooth dark/light mode toggle with theme persistence." },
      { id: "accessibility_implementation", categoryId: "design_ux", name: "Accessibility implementation", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "WCAG 2.1 AA screen-reader & keyboard compliance." }
    ]
  },
  {
    id: "content_management",
    name: "17. Content Management",
    shortName: "CMS & Publishing",
    icon: "📝",
    displayOrder: 17,
    description: "Headless CMS, visual page editors, media libraries, draft/publish, and revision history.",
    features: [
      { id: "cms", categoryId: "content_management", name: "CMS", priceInr: 3000, priceUsd: 45, priceType: "flat", description: "Sanity / Supabase headless content management studio.", isPopular: true },
      { id: "page_editor", categoryId: "content_management", name: "Page editor", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Visual block editor to add and rearrange page sections." },
      { id: "product_editor", categoryId: "content_management", name: "Product editor", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Form to update product copy, variants, and gallery." },
      { id: "service_editor", categoryId: "content_management", name: "Service editor", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Manage service deliverables, pricing, and FAQs." },
      { id: "blog_cms", categoryId: "content_management", name: "Blog CMS", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Markdown / Rich text editor with scheduled publishing." },
      { id: "media_library", categoryId: "content_management", name: "Media library", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Upload, crop, and categorize image/video assets." },
      { id: "image_uploader", categoryId: "content_management", name: "Image uploader", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Drag-and-drop cloud image uploader with auto-resize." },
      { id: "video_uploader", categoryId: "content_management", name: "Video uploader", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Video upload with streaming CDN playback." },
      { id: "category_manager", categoryId: "content_management", name: "Category manager", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Organize taxonomy, parent-child trees, and slugs." },
      { id: "faq_manager", categoryId: "content_management", name: "FAQ manager", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Add, edit, reorder accordion questions." },
      { id: "testimonial_manager", categoryId: "content_management", name: "Testimonial manager", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Curate verified client feedback and logos." },
      { id: "team_manager", categoryId: "content_management", name: "Team manager", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Update staff photos, designations, and bios." },
      { id: "location_manager", categoryId: "content_management", name: "Location manager", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Update branch addresses, phones, and map links." },
      { id: "menu_navigation_manager", categoryId: "content_management", name: "Menu/navigation manager", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Reorder header dropdown links and footer columns." },
      { id: "homepage_section_manager", categoryId: "content_management", name: "Homepage section manager", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Toggle on/off specific homepage sections." },
      { id: "draft_publish_system", categoryId: "content_management", name: "Draft/publish system", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Preview changes in draft before pushing live." },
      { id: "scheduled_publishing", categoryId: "content_management", name: "Scheduled publishing", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Schedule posts or sale banners to go live at exact time." },
      { id: "revision_history", categoryId: "content_management", name: "Revision history", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Time-machine restore to previous content versions." }
    ]
  },
  {
    id: "hidden_essentials",
    name: "18. Things people forget to charge for",
    shortName: "Migration, DevOps & Care",
    icon: "📦",
    displayOrder: 18,
    description: "Migrations, data entry, domain/DNS, production setup, hourly development, and monthly retainers.",
    features: [
      { id: "website_migration", categoryId: "hidden_essentials", name: "Website migration", priceInr: 2000, priceUsd: 30, priceType: "flat", description: "Migrate existing WordPress / Wix / Shopify site to Next.js." },
      { id: "existing_data_migration", categoryId: "hidden_essentials", name: "Existing data migration", priceInr: 2000, priceUsd: 30, priceType: "starting_at", unitLabel: "starts at", description: "Export, cleanse, and re-import legacy database records." },
      { id: "product_data_entry", categoryId: "hidden_essentials", name: "Product data entry", priceInr: 20, priceUsd: 0.3, priceType: "per_product", unitLabel: "per product", defaultQty: 50, minQty: 1, maxQty: 1000, description: "Manual upload of product titles, SKUs, images & copy." },
      { id: "service_data_entry", categoryId: "hidden_essentials", name: "Service data entry", priceInr: 50, priceUsd: 0.75, priceType: "per_service", unitLabel: "per service", defaultQty: 10, minQty: 1, maxQty: 100, description: "Manual formatting and input of service details." },
      { id: "blog_migration", categoryId: "hidden_essentials", name: "Blog migration", priceInr: 100, priceUsd: 1.5, priceType: "per_post", unitLabel: "per post", defaultQty: 20, minQty: 1, maxQty: 500, description: "Re-formatting legacy articles with image optimization." },
      { id: "image_upload_optimization", categoryId: "hidden_essentials", name: "Image upload/optimization", priceInr: 20, priceUsd: 0.3, priceType: "per_image", unitLabel: "per image", defaultQty: 30, minQty: 1, maxQty: 500, description: "Batch cropping, resizing, and WebP compression." },
      { id: "content_formatting", categoryId: "hidden_essentials", name: "Content formatting", priceInr: 500, priceUsd: 10, priceType: "per_page", unitLabel: "per page", defaultQty: 5, minQty: 1, maxQty: 50, description: "Layout styling and typesetting client-provided copy." },
      { id: "existing_website_redesign", categoryId: "hidden_essentials", name: "Existing website redesign", priceInr: 3000, priceUsd: 45, priceType: "starting_at", unitLabel: "starts at", description: "Visual overhaul while preserving existing content." },
      { id: "existing_website_reconstruction", categoryId: "hidden_essentials", name: "Existing website reconstruction", priceInr: 5000, priceUsd: 75, priceType: "starting_at", unitLabel: "starts at", description: "Complete architectural rewrite from outdated codebases." },
      { id: "database_migration", categoryId: "hidden_essentials", name: "Database migration", priceInr: 3000, priceUsd: 45, priceType: "starting_at", unitLabel: "starts at", description: "MySQL / MongoDB schema migration to Supabase PostgreSQL." },
      { id: "domain_migration", categoryId: "hidden_essentials", name: "Domain migration", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Transfer domain registrar and update nameservers without downtime." },
      { id: "hosting_migration", categoryId: "hidden_essentials", name: "Hosting migration", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Move site to high-speed Vercel Edge hosting." },
      { id: "email_setup", categoryId: "hidden_essentials", name: "Email setup", priceInr: 500, priceUsd: 10, priceType: "per_account", unitLabel: "per account", defaultQty: 2, minQty: 1, maxQty: 20, description: "Google Workspace / Zoho business mailbox setup." },
      { id: "business_email_config", categoryId: "hidden_essentials", name: "Business email configuration", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "DKIM, SPF, and DMARC anti-spam verification records." },
      { id: "dns_configuration", categoryId: "hidden_essentials", name: "DNS configuration", priceInr: 500, priceUsd: 10, priceType: "flat", description: "Cloudflare / Godaddy DNS record management." },
      { id: "deployment", categoryId: "hidden_essentials", name: "Deployment", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "CI/CD automated pipeline linking GitHub to production." },
      { id: "production_setup", categoryId: "hidden_essentials", name: "Production setup", priceInr: 1500, priceUsd: 25, priceType: "flat", description: "Environment variables, production keys, and SSL." },
      { id: "environment_configuration", categoryId: "hidden_essentials", name: "Environment configuration", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Staging vs Production environment separation." },
      { id: "third_party_account_setup", categoryId: "hidden_essentials", name: "Third-party account setup", priceInr: 500, priceUsd: 10, priceType: "per_account", unitLabel: "per account", defaultQty: 2, minQty: 1, maxQty: 10, description: "Setup Razorpay, Cloudflare, Resend, or Google Cloud." },
      { id: "analytics_configuration", categoryId: "hidden_essentials", name: "Analytics configuration", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Configuring GA4 custom dimensions and funnel goals." },
      { id: "tracking_verification", categoryId: "hidden_essentials", name: "Tracking verification", priceInr: 1000, priceUsd: 15, priceType: "flat", description: "Testing and confirming pixel fires with Tag Assistant." },
      { id: "bug_fixing", categoryId: "hidden_essentials", name: "Bug fixing", priceInr: 500, priceUsd: 10, priceType: "per_hour", unitLabel: "per hour", defaultQty: 4, minQty: 1, maxQty: 50, description: "Troubleshooting pre-existing code issues." },
      { id: "custom_feature_dev", categoryId: "hidden_essentials", name: "Custom feature development", priceInr: 1000, priceUsd: 15, priceType: "per_hour", unitLabel: "per hour", defaultQty: 5, minQty: 1, maxQty: 100, description: "Hourly bespoke engineering for unique requirements." },
      { id: "major_feature_dev", categoryId: "hidden_essentials", name: "Major feature development", priceInr: 2000, priceUsd: 30, priceType: "starting_at", unitLabel: "starts at", description: "Complex full-stack feature engineering modules." },
      { id: "post_launch_changes", categoryId: "hidden_essentials", name: "Post-launch changes", priceInr: 500, priceUsd: 10, priceType: "per_hour", unitLabel: "per hour", defaultQty: 4, minQty: 1, maxQty: 50, description: "Minor copy, banner, and styling tweaks post-launch." },
      { id: "monthly_maintenance", categoryId: "hidden_essentials", name: "Monthly maintenance", priceInr: 1500, priceUsd: 25, priceType: "per_month", unitLabel: "per month", defaultQty: 3, minQty: 1, maxQty: 24, description: "Continuous security updates, weekly backups, and uptime checks.", isPopular: true },
      { id: "priority_support", categoryId: "hidden_essentials", name: "Priority support", priceInr: 2500, priceUsd: 40, priceType: "per_month", unitLabel: "per month", defaultQty: 3, minQty: 1, maxQty: 24, description: "4-hour SLA response time, emergency bug hotfixes." }
    ]
  }
];

// Flat Map of all features for O(1) lookups
export const ALL_FEATURES_MAP: Record<string, CatalogFeature> = (() => {
  const map: Record<string, CatalogFeature> = {};
  FEATURE_CATEGORIES.forEach((cat) => {
    cat.features.forEach((feat) => {
      map[feat.id] = feat;
    });
  });
  return map;
})();

// -----------------------------------------------------------------------------
// INDUSTRY STARTER PRESETS
// -----------------------------------------------------------------------------

export const INDUSTRY_PRESETS: IndustryPreset[] = [
  {
    id: "salon",
    name: "Salon, Spa & Wellness",
    icon: "💇‍♀️",
    tagline: "Appointment bookings, stylist selector, WhatsApp reminders & before/after gallery.",
    recommendedBasePriceInr: 5000,
    recommendedBasePriceUsd: 75,
    targetAudience: "Hair Salons, Spas, Nail Bars, Aesthetics Clinics",
    discountPercent: 20,
    defaultFeatureIds: [
      "homepage",
      "about_us",
      "services_page",
      "service_detail_page",
      "before_after_gallery",
      "team_directory",
      "contact_page",
      "whatsapp_integration",
      "opening_hours",
      "appointment_scheduling",
      "available_time_slots",
      "staff_selection",
      "whatsapp_booking_notifications",
      "booking_reminders",
      "review_requests",
      "seo_local",
      "google_business_integration"
    ],
    recommendedAddonIds: [
      "booking_deposits",
      "birthday_offers",
      "loyalty_points",
      "monthly_maintenance"
    ]
  },
  {
    id: "fashion",
    name: "Fashion & E-Commerce Store",
    icon: "👗",
    tagline: "Product catalog, variants, filters, cart, Razorpay checkout & GST invoice support.",
    recommendedBasePriceInr: 6000,
    recommendedBasePriceUsd: 90,
    targetAudience: "Apparel, Jewelry, Footwear, D2C Lifestyle Brands",
    discountPercent: 25,
    defaultFeatureIds: [
      "homepage",
      "product_catalog",
      "product_detail_page",
      "categories",
      "filters",
      "search",
      "product_variants",
      "cart",
      "checkout",
      "payment_gateway",
      "coupon_codes",
      "inventory_tracking",
      "gst_invoice_support",
      "whatsapp_lead_alerts",
      "meta_pixel",
      "seo_product"
    ],
    recommendedAddonIds: [
      "abandoned_cart_recovery",
      "wishlist",
      "product_data_entry",
      "threejs_3d_product_viewer",
      "monthly_maintenance"
    ]
  },
  {
    id: "clinic",
    name: "Doctor & Medical Clinic",
    icon: "🩺",
    tagline: "Doctor profiles, patient appointment slots, consultation fees, and local SEO.",
    recommendedBasePriceInr: 5500,
    recommendedBasePriceUsd: 80,
    targetAudience: "Dentists, Dermatologists, Pediatricians, Diagnostics",
    discountPercent: 20,
    defaultFeatureIds: [
      "homepage",
      "about_us",
      "services_page",
      "team_directory",
      "testimonials",
      "faq",
      "contact_page",
      "appointment_scheduling",
      "available_time_slots",
      "whatsapp_booking_notifications",
      "booking_reminders",
      "location_maps",
      "seo_local",
      "google_business_integration",
      "ssl",
      "hosting_setup"
    ],
    recommendedAddonIds: [
      "booking_payments",
      "ai_faq_assistant",
      "multiple_locations",
      "monthly_maintenance"
    ]
  },
  {
    id: "restaurant",
    name: "Restaurant, Bar & Cafe",
    icon: "🍽️",
    tagline: "Visual digital photo menu, table reservation calendar, online takeout ordering & Google Maps.",
    recommendedBasePriceInr: 5000,
    recommendedBasePriceUsd: 75,
    targetAudience: "Bistros, Fine Dining, Cloud Kitchens, Cafes, Bakeries",
    discountPercent: 20,
    defaultFeatureIds: [
      "homepage",
      "about_us",
      "gallery",
      "contact_page",
      "opening_hours",
      "whatsapp_integration",
      "online_ordering",
      "ecom_cart",
      "ecom_checkout",
      "payment_gateway",
      "pickup_option",
      "event_booking",
      "location_maps",
      "google_business_integration",
      "social_media_feed"
    ],
    recommendedAddonIds: [
      "int_pos",
      "holiday_notices",
      "loyalty_points",
      "monthly_maintenance"
    ]
  },
  {
    id: "real_estate",
    name: "Real Estate & B2B Manufacturer",
    icon: "🏢",
    tagline: "Property/Product showcase, instant quote builder, lead database, and CRM pipeline.",
    recommendedBasePriceInr: 6000,
    recommendedBasePriceUsd: 90,
    targetAudience: "Builders, Realtors, B2B Exporters, Industrial Manufacturers",
    discountPercent: 22,
    defaultFeatureIds: [
      "homepage",
      "about_us",
      "services_page",
      "portfolio",
      "case_studies",
      "contact_page",
      "lead_capture_form",
      "quote_request_form",
      "lead_database",
      "whatsapp_lead_alerts",
      "seo_setup",
      "technical_seo",
      "google_search_setup",
      "domain_setup",
      "hosting_setup"
    ],
    recommendedAddonIds: [
      "virtual_tour",
      "crm_integration",
      "interactive_calculator",
      "ai_quotation_generation",
      "monthly_maintenance"
    ]
  },
  {
    id: "freelancer",
    name: "Freelancer / Creative Studio",
    icon: "🎨",
    tagline: "Visual case studies, GSAP animations, consultation booking & dark mode.",
    recommendedBasePriceInr: 4500,
    recommendedBasePriceUsd: 65,
    targetAudience: "Designers, Photographers, Copywriters, Consultants",
    discountPercent: 15,
    defaultFeatureIds: [
      "homepage",
      "about_us",
      "portfolio",
      "case_studies",
      "pricing_packages",
      "testimonials",
      "contact_page",
      "whatsapp_integration",
      "custom_animations",
      "dark_mode",
      "seo_basic_setup",
      "hosting_setup"
    ],
    recommendedAddonIds: [
      "threejs_section",
      "consultation_request",
      "blog",
      "monthly_maintenance"
    ]
  },
  {
    id: "saas",
    name: "SaaS / Web Application",
    icon: "⚡",
    tagline: "Full-stack client portal, auth roles, Stripe/Razorpay billing & AI assistant.",
    recommendedBasePriceInr: 8000,
    recommendedBasePriceUsd: 120,
    targetAudience: "Software Companies, Digital Tools, Marketplaces, EdTech",
    discountPercent: 25,
    defaultFeatureIds: [
      "homepage",
      "pricing_packages",
      "comparison_tables",
      "customer_accounts",
      "login_signup",
      "customer_dashboard",
      "admin_dashboard",
      "role_based_access",
      "payment_gateway",
      "database_setup",
      "authentication_security",
      "ai_chatbot",
      "seo_setup",
      "performance_optimization"
    ],
    recommendedAddonIds: [
      "ai_search",
      "two_factor_auth",
      "int_webhooks",
      "priority_support"
    ]
  },
  {
    id: "custom",
    name: "Custom Bespoke Project",
    icon: "🛠️",
    tagline: "Start from scratch and choose exact atomic features for any custom business workflow.",
    recommendedBasePriceInr: 4000,
    recommendedBasePriceUsd: 60,
    targetAudience: "Any unique or hybrid business model",
    discountPercent: 15,
    defaultFeatureIds: [
      "homepage",
      "about_us",
      "contact_page",
      "whatsapp_integration",
      "domain_setup",
      "hosting_setup",
      "ssl"
    ],
    recommendedAddonIds: []
  }
];

// -----------------------------------------------------------------------------
// MATH & CALCULATION UTILITIES
// -----------------------------------------------------------------------------

export interface CalculationResult {
  basePriceInr: number;
  basePriceUsd: number;
  itemizedTotalInr: number;
  itemizedTotalUsd: number;
  subtotalInr: number; // base + itemized
  subtotalUsd: number;
  discountPercent: number;
  discountAmountInr: number;
  discountAmountUsd: number;
  finalTotalInr: number;
  finalTotalUsd: number;
  categoryBreakdowns: {
    categoryId: string;
    categoryName: string;
    icon: string;
    itemCount: number;
    subtotalInr: number;
    subtotalUsd: number;
    items: {
      feature: CatalogFeature;
      quantity: number;
      lineTotalInr: number;
      lineTotalUsd: number;
    }[];
  }[];
  totalSelectedItemsCount: number;
}

export function calculateQuoteSummary(
  selectedItems: Record<string, number>, // featureId -> quantity (0 if unselected, >=1 if selected)
  basePriceInr = 5000,
  basePriceUsd = 75,
  bundleDiscountPercent = 15
): CalculationResult {
  let itemizedTotalInr = 0;
  let itemizedTotalUsd = 0;
  let totalSelectedItemsCount = 0;

  const categoryMap: Record<
    string,
    {
      categoryId: string;
      categoryName: string;
      icon: string;
      itemCount: number;
      subtotalInr: number;
      subtotalUsd: number;
      items: {
        feature: CatalogFeature;
        quantity: number;
        lineTotalInr: number;
        lineTotalUsd: number;
      }[];
    }
  > = {};

  // Initialize category map
  FEATURE_CATEGORIES.forEach((cat) => {
    categoryMap[cat.id] = {
      categoryId: cat.id,
      categoryName: cat.name,
      icon: cat.icon,
      itemCount: 0,
      subtotalInr: 0,
      subtotalUsd: 0,
      items: []
    };
  });

  // Calculate each selected feature
  Object.entries(selectedItems).forEach(([featureId, qty]) => {
    if (qty <= 0) return;
    const feat = ALL_FEATURES_MAP[featureId];
    if (!feat) return;

    const lineTotalInr = feat.priceInr * qty;
    const lineTotalUsd = feat.priceUsd * qty;

    itemizedTotalInr += lineTotalInr;
    itemizedTotalUsd += lineTotalUsd;
    totalSelectedItemsCount += qty;

    const cat = categoryMap[feat.categoryId];
    if (cat) {
      cat.itemCount += qty;
      cat.subtotalInr += lineTotalInr;
      cat.subtotalUsd += lineTotalUsd;
      cat.items.push({
        feature: feat,
        quantity: qty,
        lineTotalInr,
        lineTotalUsd
      });
    }
  });

  const categoryBreakdowns = Object.values(categoryMap).filter(
    (cat) => cat.items.length > 0
  );

  const subtotalInr = basePriceInr + itemizedTotalInr;
  const subtotalUsd = basePriceUsd + itemizedTotalUsd;

  // Apply bundle discount (minimum 5 items for discount to trigger)
  const effectiveDiscount =
    totalSelectedItemsCount >= 4 ? bundleDiscountPercent : 0;
  const discountAmountInr = Math.round((subtotalInr * effectiveDiscount) / 100);
  const discountAmountUsd = Math.round((subtotalUsd * effectiveDiscount) / 100);

  const finalTotalInr = subtotalInr - discountAmountInr;
  const finalTotalUsd = subtotalUsd - discountAmountUsd;

  return {
    basePriceInr,
    basePriceUsd,
    itemizedTotalInr,
    itemizedTotalUsd,
    subtotalInr,
    subtotalUsd,
    discountPercent: effectiveDiscount,
    discountAmountInr,
    discountAmountUsd,
    finalTotalInr,
    finalTotalUsd,
    categoryBreakdowns,
    totalSelectedItemsCount
  };
}
