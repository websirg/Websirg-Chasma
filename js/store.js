/**
 * Bhardwaj Chasma Ghar - Complete Eye Care & Optical Management System
 * Core Relational LocalStore Data Layer (Phase 1)
 */

const BCG_STORAGE_KEY = 'bcg_optical_system_v1';

const defaultDatabase = {
  settings: {
    name: "Bhardwaj Chasma Ghar",
    tagline: "Complete Eye Care & Optical Solutions",
    owner: "Dr. Alok Bhardwaj & Rajeev Bhardwaj",
    address: "Shop No. 12-14, Medical Complex, Main Market, Civil Lines, Kanpur, Uttar Pradesh - 208001",
    phone: "+91 98390 12345, +91 94150 67890",
    email: "care@bhardwajchasma.com",
    website: "https://bhardwajchasma.com",
    gstin: "09AAEFB1234K1ZV",
    invoicePrefix: "BCG-INV",
    jobPrefix: "BCG-",
    repairPrefix: "REP-",
    taxRate: 12, // 12% GST standard optical frames/lenses
    fittingCharge: 150,
    currency: "₹"
  },

  users: [
    {
      id: "USR-001",
      name: "Rajeev Bhardwaj",
      email: "admin@bhardwajchasma.com",
      phone: "9839012345",
      password: "admin",
      role: "admin",
      avatar: "assets/avatar-admin.png"
    },
    {
      id: "USR-002",
      name: "Dr. Alok Bhardwaj",
      designation: "Senior Consultant Ophthalmologist & Eye Surgeon (MBBS, MS)",
      regNo: "UP-MC-45920",
      email: "doctor@bhardwajchasma.com",
      phone: "9415067890",
      password: "doctor",
      role: "doctor",
      avatar: "assets/avatar-doctor.png"
    },
    {
      id: "USR-003",
      name: "Manoj Sharma",
      designation: "Senior Optometrist & Dispensing Specialist",
      email: "staff@bhardwajchasma.com",
      phone: "9876500001",
      password: "staff",
      role: "staff",
      permissions: [
        "view_patients", "add_patients", "view_prescriptions",
        "create_optical_jobs", "manage_frames", "manage_lenses",
        "create_invoice", "receive_payment", "manage_repairs"
      ],
      avatar: "assets/avatar-staff.png"
    },
    {
      id: "USR-004",
      name: "Rahul Sharma",
      email: "rahul.sharma@gmail.com",
      phone: "9876543210",
      password: "user",
      role: "customer",
      patientId: "P-1001",
      avatar: "assets/avatar-patient.png"
    },
    {
      id: "USR-005",
      name: "Priya Patel",
      email: "priya.patel@gmail.com",
      phone: "9812345678",
      password: "user",
      role: "customer",
      patientId: "P-1002",
      avatar: "assets/avatar-patient.png"
    }
  ],

  patients: [
    {
      id: "P-1001",
      name: "Rahul Sharma",
      phone: "9876543210",
      email: "rahul.sharma@gmail.com",
      age: 29,
      gender: "Male",
      dob: "1997-04-12",
      address: "14/82, Swaroop Nagar, Kanpur - 208002",
      emergencyContact: "9876543219 (Brother)",
      occupation: "Software Engineer",
      medicalHistory: "Astigmatism, Screen fatigue (8+ hrs digital work), No diabetes/HTN",
      allergies: "None",
      createdAt: "2026-09-15"
    },
    {
      id: "P-1002",
      name: "Priya Patel",
      phone: "9812345678",
      email: "priya.patel@gmail.com",
      age: 35,
      gender: "Female",
      dob: "1991-08-20",
      address: "Plot 42, Kakadeo Double Puliya, Kanpur - 208025",
      emergencyContact: "9812345670 (Spouse)",
      occupation: "College Professor",
      medicalHistory: "Early presbyopic reading difficulty, headaches after evening reading",
      allergies: "Ciprofloxacin allergy",
      createdAt: "2026-09-20"
    },
    {
      id: "P-1003",
      name: "Amit Verma",
      phone: "9839123456",
      email: "amit.verma@yahoo.com",
      age: 48,
      gender: "Male",
      dob: "1978-11-05",
      address: "M-Block, Kidwai Nagar, Kanpur - 208011",
      emergencyContact: "9839123450 (Wife)",
      occupation: "Chartered Accountant",
      medicalHistory: "Moderate Myopia with Presbyopia, controlled hypertension",
      allergies: "None",
      createdAt: "2026-09-28"
    },
    {
      id: "P-1004",
      name: "Sunita Devi",
      phone: "9415234567",
      email: "sunitadevi@gmail.com",
      age: 58,
      gender: "Female",
      dob: "1968-02-14",
      address: "45-B, Govind Nagar, Kanpur - 208006",
      emergencyContact: "9415234560 (Son)",
      occupation: "Homemaker",
      medicalHistory: "Bilateral Pseudophakia (Cataract Phaco post-op 2024), needing reading & computer add",
      allergies: "Sulfa drugs",
      createdAt: "2026-10-01"
    }
  ],

  examinations: [
    {
      id: "EX-2001",
      patientId: "P-1001",
      doctorName: "Dr. Alok Bhardwaj",
      date: "2026-10-06",
      rightEye: { sph: "-2.50", cyl: "-0.50", axis: "90", add: "" },
      leftEye: { sph: "-2.00", cyl: "-0.25", axis: "85", add: "" },
      pd: "62",
      distancePd: "62",
      nearPd: "60",
      visualAcuity: { right: "6/6 with Rx", left: "6/6 with Rx" },
      eyePressure: "14 mmHg (Normal both eyes)",
      observations: "Mild tear film break-up (computer vision syndrome). Cornea clear. Fundus within normal limits. Retinal vessels normal.",
      recommendations: "Recommend Blue-Cut Anti-Reflective 1.56/1.61 lenses with 20-20-20 screen habit. Artificial tear lubrication.",
      notes: "Annual checkup advised."
    },
    {
      id: "EX-2002",
      patientId: "P-1002",
      doctorName: "Dr. Alok Bhardwaj",
      date: "2026-10-07",
      rightEye: { sph: "+0.50", cyl: "-0.50", axis: "180", add: "+1.25" },
      leftEye: { sph: "+0.25", cyl: "-0.25", axis: "175", add: "+1.25" },
      pd: "61",
      distancePd: "61",
      nearPd: "58",
      visualAcuity: { right: "6/6, N6", left: "6/6, N6" },
      eyePressure: "15 mmHg",
      observations: "Incipient presbyopia. Clear media. Optic disc pink with healthy cup-disc ratio 0.3.",
      recommendations: "Progressive / Digital Anti-Fatigue lenses for seamless distance to reading transition.",
      notes: "Demonstrated progressive lens corridor to patient."
    }
  ],

  prescriptions: [
    {
      id: "RX-3001",
      patientId: "P-1001",
      examId: "EX-2001",
      doctorName: "Dr. Alok Bhardwaj",
      date: "2026-10-06",
      rightEye: { sph: "-2.50", cyl: "-0.50", axis: "90", add: "" },
      leftEye: { sph: "-2.00", cyl: "-0.25", axis: "85", add: "" },
      pd: "62",
      lensRecommendation: "Single Vision Blue-Cut Anti-Glare 1.56 Index (Digital Shield)",
      notes: "Wear continuously during computer and driving work.",
      medicines: [
        { name: "Tears Naturale II Lubricating Drops", dose: "1 drop", frequency: "1-1-1 (Thrice daily)", duration: "20 Days", instructions: "Instill in both eyes" },
        { name: "Cap. NutriEye-Gold (Lutein + Astaxanthin)", dose: "1 Cap", frequency: "0-1-0 (Once daily after lunch)", duration: "30 Days", instructions: "Swallow with water" }
      ],
      opticalStatus: "Sent to Optical",
      opticalJobId: "BCG-00125",
      createdAt: "2026-10-06T11:45:00"
    },
    {
      id: "RX-3002",
      patientId: "P-1002",
      examId: "EX-2002",
      doctorName: "Dr. Alok Bhardwaj",
      date: "2026-10-07",
      rightEye: { sph: "+0.50", cyl: "-0.50", axis: "180", add: "+1.25" },
      leftEye: { sph: "+0.25", cyl: "-0.25", axis: "175", add: "+1.25" },
      pd: "61",
      lensRecommendation: "Freeform Digital Progressive with Blue-Shield & Super-Hydrophobic Coating",
      notes: "Initial adaptation period of 3-5 days. Avoid quick head movements on stairs.",
      medicines: [
        { name: "Refresh Tears Preservative-Free", dose: "1 drop", frequency: "As needed (SOS)", duration: "1 Month", instructions: "For eye strain relief" }
      ],
      opticalStatus: "Sent to Optical",
      opticalJobId: "BCG-00126",
      createdAt: "2026-10-07T12:10:00"
    }
  ],

  frames: [
    {
      id: "FRM-101",
      brand: "Titan Eye+",
      model: "TF-2026 Matte Black",
      sku: "TTN-TF2026-BLK",
      category: "Frames",
      frameType: "Full Rim Rectangular",
      material: "Ultem / Lightweight TR-90",
      color: "Matte Black & Cobalt Accent",
      size: "Medium (52-17-142)",
      mrp: 2990,
      price: 2490,
      stock: 14,
      lowStockLimit: 3,
      warranty: "1 Year Manufacturer Warranty",
      description: "Ergonomic ultra-lightweight frame crafted from aerospace-grade Ultem. Sweat-proof and hypoallergenic.",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=700&q=80",
      featured: true
    },
    {
      id: "FRM-102",
      brand: "Ray-Ban",
      model: "Aviator Classic Optical",
      sku: "RB-6489-GLD",
      category: "Frames",
      frameType: "Full Rim Aviator",
      material: "Premium Metal Monel",
      color: "Polished Arista Gold",
      size: "Large (58-14-140)",
      mrp: 6890,
      price: 5990,
      stock: 6,
      lowStockLimit: 2,
      warranty: "2 Years Brand Warranty",
      description: "Iconic teardrop silhouette crafted with precision Italian metallurgy. Classic double bridge design.",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80",
      featured: true
    },
    {
      id: "FRM-103",
      brand: "Fastrack",
      model: "Street Urban Square",
      sku: "FT-9842-TRT",
      category: "Frames",
      frameType: "Full Rim Square",
      material: "Handcrafted Italian Acetate",
      color: "Havana Tortoise Shell",
      size: "Medium (50-18-140)",
      mrp: 2190,
      price: 1850,
      stock: 18,
      lowStockLimit: 4,
      warranty: "1 Year Warranty",
      description: "Youthful square silhouette with rich tortoise depth. Durable five-barrel steel hinges.",
      image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=700&q=80",
      featured: true
    },
    {
      id: "FRM-104",
      brand: "BCG Signature",
      model: "Executive Royal Titanium",
      sku: "BCG-EX7001-SLV",
      category: "Frames",
      frameType: "Semi-Rimless / Supra",
      material: "Pure Titanium & Memory Beta-Titanium",
      color: "Gunmetal Satin",
      size: "Medium-Large (53-18-145)",
      mrp: 4500,
      price: 3600,
      stock: 9,
      lowStockLimit: 2,
      warranty: "2 Years Guarantee",
      description: "Weightless 11-gram architectural titanium frame built for high-level boardroom comfort.",
      image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=700&q=80",
      featured: true
    },
    {
      id: "FRM-105",
      brand: "Vogue Eyewear",
      model: "Gleam Chic Cat-Eye",
      sku: "VG-5338-ROS",
      category: "Frames",
      frameType: "Full Rim Cat-Eye",
      material: "Premium Acetate",
      color: "Rose Gold Crystal Translucent",
      size: "Small-Medium (51-16-138)",
      mrp: 4990,
      price: 4190,
      stock: 5,
      lowStockLimit: 2,
      warranty: "1 Year Warranty",
      description: "Flattering feminine lift featuring delicate crystalline accents and polished temples.",
      image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=700&q=80",
      featured: false
    },
    {
      id: "FRM-106",
      brand: "Scott Eyewear",
      model: "Aero Rimless Feather",
      sku: "SCT-8890-SIL",
      category: "Frames",
      frameType: "Rimless 3-Piece",
      material: "Super-Elastic Memory Metal",
      color: "Silver Chrome",
      size: "Customizable Lens Shape",
      mrp: 3800,
      price: 3200,
      stock: 8,
      lowStockLimit: 2,
      warranty: "1 Year Warranty",
      description: "Minimalist three-piece rimless chassis. Lenses drilled with CNC millimeter accuracy.",
      image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=700&q=80",
      featured: false
    },
    {
      id: "FRM-107",
      brand: "Ray-Ban",
      model: "Wayfarer Polarized Sunglasses",
      sku: "RB-2140-POL",
      category: "Sunglasses",
      frameType: "Wayfarer",
      material: "Acetate",
      color: "Gloss Black / G-15 Green",
      size: "Standard 50mm",
      mrp: 9990,
      price: 8490,
      stock: 4,
      lowStockLimit: 2,
      warranty: "2 Years Brand Warranty",
      description: "The gold standard in protective eyewear. 100% UV400 and anti-reflective polarization.",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80",
      featured: true
    },
    {
      id: "FRM-108",
      brand: "BCG Juniors",
      model: "Kids Flexi-Shield Unbreakable",
      sku: "BCG-KD302-BLU",
      category: "Kids Frames",
      frameType: "Full Rim Flexible Oval",
      material: "BPA-Free Medical Silicone & Rubber",
      color: "Royal Blue & Lime Green",
      size: "Kids (45-15-125)",
      mrp: 1490,
      price: 1190,
      stock: 12,
      lowStockLimit: 3,
      warranty: "1 Year Replacement Warranty",
      description: "Virtually indestructible hinge-less frame with adjustable headband strap for active children.",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=700&q=80",
      featured: false
    }
  ],

  lenses: [
    {
      id: "LNS-201",
      brand: "Essilor Crizal",
      name: "Crizal Prevencia 1.56 Blue-Cut UV420",
      type: "Single Vision",
      index: "1.56",
      coatings: ["Blue Light Filter", "Anti-Glare", "Scratch Resistant", "Smudge Repellent", "UV420 Protection"],
      price: 2200,
      stock: 40,
      description: "Selective filtering of harmful blue-violet light while allowing beneficial blue-turquoise light."
    },
    {
      id: "LNS-202",
      brand: "Carl Zeiss",
      name: "Zeiss ClearView LotuTec 1.60 Hi-Index",
      type: "Single Vision",
      index: "1.60",
      coatings: ["Super Anti-Reflective", "Hydrophobic Lotus Effect", "Hard Coat", "UV Protect 400nm"],
      price: 3600,
      stock: 25,
      description: "Freeform clarity across the entire lens periphery with crystal razor-sharp vision."
    },
    {
      id: "LNS-203",
      brand: "BCG Optical Labs",
      name: "Digital Freeform Progressive 1.67 Ultra-Thin",
      type: "Progressive",
      index: "1.67",
      coatings: ["Wide Corridor Progressive", "Blue Shield", "Anti-Glare", "Scratch-Guard"],
      price: 5200,
      stock: 18,
      description: "Custom corridor surfacing tailored to Indian reading and driving habits with zero swim effect."
    },
    {
      id: "LNS-204",
      brand: "Essilor Transitions",
      name: "Transitions Gen 8 Photochromic 1.56 Grey",
      type: "Photochromic Day-Night",
      index: "1.56",
      coatings: ["Rapid Activation Outdoor Darkening", "Clear Indoors", "Blue-Cut", "Anti-Glare"],
      price: 4400,
      stock: 20,
      description: "Instant darkening under sunlight and crystal clarity inside rooms in under 90 seconds."
    },
    {
      id: "LNS-205",
      brand: "BCG Standard",
      name: "Green Anti-Glare Multicoated (ARC) 1.56",
      type: "Single Vision",
      index: "1.56",
      coatings: ["Anti-Reflective Coating", "UV380", "Hard Coated"],
      price: 1100,
      stock: 50,
      description: "Everyday economical anti-reflective lens ideal for budget prescriptions."
    }
  ],

  categories: [
    { id: "CAT-1", name: "Frames", count: 24 },
    { id: "CAT-2", name: "Sunglasses", count: 18 },
    { id: "CAT-3", name: "Reading Glasses", count: 12 },
    { id: "CAT-4", name: "Kids Frames", count: 10 },
    { id: "CAT-5", name: "Lens Products", count: 15 },
    { id: "CAT-6", name: "Accessories", count: 30 }
  ],

  brands: [
    { id: "BRD-1", name: "Titan Eye+", origin: "India", status: "Active" },
    { id: "BRD-2", name: "Ray-Ban", origin: "Italy", status: "Active" },
    { id: "BRD-3", name: "Fastrack", origin: "India", status: "Active" },
    { id: "BRD-4", name: "Essilor Crizal", origin: "France", status: "Active" },
    { id: "BRD-5", name: "Carl Zeiss", origin: "Germany", status: "Active" },
    { id: "BRD-6", name: "BCG Signature", origin: "In-House Optical", status: "Active" },
    { id: "BRD-7", name: "Vogue Eyewear", origin: "Italy", status: "Active" },
    { id: "BRD-8", name: "Scott Eyewear", origin: "USA", status: "Active" }
  ],

  optical_jobs: [
    {
      id: "BCG-00125",
      patientId: "P-1001",
      patientName: "Rahul Sharma",
      patientPhone: "9876543210",
      prescriptionId: "RX-3001",
      doctorId: "USR-002",
      doctorName: "Dr. Alok Bhardwaj",
      rxDetails: {
        right: { sph: "-2.50", cyl: "-0.50", axis: "90", add: "" },
        left: { sph: "-2.00", cyl: "-0.25", axis: "85", add: "" },
        pd: "62"
      },
      frameId: "FRM-101",
      frameName: "Titan Eye+ TF-2026 Matte Black",
      framePrice: 2490,
      lensId: "LNS-201",
      lensName: "Essilor Crizal Prevencia 1.56 Blue-Cut UV420",
      lensPrice: 2200,
      fittingCharge: 150,
      discount: 140,
      tax: 0,
      total: 4700,
      advance: 2000,
      due: 2700,
      paymentMethod: "UPI (Google Pay)",
      invoiceNumber: "BCG-INV-1025",
      createdAt: "2026-10-06 11:50",
      expectedDelivery: "2026-10-10",
      status: "Lens Processing",
      timeline: [
        { status: "Prescription Received", time: "06 Oct 2026, 11:45 AM", user: "Dr. Alok Bhardwaj", note: "Sent from OPD Room 1" },
        { status: "Frame Selected", time: "06 Oct 2026, 12:15 PM", user: "Manoj Sharma", note: "Frame Titan TF-2026 paired with Crizal Prevencia" },
        { status: "Lens Processing", time: "07 Oct 2026, 02:40 PM", user: "Optical Lab", note: "Automated edging and precision axis alignment 90/85" }
      ]
    },
    {
      id: "BCG-00126",
      patientId: "P-1002",
      patientName: "Priya Patel",
      patientPhone: "9812345678",
      prescriptionId: "RX-3002",
      doctorId: "USR-002",
      doctorName: "Dr. Alok Bhardwaj",
      rxDetails: {
        right: { sph: "+0.50", cyl: "-0.50", axis: "180", add: "+1.25" },
        left: { sph: "+0.25", cyl: "-0.25", axis: "175", add: "+1.25" },
        pd: "61"
      },
      frameId: "FRM-105",
      frameName: "Vogue Eyewear Gleam Chic Cat-Eye",
      framePrice: 4190,
      lensId: "LNS-203",
      lensName: "BCG Optical Labs Digital Freeform Progressive 1.67",
      lensPrice: 5200,
      fittingCharge: 150,
      discount: 340,
      tax: 0,
      total: 9200,
      advance: 5000,
      due: 4200,
      paymentMethod: "Credit Card (HDFC)",
      invoiceNumber: "BCG-INV-1026",
      createdAt: "2026-10-07 12:20",
      expectedDelivery: "2026-10-11",
      status: "Frame Selected",
      timeline: [
        { status: "Prescription Received", time: "07 Oct 2026, 12:10 PM", user: "Dr. Alok Bhardwaj", note: "Sent to optical department" },
        { status: "Frame Selected", time: "07 Oct 2026, 01:05 PM", user: "Manoj Sharma", note: "Vogue Cat-Eye frame matched with digital progressive corridor" }
      ]
    },
    {
      id: "BCG-00124",
      patientId: "P-1003",
      patientName: "Amit Verma",
      patientPhone: "9839123456",
      prescriptionId: "RX-2998",
      doctorId: "USR-002",
      doctorName: "Dr. Alok Bhardwaj",
      rxDetails: {
        right: { sph: "-3.75", cyl: "-1.00", axis: "100", add: "+1.75" },
        left: { sph: "-3.50", cyl: "-0.75", axis: "80", add: "+1.75" },
        pd: "64"
      },
      frameId: "FRM-104",
      frameName: "BCG Signature Executive Royal Titanium",
      framePrice: 3600,
      lensId: "LNS-202",
      lensName: "Zeiss ClearView LotuTec 1.60 Hi-Index",
      lensPrice: 3600,
      fittingCharge: 150,
      discount: 350,
      tax: 0,
      total: 7000,
      advance: 7000,
      due: 0,
      paymentMethod: "UPI (Paytm)",
      invoiceNumber: "BCG-INV-1024",
      createdAt: "2026-10-03 10:15",
      expectedDelivery: "2026-10-06",
      status: "Delivered",
      timeline: [
        { status: "Prescription Received", time: "03 Oct 2026, 10:15 AM", user: "Dr. Alok Bhardwaj", note: "Routine prescription" },
        { status: "Frame Selected", time: "03 Oct 2026, 11:00 AM", user: "Manoj Sharma", note: "Titanium Supra frame ordered" },
        { status: "Lens Processing", time: "04 Oct 2026, 03:00 PM", user: "Optical Lab", note: "Surfacing completed" },
        { status: "Fitting", time: "05 Oct 2026, 11:30 AM", user: "Optical Lab", note: "Nylon supra cord fitted" },
        { status: "Quality Check", time: "05 Oct 2026, 04:00 PM", user: "Manoj Sharma", note: "Lensometer check verified 100% accurate" },
        { status: "Ready", time: "05 Oct 2026, 05:00 PM", user: "Manoj Sharma", note: "Ready for pickup. Customer notified." },
        { status: "Delivered", time: "06 Oct 2026, 06:15 PM", user: "Manoj Sharma", note: "Collected by Mr. Verma. Fit and vision verified comfortable." }
      ]
    }
  ],

  repairs: [
    {
      id: "REP-00103",
      patientId: "P-1002",
      customerName: "Priya Patel",
      customerPhone: "9812345678",
      frameDescription: "Vogue Translucent Frame",
      problem: "Nose pad adjustment and temple polishing",
      condition: "Good condition",
      estimatedCost: 350,
      finalCost: 350,
      advance: 350,
      due: 0,
      paymentMethod: "UPI",
      receivedDate: new Date().toISOString().split('T')[0],
      expectedDelivery: new Date().toISOString().split('T')[0],
      staffName: "Manoj Sharma",
      status: "Ready",
      timeline: [
        { status: "Received", time: "Today 10:15 AM", user: "Manoj Sharma", note: "Frame deposited for polish" },
        { status: "Ready", time: "Today 11:30 AM", user: "Optical Tech", note: "Polished and ready" }
      ]
    },
    {
      id: "REP-00101",
      patientId: "P-1003",
      customerName: "Amit Verma",
      customerPhone: "9839123456",
      frameDescription: "Ray-Ban Aviator Gold Rimless (RB-3025)",
      problem: "Right spring hinge barrel screw missing; nose pad cracked",
      condition: "Slight temple spread, lenses scratch-free",
      estimatedCost: 450,
      finalCost: 400,
      advance: 200,
      due: 200,
      paymentMethod: "Cash",
      receivedDate: "2026-10-06",
      expectedDelivery: "2026-10-09",
      staffName: "Manoj Sharma",
      status: "Repairing",
      timeline: [
        { status: "Received", time: "06 Oct 2026, 10:30 AM", user: "Manoj Sharma", note: "Customer deposited frame at counter" },
        { status: "Inspection", time: "06 Oct 2026, 11:15 AM", user: "Optical Tech", note: "Hinge threads intact, silicone nose pads required" },
        { status: "Estimate", time: "06 Oct 2026, 11:45 AM", user: "Manoj Sharma", note: "Estimated ₹450 quoted" },
        { status: "Customer Approval", time: "06 Oct 2026, 12:00 PM", user: "Amit Verma", note: "Approved via counter consent" },
        { status: "Repairing", time: "07 Oct 2026, 04:30 PM", user: "Optical Tech", note: "Precision Swiss screw inserted, sonic cleaning done" }
      ]
    },
    {
      id: "REP-00102",
      patientId: "P-1004",
      customerName: "Sunita Devi",
      customerPhone: "9415234567",
      frameDescription: "Fastrack Oval Acetate Burgundy",
      problem: "Left temple loosened and nose bridge bent out of shape",
      condition: "Needs thermal ultrasonic alignment",
      estimatedCost: 250,
      finalCost: 250,
      advance: 250,
      due: 0,
      paymentMethod: "UPI",
      receivedDate: "2026-10-05",
      expectedDelivery: "2026-10-07",
      staffName: "Manoj Sharma",
      status: "Ready",
      timeline: [
        { status: "Received", time: "05 Oct 2026, 04:00 PM", user: "Manoj Sharma", note: "Frame received" },
        { status: "Inspection", time: "05 Oct 2026, 04:30 PM", user: "Optical Tech", note: "Acetate heater realignment needed" },
        { status: "Customer Approval", time: "05 Oct 2026, 04:35 PM", user: "Sunita Devi", note: "Instant approval given" },
        { status: "Repairing", time: "06 Oct 2026, 02:00 PM", user: "Optical Tech", note: "Bridge curvature restored" },
        { status: "Ready", time: "07 Oct 2026, 11:00 AM", user: "Manoj Sharma", note: "Quality checked and cleaned in protective pouch" }
      ]
    }
  ],

  invoices: [
    {
      id: "BCG-INV-1027",
      jobId: "BCG-00127",
      patientId: "P-1004",
      customerName: "Sunita Devi",
      customerPhone: "9415234567",
      customerAddress: "45-B, Govind Nagar, Kanpur",
      date: new Date().toISOString().split('T')[0],
      doctorName: "Dr. Alok Bhardwaj",
      prescriptionRef: "RX-3003",
      staffName: "Manoj Sharma",
      items: [
        { name: "Fastrack Street Urban Square (Tortoise)", qty: 1, rate: 1850, amount: 1850 },
        { name: "BCG Standard Green Anti-Glare ARC 1.56", qty: 1, rate: 1100, amount: 1100 },
        { name: "Automated Edging & Lens Fitting Charges", qty: 1, rate: 150, amount: 150 }
      ],
      subtotal: 3100,
      discount: 100,
      taxableAmount: 3000,
      cgst: 0,
      sgst: 0,
      grandTotal: 3000,
      advancePaid: 2000,
      dueAmount: 1000,
      paymentMethod: "UPI (Google Pay)",
      paymentStatus: "Partial",
      expectedDelivery: "Today / Ready"
    },
    {
      id: "BCG-INV-1025",
      jobId: "BCG-00125",
      patientId: "P-1001",
      customerName: "Rahul Sharma",
      customerPhone: "9876543210",
      customerAddress: "14/82, Swaroop Nagar, Kanpur",
      date: "2026-10-06",
      doctorName: "Dr. Alok Bhardwaj",
      prescriptionRef: "RX-3001",
      staffName: "Manoj Sharma",
      items: [
        { name: "Titan Eye+ TF-2026 Matte Black (Ultem)", qty: 1, rate: 2490, amount: 2490 },
        { name: "Essilor Crizal Prevencia 1.56 Blue-Cut UV420 (Pair)", qty: 1, rate: 2200, amount: 2200 },
        { name: "Automated Edging & Lens Fitting Charges", qty: 1, rate: 150, amount: 150 }
      ],
      subtotal: 4840,
      discount: 140,
      taxableAmount: 4700,
      cgst: 0,
      sgst: 0,
      grandTotal: 4700,
      advancePaid: 2000,
      dueAmount: 2700,
      paymentMethod: "UPI (Google Pay)",
      paymentStatus: "Partial",
      expectedDelivery: "2026-10-10"
    },
    {
      id: "BCG-INV-1026",
      jobId: "BCG-00126",
      patientId: "P-1002",
      customerName: "Priya Patel",
      customerPhone: "9812345678",
      customerAddress: "Plot 42, Kakadeo Double Puliya, Kanpur",
      date: "2026-10-07",
      doctorName: "Dr. Alok Bhardwaj",
      prescriptionRef: "RX-3002",
      staffName: "Manoj Sharma",
      items: [
        { name: "Vogue Eyewear Gleam Chic Cat-Eye Frame", qty: 1, rate: 4190, amount: 4190 },
        { name: "BCG Digital Freeform Progressive 1.67 Corridor Lenses", qty: 1, rate: 5200, amount: 5200 },
        { name: "Precision Progressive Fitting & Axis Alignment", qty: 1, rate: 150, amount: 150 }
      ],
      subtotal: 9540,
      discount: 340,
      taxableAmount: 9200,
      cgst: 0,
      sgst: 0,
      grandTotal: 9200,
      advancePaid: 5000,
      dueAmount: 4200,
      paymentMethod: "Credit Card",
      paymentStatus: "Partial",
      expectedDelivery: "2026-10-11"
    },
    {
      id: "BCG-INV-1024",
      jobId: "BCG-00124",
      patientId: "P-1003",
      customerName: "Amit Verma",
      customerPhone: "9839123456",
      customerAddress: "M-Block, Kidwai Nagar, Kanpur",
      date: "2026-10-03",
      doctorName: "Dr. Alok Bhardwaj",
      prescriptionRef: "RX-2998",
      staffName: "Manoj Sharma",
      items: [
        { name: "BCG Signature Executive Royal Titanium Frame", qty: 1, rate: 3600, amount: 3600 },
        { name: "Zeiss ClearView LotuTec 1.60 Hi-Index (Pair)", qty: 1, rate: 3600, amount: 3600 },
        { name: "Grooving & Rimless Cord Mounting", qty: 1, rate: 150, amount: 150 }
      ],
      subtotal: 7350,
      discount: 350,
      taxableAmount: 7000,
      cgst: 0,
      sgst: 0,
      grandTotal: 7000,
      advancePaid: 7000,
      dueAmount: 0,
      paymentMethod: "UPI (Paytm)",
      paymentStatus: "Paid",
      expectedDelivery: "2026-10-06"
    }
  ],

  audit_logs: [
    {
      id: "LOG-501",
      timestamp: "06/10/2026 11:45:12",
      user: "Dr. Alok Bhardwaj",
      role: "doctor",
      action: "PRESCRIPTION_SENT_TO_OPTICAL",
      targetId: "RX-3001",
      details: "Created Rx for Rahul Sharma (SPH R:-2.50, L:-2.00) & triggered Optical Job BCG-00125"
    },
    {
      id: "LOG-502",
      timestamp: "06/10/2026 12:15:30",
      user: "Manoj Sharma",
      role: "staff",
      action: "OPTICAL_JOB_UPDATED",
      targetId: "BCG-00125",
      details: "Selected Titan TF-2026 Frame & Essilor Prevencia Lens. Advance ₹2,000 recorded."
    },
    {
      id: "LOG-503",
      timestamp: "06/10/2026 12:20:04",
      user: "Manoj Sharma",
      role: "staff",
      action: "INVOICE_GENERATED",
      targetId: "BCG-INV-1025",
      details: "Generated invoice for BCG-00125 total ₹4,700, advance ₹2,000, due ₹2,700"
    },
    {
      id: "LOG-504",
      timestamp: "07/10/2026 12:10:45",
      user: "Dr. Alok Bhardwaj",
      role: "doctor",
      action: "PRESCRIPTION_SENT_TO_OPTICAL",
      targetId: "RX-3002",
      details: "Created progressive Rx for Priya Patel & triggered Optical Job BCG-00126"
    }
  ]
};

