export const DEFAULT_ULIFE_DATA = {
  productivityModules: [
    {
      id: "homework",
      name: "Homework",
      type: "checklist",
      pinned: false,
      items: [
        { id: 1, text: "Complete CS homework assignment", done: false },
        { id: 2, text: "Read Chapter 5 for History", done: false },
      ],
    },
    {
      id: "todo",
      name: "To-Do",
      type: "checklist",
      pinned: false,
      items: [{ id: 3, text: "Buy groceries", done: false }],
    },
  ],

  opportunityModules: [
    {
      id: "linkedin",
      name: "LinkedIn",
      description: "Professional networking and job opportunities",
      stat: "5 new opportunities",
      url: "https://www.linkedin.com/jobs/",
      icon: "👥",
      pinned: false,
    },
    {
      id: "handshake",
      name: "Handshake",
      description: "College career network for students and recent grads",
      stat: "12 new postings",
      url: "https://joinhandshake.com/",
      icon: "💼",
      pinned: false,
    },
    {
      id: "indeed",
      name: "Indeed",
      description: "Job search engine with millions of listings",
      stat: "23 matches",
      url: "https://www.indeed.com/",
      icon: "📄",
      pinned: false,
    },
    {
      id: "github",
      name: "GitHub",
      description: "Showcase your projects and contribute to open source",
      stat: "3 repo updates",
      url: "https://github.com/",
      icon: "<>",
      pinned: false,
    },
    {
      id: "devpost",
      name: "Devpost",
      description: "Find and join hackathons to build your portfolio",
      stat: "4 upcoming hackathons",
      url: "https://devpost.com/",
      icon: "🏆",
      pinned: false,
    },
  ],

  habitModules: [
    { id: "mental-health", name: "Mental Health Check", type: "mood", mood: "", pinned: false },
    { id: "water", name: "Water Intake", type: "counter", value: 0, goal: 8, pinned: false },
    { id: "exercise", name: "Exercise", type: "counter", value: 0, goal: 30, pinned: false },
    {
      id: "custom-habits",
      name: "Custom Habits",
      type: "checklist",
      pinned: false,
      items: [
        { id: 1, text: "Morning meditation", done: false },
        { id: 2, text: "Exercise 30 min", done: false },
        { id: 3, text: "Read for 20 min", done: false },
      ],
    },
  ],

  financeGroups: [
    {
      id: "roommate-budget",
      name: "Roommate Budget",
      type: "Shared Housing",
      pinned: false,
      members: ["You", "Alex", "Maya", "Jordan"],
      budget: 1800,
      goalName: "Monthly Rent & Bills",
      goalAmount: 1800,
      savedAmount: 1245,
      expenses: [
        { id: 1, name: "Rent", amount: 900, paidBy: "You", month: "Jan" },
        { id: 2, name: "Groceries", amount: 145, paidBy: "Alex", month: "Feb" },
        { id: 3, name: "Utilities", amount: 120, paidBy: "Maya", month: "Mar" },
      ],
      trends: [
        { month: "Jan", amount: 850 },
        { month: "Feb", amount: 970 },
        { month: "Mar", amount: 910 },
        { month: "Apr", amount: 1040 },
      ],
    },
  ],
};

export function loadULifeData() {
  const saved = localStorage.getItem("ulifeData");

  if (!saved) {
    localStorage.setItem("ulifeData", JSON.stringify(DEFAULT_ULIFE_DATA));
    return DEFAULT_ULIFE_DATA;
  }

  return JSON.parse(saved);
}

export function saveULifeData(data) {
  localStorage.setItem("ulifeData", JSON.stringify(data));
  window.dispatchEvent(new Event("ulifeDataUpdated"));
}