export const userCar = {
  id: "car-001",
  name: "BMW 5 Series",
  number: "MH 02 AB 1234",
  type: "Sedan" as const,
  society: "Prestige Towers",
  parkingSlot: "B2-045",
  healthScore: 92,
  image: "/images/car-silhouette.jpg",
}

export const cleaningStatus = {
  status: "cleaning" as const,
  progress: 68,
  cleanerName: "Rajesh Kumar",
  cleanerRating: 4.8,
  startTime: "07:15 AM",
  estimatedEnd: "07:45 AM",
  services: ["Exterior Wash", "Tire Shine", "Window Clean"],
}

export const subscriptionPlan = {
  name: "Premium Shield",
  price: 999,
  currency: "INR",
  period: "month",
  features: [
    "Daily exterior wash",
    "Weekly interior vacuum",
    "Tire shine included",
    "Before & after photos",
    "Priority scheduling",
    "Dedicated cleaner",
  ],
  active: true,
  daysRemaining: 18,
}

export const serviceHistory = [
  {
    id: "svc-001",
    date: "2026-02-25",
    time: "07:30 AM",
    type: "Exterior Wash",
    status: "completed" as const,
    rating: 5,
    cleaner: "Rajesh Kumar",
  },
  {
    id: "svc-002",
    date: "2026-02-24",
    time: "07:25 AM",
    type: "Full Service",
    status: "completed" as const,
    rating: 4,
    cleaner: "Rajesh Kumar",
  },
  {
    id: "svc-003",
    date: "2026-02-23",
    time: "07:40 AM",
    type: "Exterior Wash",
    status: "completed" as const,
    rating: 5,
    cleaner: "Amit Sharma",
  },
  {
    id: "svc-004",
    date: "2026-02-22",
    time: "07:20 AM",
    type: "Interior Clean",
    status: "completed" as const,
    rating: 4,
    cleaner: "Rajesh Kumar",
  },
  {
    id: "svc-005",
    date: "2026-02-21",
    time: "07:35 AM",
    type: "Exterior Wash",
    status: "missed" as const,
    rating: 0,
    cleaner: "Rajesh Kumar",
  },
  {
    id: "svc-006",
    date: "2026-02-20",
    time: "07:30 AM",
    type: "Full Service",
    status: "completed" as const,
    rating: 5,
    cleaner: "Rajesh Kumar",
  },
]

export const subscriptionPlans = [
  {
    id: "basic",
    name: "Daily Shield",
    price: 499,
    popular: false,
    features: [
      "Daily exterior wash",
      "Basic cleaning supplies",
      "Before & after photos",
      "Scheduled timing",
    ],
  },
  {
    id: "premium",
    name: "Premium Shield",
    price: 999,
    popular: true,
    features: [
      "Daily exterior wash",
      "Weekly interior vacuum",
      "Tire shine included",
      "Before & after photos",
      "Priority scheduling",
      "Dedicated cleaner",
    ],
  },
  {
    id: "elite",
    name: "Elite Shield",
    price: 1499,
    popular: false,
    features: [
      "Daily full service",
      "Weekly deep interior",
      "Tire & alloy treatment",
      "Before & after photos",
      "On-demand scheduling",
      "Dedicated premium cleaner",
      "Monthly ceramic coating",
    ],
  },
]

export const complaintIssues = [
  { id: "missed", label: "Cleaning was missed", icon: "clock" },
  { id: "quality", label: "Poor cleaning quality", icon: "alert" },
  { id: "late", label: "Cleaner arrived late", icon: "timer" },
  { id: "damage", label: "Vehicle damage reported", icon: "shield" },
  { id: "behavior", label: "Unprofessional behavior", icon: "user" },
  { id: "other", label: "Other issue", icon: "help" },
]