// BCG Database API
const BCGStore = {
  getDB: function() {
    try {
      const data = localStorage.getItem(BCG_STORAGE_KEY);
      if (!data) {
        this.resetDB();
        return JSON.parse(localStorage.getItem(BCG_STORAGE_KEY));
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Error reading localStorage, resetting to default:", e);
      this.resetDB();
      return defaultDatabase;
    }
  },

  saveDB: function(db) {
    try {
      localStorage.setItem(BCG_STORAGE_KEY, JSON.stringify(db));
      return true;
    } catch (e) {
      console.error("Error writing to localStorage:", e);
      return false;
    }
  },

  resetDB: function() {
    localStorage.setItem(BCG_STORAGE_KEY, JSON.stringify(defaultDatabase));
    return defaultDatabase;
  },

  // Log an audit trail
  logAudit: function(user, role, action, targetId, details) {
    const db = this.getDB();
    const now = new Date();
    const timeStr = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logItem = {
      id: "LOG-" + (db.audit_logs.length + 501),
      timestamp: timeStr,
      user: user || "System",
      role: role || "system",
      action: action,
      targetId: targetId,
      details: details
    };
    db.audit_logs.unshift(logItem);
    this.saveDB(db);
  },

  // Patients
  getPatients: function() {
    return this.getDB().patients || [];
  },

  getPatientById: function(id) {
    const patients = this.getPatients();
    return patients.find(p => p.id === id || p.phone === id);
  },

  addPatient: function(patientData) {
    const db = this.getDB();
    const newId = "P-" + (db.patients.length + 1001);
    const newPatient = {
      id: newId,
      name: patientData.name,
      phone: patientData.phone,
      email: patientData.email || "",
      age: patientData.age || 0,
      gender: patientData.gender || "Not specified",
      dob: patientData.dob || "",
      address: patientData.address || "",
      emergencyContact: patientData.emergencyContact || "",
      occupation: patientData.occupation || "",
      medicalHistory: patientData.medicalHistory || "None reported",
      allergies: patientData.allergies || "None",
      createdAt: new Date().toISOString().split('T')[0]
    };
    db.patients.unshift(newPatient);
    this.saveDB(db);
    this.logAudit("Doctor/Staff", "staff", "PATIENT_REGISTERED", newId, `Registered patient ${newPatient.name} (${newPatient.phone})`);
    return newPatient;
  },

  // Eye Examinations
  addExamination: function(examData) {
    const db = this.getDB();
    const newId = "EX-" + (db.examinations.length + 2001);
    const newExam = {
      id: newId,
      patientId: examData.patientId,
      doctorName: examData.doctorName || "Dr. Alok Bhardwaj",
      date: new Date().toISOString().split('T')[0],
      rightEye: examData.rightEye,
      leftEye: examData.leftEye,
      pd: examData.pd || "62",
      distancePd: examData.distancePd || examData.pd || "62",
      nearPd: examData.nearPd || "60",
      visualAcuity: examData.visualAcuity || { right: "6/6", left: "6/6" },
      eyePressure: examData.eyePressure || "14 mmHg",
      observations: examData.observations || "",
      recommendations: examData.recommendations || "",
      notes: examData.notes || ""
    };
    db.examinations.unshift(newExam);
    this.saveDB(db);
    return newExam;
  },

  // Prescriptions
  addPrescription: function(rxData, sendToOptical = false) {
    const db = this.getDB();
    const newRxId = "RX-" + (db.prescriptions.length + 3001);
    const patient = this.getPatientById(rxData.patientId);
    
    let opticalJobId = null;
    let opticalStatus = "Saved";

    if (sendToOptical) {
      const nextJobNum = db.optical_jobs.length + 127;
      opticalJobId = "BCG-00" + nextJobNum;
      opticalStatus = "Sent to Optical";

      // Create Optical Job automatically
      const newJob = {
        id: opticalJobId,
        patientId: rxData.patientId,
        patientName: patient ? patient.name : rxData.patientName,
        patientPhone: patient ? patient.phone : rxData.patientPhone,
        prescriptionId: newRxId,
        doctorId: rxData.doctorId || "USR-002",
        doctorName: rxData.doctorName || "Dr. Alok Bhardwaj",
        rxDetails: {
          right: rxData.rightEye,
          left: rxData.leftEye,
          pd: rxData.pd
        },
        frameId: "",
        frameName: "Pending Selection by Staff",
        framePrice: 0,
        lensId: "",
        lensName: rxData.lensRecommendation || "Pending Selection by Staff",
        lensPrice: 0,
        fittingCharge: db.settings.fittingCharge || 150,
        discount: 0,
        tax: 0,
        total: 0,
        advance: 0,
        due: 0,
        paymentMethod: "",
        invoiceNumber: "",
        createdAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        expectedDelivery: "",
        status: "Prescription Received",
        timeline: [
          {
            status: "Prescription Received",
            time: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            user: rxData.doctorName || "Dr. Alok Bhardwaj",
            note: "Prescription electronically dispatched to Optical Dispensing team."
          }
        ]
      };
      db.optical_jobs.unshift(newJob);
    }

    const newPrescription = {
      id: newRxId,
      patientId: rxData.patientId,
      examId: rxData.examId || "",
      doctorName: rxData.doctorName || "Dr. Alok Bhardwaj",
      date: new Date().toISOString().split('T')[0],
      rightEye: rxData.rightEye,
      leftEye: rxData.leftEye,
      pd: rxData.pd,
      lensRecommendation: rxData.lensRecommendation || "",
      notes: rxData.notes || "",
      medicines: rxData.medicines || [],
      opticalStatus: opticalStatus,
      opticalJobId: opticalJobId,
      createdAt: new Date().toISOString()
    };

    db.prescriptions.unshift(newPrescription);
    this.saveDB(db);

    const logAction = sendToOptical ? "PRESCRIPTION_SENT_TO_OPTICAL" : "PRESCRIPTION_SAVED";
    this.logAudit(
      rxData.doctorName || "Doctor",
      "doctor",
      logAction,
      newRxId,
      `Prescription ${newRxId} created for ${patient ? patient.name : 'patient'}. ${sendToOptical ? `Auto-generated Optical Job ${opticalJobId}` : ''}`
    );

    return { prescription: newPrescription, opticalJobId: opticalJobId };
  },

  // Optical Jobs
  getOpticalJobs: function() {
    return this.getDB().optical_jobs || [];
  },

  getOpticalJobById: function(jobId) {
    return this.getOpticalJobs().find(j => j.id === jobId);
  },

  updateOpticalJob: function(jobId, updateData, staffUser = "Manoj Sharma") {
    const db = this.getDB();
    const jobIndex = db.optical_jobs.findIndex(j => j.id === jobId);
    if (jobIndex === -1) return null;

    const currentJob = db.optical_jobs[jobIndex];
    const prevStatus = currentJob.status;

    // Merge updates
    const updatedJob = { ...currentJob, ...updateData };

    // If status changed, push to timeline
    if (updateData.status && updateData.status !== prevStatus) {
      if (!updatedJob.timeline) updatedJob.timeline = [];
      updatedJob.timeline.push({
        status: updateData.status,
        time: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: staffUser,
        note: updateData.statusNote || `Status updated to ${updateData.status}`
      });
    }

    db.optical_jobs[jobIndex] = updatedJob;

    // Check if an invoice should be auto-created or updated
    if (updateData.advance !== undefined || updateData.total !== undefined) {
      this.syncInvoiceForJob(db, updatedJob, staffUser);
    }

    this.saveDB(db);
    this.logAudit(staffUser, "staff", "OPTICAL_JOB_UPDATED", jobId, `Job ${jobId} updated: Status=${updatedJob.status}, Total=₹${updatedJob.total}`);
    return updatedJob;
  },

  syncInvoiceForJob: function(db, job, staffUser) {
    let invoice = db.invoices.find(inv => inv.jobId === job.id);
    const patient = db.patients.find(p => p.id === job.patientId) || {};
    const invoiceNum = invoice ? invoice.id : `BCG-INV-${job.id.replace('BCG-', '')}`;

    const items = [];
    if (job.frameName && job.framePrice > 0) {
      items.push({ name: job.frameName, qty: 1, rate: job.framePrice, amount: job.framePrice });
    }
    if (job.lensName && job.lensPrice > 0) {
      items.push({ name: job.lensName, qty: 1, rate: job.lensPrice, amount: job.lensPrice });
    }
    if (job.fittingCharge > 0) {
      items.push({ name: "Lens Precision Fitting & Edging", qty: 1, rate: job.fittingCharge, amount: job.fittingCharge });
    }

    const subtotal = (job.framePrice || 0) + (job.lensPrice || 0) + (job.fittingCharge || 0);
    const discount = job.discount || 0;
    const grandTotal = Math.max(0, subtotal - discount);
    const advancePaid = job.advance || 0;
    const dueAmount = Math.max(0, grandTotal - advancePaid);
    const paymentStatus = dueAmount === 0 ? "Paid" : (advancePaid > 0 ? "Partial" : "Unpaid");

    const invoiceData = {
      id: invoiceNum,
      jobId: job.id,
      patientId: job.patientId,
      customerName: job.patientName,
      customerPhone: job.patientPhone,
      customerAddress: patient.address || "Kanpur, UP",
      date: new Date().toISOString().split('T')[0],
      doctorName: job.doctorName,
      prescriptionRef: job.prescriptionId,
      staffName: staffUser,
      items: items.length > 0 ? items : [{ name: "Optical Dispensing Service", qty: 1, rate: grandTotal, amount: grandTotal }],
      subtotal: subtotal,
      discount: discount,
      taxableAmount: grandTotal,
      cgst: 0,
      sgst: 0,
      grandTotal: grandTotal,
      advancePaid: advancePaid,
      dueAmount: dueAmount,
      paymentMethod: job.paymentMethod || "Cash/UPI",
      paymentStatus: paymentStatus,
      expectedDelivery: job.expectedDelivery || "3-5 Working Days"
    };

    if (invoice) {
      const idx = db.invoices.findIndex(inv => inv.id === invoice.id);
      db.invoices[idx] = invoiceData;
    } else {
      db.invoices.unshift(invoiceData);
      job.invoiceNumber = invoiceNum;
    }
  },

  // Repairs
  getRepairs: function() {
    return this.getDB().repairs || [];
  },

  getRepairById: function(repairId) {
    return this.getRepairs().find(r => r.id === repairId);
  },

  addRepair: function(repairData, staffUser = "Manoj Sharma") {
    const db = this.getDB();
    const newId = "REP-" + (db.repairs.length + 103);
    const newRepair = {
      id: newId,
      patientId: repairData.patientId || "",
      customerName: repairData.customerName,
      customerPhone: repairData.customerPhone,
      frameDescription: repairData.frameDescription,
      problem: repairData.problem,
      condition: repairData.condition || "Fair condition",
      estimatedCost: Number(repairData.estimatedCost) || 0,
      finalCost: Number(repairData.finalCost) || Number(repairData.estimatedCost) || 0,
      advance: Number(repairData.advance) || 0,
      due: Math.max(0, (Number(repairData.finalCost) || Number(repairData.estimatedCost) || 0) - (Number(repairData.advance) || 0)),
      paymentMethod: repairData.paymentMethod || "Cash",
      receivedDate: new Date().toISOString().split('T')[0],
      expectedDelivery: repairData.expectedDelivery || "Next Day",
      staffName: staffUser,
      status: "Received",
      timeline: [
        {
          status: "Received",
          time: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: staffUser,
          note: `Repair job accepted for ${repairData.frameDescription}`
        }
      ]
    };

    db.repairs.unshift(newRepair);
    this.saveDB(db);
    this.logAudit(staffUser, "staff", "REPAIR_REGISTERED", newId, `Repair ticket ${newId} created for ${repairData.customerName}`);
    return newRepair;
  },

  updateRepairStatus: function(repairId, newStatus, note = "", staffUser = "Manoj Sharma", paymentData = null) {
    const db = this.getDB();
    const repair = db.repairs.find(r => r.id === repairId);
    if (!repair) return null;

    repair.status = newStatus;
    if (paymentData) {
      if (paymentData.finalCost !== undefined) repair.finalCost = Number(paymentData.finalCost);
      if (paymentData.advance !== undefined) repair.advance = Number(paymentData.advance);
      repair.due = Math.max(0, repair.finalCost - repair.advance);
      if (paymentData.paymentMethod) repair.paymentMethod = paymentData.paymentMethod;
    }

    if (!repair.timeline) repair.timeline = [];
    repair.timeline.push({
      status: newStatus,
      time: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: staffUser,
      note: note || `Status progressed to ${newStatus}`
    });

    this.saveDB(db);
    this.logAudit(staffUser, "staff", "REPAIR_STATUS_UPDATED", repairId, `Repair ${repairId} changed to ${newStatus}`);
    return repair;
  },

  // Customer 360 Full Aggregation
  getCustomer360: function(identifier) {
    const db = this.getDB();
    // identifier can be patientId, phone, or email
    const patient = db.patients.find(p => p.id === identifier || p.phone === identifier || p.email === identifier);
    if (!patient) return null;

    const exams = db.examinations.filter(e => e.patientId === patient.id);
    const prescriptions = db.prescriptions.filter(rx => rx.patientId === patient.id);
    const opticalJobs = db.optical_jobs.filter(j => j.patientId === patient.id);
    const repairs = db.repairs.filter(r => r.patientId === patient.id || r.customerPhone === patient.phone);
    const invoices = db.invoices.filter(i => i.patientId === patient.id || i.customerPhone === patient.phone);

    const totalSpent = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0) +
                       repairs.reduce((sum, rep) => sum + (rep.finalCost || 0), 0);
    const totalDue = invoices.reduce((sum, inv) => sum + (inv.dueAmount || 0), 0) +
                     repairs.reduce((sum, rep) => sum + (rep.due || 0), 0);

    return {
      patient,
      latestExam: exams[0] || null,
      latestRx: prescriptions[0] || null,
      activeJob: opticalJobs.find(j => j.status !== 'Delivered') || opticalJobs[0] || null,
      activeRepair: repairs.find(r => r.status !== 'Delivered') || repairs[0] || null,
      exams,
      prescriptions,
      opticalJobs,
      repairs,
      invoices,
      totalSpent,
      totalDue
    };
  },

  // Inventory Management
  updateFrameStock: function(frameId, changeAmount) {
    const db = this.getDB();
    const frame = db.frames.find(f => f.id === frameId);
    if (frame) {
      frame.stock = Math.max(0, frame.stock + changeAmount);
      this.saveDB(db);
    }
  },

  addFrame: function(frameData) {
    const db = this.getDB();
    const newId = "FRM-" + (db.frames.length + 109);
    const newFrame = { id: newId, ...frameData };
    db.frames.unshift(newFrame);
    this.saveDB(db);
    return newFrame;
  },

  updateSettings: function(newSettings) {
    const db = this.getDB();
    db.settings = { ...db.settings, ...newSettings };
    this.saveDB(db);
    return db.settings;
  },

  // Revenue & Sales Analytics (Current Day, Last Day, Last Week, Total)
  getRevenueAnalytics: function() {
    const db = this.getDB();
    const invoices = db.invoices || [];
    const repairs = db.repairs || [];

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    function isSameDate(dStr, target) {
      if (!dStr) return false;
      return dStr.substring(0, 10) === target;
    }

    function isWithinPast7Days(dStr) {
      if (!dStr) return false;
      const sub = dStr.substring(0, 10);
      return sub >= sevenDaysAgoStr && sub <= todayStr;
    }

    // Current Day (Today)
    const todayInvoices = invoices.filter(i => isSameDate(i.date, todayStr));
    const todayRepairs = repairs.filter(r => isSameDate(r.receivedDate, todayStr));
    const todayRevenue = todayInvoices.reduce((s, i) => s + (i.grandTotal || 0), 0) +
                         todayRepairs.reduce((s, r) => s + (r.finalCost || 0), 0);
    const todayCollected = todayInvoices.reduce((s, i) => s + (i.advancePaid || 0), 0) +
                           todayRepairs.reduce((s, r) => s + (r.advance || 0), 0);

    // Last Day (Yesterday)
    const yestInvoices = invoices.filter(i => isSameDate(i.date, yesterdayStr));
    const yestRepairs = repairs.filter(r => isSameDate(r.receivedDate, yesterdayStr));
    const yestRevenue = yestInvoices.reduce((s, i) => s + (i.grandTotal || 0), 0) +
                        yestRepairs.reduce((s, r) => s + (r.finalCost || 0), 0);
    const yestCollected = yestInvoices.reduce((s, i) => s + (i.advancePaid || 0), 0) +
                          yestRepairs.reduce((s, r) => s + (r.advance || 0), 0);

    // Last Week (Past 7 Days)
    const weekInvoices = invoices.filter(i => isWithinPast7Days(i.date));
    const weekRepairs = repairs.filter(r => isWithinPast7Days(r.receivedDate));
    const weekRevenue = weekInvoices.reduce((s, i) => s + (i.grandTotal || 0), 0) +
                        weekRepairs.reduce((s, r) => s + (r.finalCost || 0), 0);
    const weekCollected = weekInvoices.reduce((s, i) => s + (i.advancePaid || 0), 0) +
                          weekRepairs.reduce((s, r) => s + (r.advance || 0), 0);

    // Total Lifetime
    const totalRevenue = invoices.reduce((s, i) => s + (i.grandTotal || 0), 0) +
                         repairs.reduce((s, r) => s + (r.finalCost || 0), 0);
    const totalCollected = invoices.reduce((s, i) => s + (i.advancePaid || 0), 0) +
                           repairs.reduce((s, r) => s + (r.advance || 0), 0);
    const totalDues = invoices.reduce((s, i) => s + (i.dueAmount || 0), 0) +
                      repairs.reduce((s, r) => s + (r.due || 0), 0);

    return {
      today: {
        revenue: todayRevenue,
        collected: todayCollected,
        ordersCount: todayInvoices.length + todayRepairs.length,
        date: todayStr
      },
      yesterday: {
        revenue: yestRevenue,
        collected: yestCollected,
        ordersCount: yestInvoices.length + yestRepairs.length,
        date: yesterdayStr
      },
      lastWeek: {
        revenue: weekRevenue,
        collected: weekCollected,
        ordersCount: weekInvoices.length + weekRepairs.length,
        range: `${sevenDaysAgoStr} to ${todayStr}`
      },
      total: {
        revenue: totalRevenue,
        collected: totalCollected,
        dues: totalDues
      }
    };
  }
};

window.BCGStore = BCGStore;
