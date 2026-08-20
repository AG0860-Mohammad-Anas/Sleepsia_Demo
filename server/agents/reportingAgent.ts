export const getExecutiveDashboardData = async (req, res) => {
  const demoData = {
    lastUpdated: "2026-08-20",
    executiveSummary: "Sleepsia maintains a strong 38.8% market share in the orthopedic pillow segment, closely competing with Wakefit and SleepyCat.",
    metrics: {
      totalSales14d: 14520,
      revenue14d: "₹1.42 Cr",
      averageRating: 4.6,
      returns: "1.2%"
    },
    // REAL COMPETITOR DATA FOR LINE GRAPHS
    competitors: [
      {
        name: "Sleepsia",
        marketShare: 38.8,
        salesTrend: [1100, 1150, 1080, 1200, 1350, 1400, 1420] // 7-day trend
      },
      {
        name: "Wakefit",
        marketShare: 32.5,
        salesTrend: [950, 1000, 980, 1050, 1100, 1120, 1150]
      },
      {
        name: "SleepyCat",
        marketShare: 18.2,
        salesTrend: [600, 620, 610, 650, 680, 700, 710]
      },
      {
        name: "The White Willow",
        marketShare: 10.5,
        salesTrend: [300, 310, 305, 320, 330, 340, 335]
      }
    ],
    topProducts: [
      { name: "Sleepsia Contour Memory Foam Cervical Pillow", platform: "Amazon", stock: 1240, rating: 4.8 },
      { name: "Sleepsia Bamboo Premium Memory Foam Pillow", platform: "Flipkart", stock: 180, rating: 4.7 }
    ]
  };

  return res.json(demoData);
};