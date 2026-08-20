import { Request, Response } from 'express';

export const getExecutiveDashboardData = async (_req: Request, res: Response): Promise<void> => {
  const payload = {
    lastUpdated: new Date().toISOString().split('T')[0],
    executiveSummary: 'Sleepsia commands a 38.8% market share in the premium memory foam & cervical pillow category, maintaining strong brand positioning against Wakefit, SleepyCat, and The White Willow with an overall 4.6 average customer rating.',
    metrics: {
      totalSales14d: 14520,
      revenue14d: '₹1.42 Cr',
      averageRating: 4.6,
      returnRate: '1.2%'
    },
    competitorTrends: [
      { day: 'Day 1', Sleepsia: 1100, Wakefit: 950, SleepyCat: 600, WhiteWillow: 300 },
      { day: 'Day 2', Sleepsia: 1150, Wakefit: 1000, SleepyCat: 620, WhiteWillow: 310 },
      { day: 'Day 3', Sleepsia: 1080, Wakefit: 980, SleepyCat: 610, WhiteWillow: 305 },
      { day: 'Day 4', Sleepsia: 1200, Wakefit: 1050, SleepyCat: 650, WhiteWillow: 320 },
      { day: 'Day 5', Sleepsia: 1350, Wakefit: 1100, SleepyCat: 680, WhiteWillow: 330 },
      { day: 'Day 6', Sleepsia: 1400, Wakefit: 1120, SleepyCat: 700, WhiteWillow: 340 },
      { day: 'Day 7', Sleepsia: 1420, Wakefit: 1150, SleepyCat: 710, WhiteWillow: 335 }
    ],
    competitors: [
      {
        name: 'Sleepsia',
        marketShare: 38.8,
        rating: 4.6,
        pricePoint: '₹1,299 - ₹2,499',
        topSeller: 'Contour Cervical Memory Foam Pillow',
        color: '#2563eb'
      },
      {
        name: 'Wakefit',
        marketShare: 32.5,
        rating: 4.4,
        pricePoint: '₹999 - ₹1,899',
        topSeller: 'Hollow Fiber Sleeping Pillow',
        color: '#f97316'
      },
      {
        name: 'SleepyCat',
        marketShare: 18.2,
        rating: 4.3,
        pricePoint: '₹1,499 - ₹2,999',
        topSeller: 'CoolTEC Memory Foam Pillow',
        color: '#10b981'
      },
      {
        name: 'The White Willow',
        marketShare: 10.5,
        rating: 4.2,
        pricePoint: '₹1,199 - ₹2,199',
        topSeller: 'Ergonomic Orthopedic Bed Wedge Pillow',
        color: '#8b5cf6'
      }
    ],
    products: [
      {
        id: 'SL-01',
        name: 'Sleepsia Contour Cervical Memory Foam Pillow',
        platform: 'Amazon',
        currentStock: 1240,
        reorderLevel: 300,
        stockStatus: 'Healthy',
        rating: 4.8,
        dailyVelocity: 95
      },
      {
        id: 'SL-02',
        name: 'Sleepsia Bamboo Premium Sleeping Pillow',
        platform: 'Flipkart',
        currentStock: 180,
        reorderLevel: 250,
        stockStatus: 'Low Stock',
        rating: 4.7,
        dailyVelocity: 42
      },
      {
        id: 'SL-03',
        name: 'Sleepsia U-Shape Full Body Pregnancy Pillow',
        platform: 'Amazon',
        currentStock: 450,
        reorderLevel: 150,
        stockStatus: 'Healthy',
        rating: 4.9,
        dailyVelocity: 28
      },
      {
        id: 'SL-04',
        name: 'Sleepsia Orthopedic Coccyx Seat Cushion',
        platform: 'Blinkit',
        currentStock: 45,
        reorderLevel: 100,
        stockStatus: 'Critical',
        rating: 4.5,
        dailyVelocity: 18
      },
      {
        id: 'SL-05',
        name: 'Sleepsia Memory Foam Car Neck Rest (Set of 2)',
        platform: 'Instamart',
        currentStock: 320,
        reorderLevel: 120,
        stockStatus: 'Healthy',
        rating: 4.6,
        dailyVelocity: 22
      }
    ]
  };

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(payload);
};