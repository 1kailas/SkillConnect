import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Import models
import User from './models/User.model.js';
import Worker from './models/Worker.model.js';
import Employer from './models/Employer.model.js';
import Job from './models/Job.model.js';
import Review from './models/Review.model.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample data
const getWorkersData = () => [
  {
    name: "Rajesh Kumar",
    email: "rajesh.electrician@gmail.com",
    phone: "9876543210",
    profession: "Electrician",
    skills: [
      { name: "Electrical Wiring", level: "advanced", proofType: "certificate", yearsOfExperience: 8, proof: { certificateTitle: "Master Electrician License", certificateIssuer: "Kerala Electrical Board", certificateId: "KEB-2018-4532" } },
      { name: "Circuit Installation", level: "advanced", proofType: "project", yearsOfExperience: 7, proof: { projectTitle: "Smart Home Installation - Villa Project", projectDescription: "Complete electrical setup for 5 BHK smart villa with automation" } },
      { name: "Troubleshooting", level: "advanced", proofType: "none", yearsOfExperience: 8, proof: {} },
      { name: "Solar Panel Installation", level: "intermediate", proofType: "certificate", yearsOfExperience: 3, proof: { certificateTitle: "Solar Installation Certification", certificateIssuer: "MNRE India" } },
      { name: "Home Automation", level: "intermediate", proofType: "project", yearsOfExperience: 2, proof: { projectTitle: "IoT Home Automation", projectDescription: "Integrated smart switches and sensors" } }
    ],
    experience: 8,
    bio: "Licensed electrician with 8 years of experience in residential and commercial electrical work. Specialized in smart home installations and energy-efficient solutions.",
    location: {
      type: "Point",
      coordinates: [76.2673, 9.9312],
      address: "MG Road, Ernakulam",
      city: "Kochi",
      state: "Kerala",
      pincode: "682016"
    },
    hourlyRate: 600,
    completedJobs: 145,
    rating: { average: 4.8, count: 89 },
    availability: {
      status: "available",
      workingHours: { start: "08:00", end: "18:00" },
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    languages: ["Malayalam", "English", "Hindi"]
  },
  {
    name: "Suresh Menon",
    email: "suresh.plumber@gmail.com",
    phone: "9876543211",
    profession: "Plumber",
    skills: [
      { name: "Pipe Installation", level: "advanced", proofType: "certificate", yearsOfExperience: 12, proof: { certificateTitle: "Master Plumber License", certificateIssuer: "National Plumbing Association" } },
      { name: "Leak Detection", level: "advanced", proofType: "project", yearsOfExperience: 10, proof: { projectTitle: "Commercial Complex Leak Repair", projectDescription: "Detected and fixed complex underground leaks" } },
      { name: "Bathroom Fitting", level: "advanced", proofType: "none", yearsOfExperience: 12, proof: {} },
      { name: "Water Heater Installation", level: "advanced", proofType: "certificate", yearsOfExperience: 8, proof: { certificateTitle: "Gas Heater Installation", certificateIssuer: "Gas Safety Council" } },
      { name: "Drainage Solutions", level: "intermediate", proofType: "project", yearsOfExperience: 6, proof: { projectTitle: "Residential Drainage System", projectDescription: "Designed drainage for 3-story building" } }
    ],
    experience: 12,
    bio: "Expert plumber with over 12 years of experience. Specialized in modern bathroom fittings and leak detection using advanced equipment.",
    location: {
      type: "Point",
      coordinates: [75.7804, 11.2588],
      address: "Kozhikode Beach Road",
      city: "Kozhikode",
      state: "Kerala",
      pincode: "673032"
    },
    hourlyRate: 550,
    completedJobs: 203,
    rating: { average: 4.9, count: 156 },
    availability: {
      status: "available",
      workingHours: { start: "07:00", end: "17:00" },
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    languages: ["Malayalam", "English", "Tamil"]
  },
  {
    name: "Vikram Nair",
    email: "vikram.carpenter@gmail.com",
    phone: "9876543212",
    profession: "Carpenter",
    skills: [
      { name: "Furniture Making", level: "advanced", proofType: "project", yearsOfExperience: 10, proof: { projectTitle: "Custom Modular Kitchen", projectDescription: "Designed and built premium modular kitchen with soft-close mechanisms" } },
      { name: "Door Installation", level: "advanced", proofType: "none", yearsOfExperience: 10, proof: {} },
      { name: "Cabinet Design", level: "advanced", proofType: "project", yearsOfExperience: 8, proof: { projectTitle: "Wardrobe Design Project", projectDescription: "Built walk-in wardrobe with custom storage solutions" } },
      { name: "Wood Polishing", level: "intermediate", proofType: "certificate", yearsOfExperience: 5, proof: { certificateTitle: "Advanced Wood Finishing", certificateIssuer: "Kerala Institute of Carpentry" } },
      { name: "Interior Woodwork", level: "advanced", proofType: "project", yearsOfExperience: 9, proof: { projectTitle: "Villa Interior Woodwork", projectDescription: "Complete wooden paneling and ceiling work" } }
    ],
    experience: 10,
    bio: "Master carpenter specializing in custom furniture and interior woodwork. Passionate about creating unique, handcrafted pieces.",
    location: {
      type: "Point",
      coordinates: [76.9366, 8.5241],
      address: "Pattom Palace Road",
      city: "Thiruvananthapuram",
      state: "Kerala",
      pincode: "695004"
    },
    hourlyRate: 650,
    completedJobs: 187,
    rating: { average: 4.7, count: 121 },
    availability: {
      status: "busy",
      workingHours: { start: "08:00", end: "19:00" },
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    languages: ["Malayalam", "English"]
  },
  {
    name: "Priya Krishnan",
    email: "priya.painter@gmail.com",
    phone: "9876543213",
    profession: "Painter",
    skills: [
      { name: "Interior Painting", level: "advanced", proofType: "project", yearsOfExperience: 6, proof: { projectTitle: "Luxury Apartment Painting", projectDescription: "Premium textured finish for 3 BHK apartment" } },
      { name: "Exterior Painting", level: "advanced", proofType: "certificate", yearsOfExperience: 6, proof: { certificateTitle: "Weather-Resistant Coating Specialist", certificateIssuer: "Asian Paints Academy" } },
      { name: "Texture Work", level: "intermediate", proofType: "project", yearsOfExperience: 4, proof: { projectTitle: "Decorative Wall Textures", projectDescription: "Created designer textures for hotel lobby" } },
      { name: "Wallpaper Installation", level: "intermediate", proofType: "none", yearsOfExperience: 3, proof: {} },
      { name: "Color Consultation", level: "beginner", proofType: "certificate", yearsOfExperience: 2, proof: { certificateTitle: "Color Theory & Design", certificateIssuer: "National Institute of Design" } }
    ],
    experience: 6,
    bio: "Professional painter with expertise in both interior and exterior work. Known for attention to detail and clean finishes.",
    location: {
      type: "Point",
      coordinates: [76.3869, 9.5916],
      address: "Vytilla Junction",
      city: "Kochi",
      state: "Kerala",
      pincode: "682019"
    },
    hourlyRate: 500,
    completedJobs: 98,
    rating: { average: 4.6, count: 67 },
    availability: {
      status: "available",
      workingHours: { start: "09:00", end: "18:00" },
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },
    languages: ["Malayalam", "English", "Hindi"]
  },
  {
    name: "Mohammed Rasheed",
    email: "rasheed.mason@gmail.com",
    phone: "9876543214",
    profession: "Mason",
    skills: [
      { name: "Bricklaying", level: "advanced", proofType: "certificate", yearsOfExperience: 15, proof: { certificateTitle: "Master Mason Certification", certificateIssuer: "Kerala Construction Workers Board" } },
      { name: "Plastering", level: "advanced", proofType: "project", yearsOfExperience: 14, proof: { projectTitle: "Commercial Building Plastering", projectDescription: "Smooth finish plastering for 10-floor building" } },
      { name: "Tile Work", level: "advanced", proofType: "none", yearsOfExperience: 12, proof: {} },
      { name: "Foundation Work", level: "intermediate", proofType: "project", yearsOfExperience: 10, proof: { projectTitle: "Villa Foundation", projectDescription: "Foundation work for luxury villa project" } },
      { name: "Concrete Work", level: "advanced", proofType: "certificate", yearsOfExperience: 13, proof: { certificateTitle: "Concrete Technology", certificateIssuer: "National Building Council" } }
    ],
    experience: 15,
    bio: "Experienced mason with 15 years in construction. Skilled in all aspects of masonry from foundation to finishing.",
    location: {
      type: "Point",
      coordinates: [76.2144, 10.5276],
      address: "Thrissur Town",
      city: "Thrissur",
      state: "Kerala",
      pincode: "680001"
    },
    hourlyRate: 580,
    completedJobs: 267,
    rating: { average: 4.9, count: 198 },
    availability: {
      status: "available",
      workingHours: { start: "06:00", end: "16:00" },
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    languages: ["Malayalam", "Tamil", "Hindi"]
  },
  {
    name: "Anjali Varma",
    email: "anjali.cleaner@gmail.com",
    phone: "9876543215",
    profession: "House Cleaner",
    skills: [
      { name: "Deep Cleaning", level: "advanced", proofType: "certificate", yearsOfExperience: 5, proof: { certificateTitle: "Professional Cleaning Certification", certificateIssuer: "Kerala Cleaning Services Association" } },
      { name: "Kitchen Cleaning", level: "advanced", proofType: "none", yearsOfExperience: 5, proof: {} },
      { name: "Bathroom Sanitization", level: "advanced", proofType: "project", yearsOfExperience: 4, proof: { projectTitle: "Hospital Grade Sanitization", projectDescription: "Trained in medical facility cleaning standards" } },
      { name: "Window Cleaning", level: "intermediate", proofType: "none", yearsOfExperience: 3, proof: {} },
      { name: "Carpet Cleaning", level: "beginner", proofType: "certificate", yearsOfExperience: 1, proof: { certificateTitle: "Carpet Care Specialist", certificateIssuer: "CleanPro Institute" } }
    ],
    experience: 5,
    bio: "Dedicated house cleaner providing thorough and reliable cleaning services. Eco-friendly products used.",
    location: {
      type: "Point",
      coordinates: [76.9514, 8.4855],
      address: "Kazhakootam",
      city: "Thiruvananthapuram",
      state: "Kerala",
      pincode: "695582"
    },
    hourlyRate: 400,
    completedJobs: 342,
    rating: { average: 4.8, count: 256 },
    availability: {
      status: "available",
      workingHours: { start: "08:00", end: "14:00" },
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    languages: ["Malayalam", "English"]
  },
  {
    name: "Arun Kumar",
    email: "arun.welder@gmail.com",
    phone: "9876543216",
    profession: "Welder",
    skills: [
      { name: "Arc Welding", level: "advanced", proofType: "certificate", yearsOfExperience: 9, proof: { certificateTitle: "Advanced Arc Welding", certificateIssuer: "Industrial Training Institute" } },
      { name: "MIG Welding", level: "advanced", proofType: "project", yearsOfExperience: 8, proof: { projectTitle: "Steel Gate Fabrication", projectDescription: "Custom steel gates and grills for residential complex" } },
      { name: "Gate Fabrication", level: "advanced", proofType: "none", yearsOfExperience: 9, proof: {} },
      { name: "Metal Cutting", level: "intermediate", proofType: "certificate", yearsOfExperience: 6, proof: { certificateTitle: "Plasma Cutting Specialist", certificateIssuer: "Welding Institute" } },
      { name: "Stainless Steel Work", level: "intermediate", proofType: "project", yearsOfExperience: 5, proof: { projectTitle: "Kitchen Equipment Fabrication", projectDescription: "Commercial kitchen stainless steel installations" } }
    ],
    experience: 9,
    bio: "Skilled welder with expertise in both residential and industrial welding projects. Quality work guaranteed.",
    location: {
      type: "Point",
      coordinates: [76.6413, 9.5810],
      address: "Kakkanad",
      city: "Kochi",
      state: "Kerala",
      pincode: "682030"
    },
    hourlyRate: 620,
    completedJobs: 156,
    rating: { average: 4.7, count: 94 },
    availability: {
      status: "available",
      workingHours: { start: "07:00", end: "17:00" },
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    languages: ["Malayalam", "Hindi", "English"]
  },
  {
    name: "Lakshmi Pillai",
    email: "lakshmi.gardener@gmail.com",
    phone: "9876543217",
    profession: "Gardener",
    skills: [
      { name: "Landscaping", level: "advanced", proofType: "project", yearsOfExperience: 7, proof: { projectTitle: "Resort Garden Design", projectDescription: "Designed and maintained 2-acre resort garden with water features" } },
      { name: "Plant Care", level: "advanced", proofType: "certificate", yearsOfExperience: 8, proof: { certificateTitle: "Horticulture Diploma", certificateIssuer: "Kerala Agricultural University" } },
      { name: "Lawn Maintenance", level: "advanced", proofType: "none", yearsOfExperience: 7, proof: {} },
      { name: "Pest Control", level: "intermediate", proofType: "certificate", yearsOfExperience: 4, proof: { certificateTitle: "Organic Pest Management", certificateIssuer: "Department of Agriculture" } },
      { name: "Garden Design", level: "intermediate", proofType: "project", yearsOfExperience: 5, proof: { projectTitle: "Rooftop Garden", projectDescription: "Created terrace garden with vertical planters" } }
    ],
    experience: 8,
    bio: "Passionate gardener with expertise in landscaping and plant care. Creating beautiful outdoor spaces is my specialty.",
    location: {
      type: "Point",
      coordinates: [76.2711, 9.9312],
      address: "Edappally",
      city: "Kochi",
      state: "Kerala",
      pincode: "682024"
    },
    hourlyRate: 450,
    completedJobs: 124,
    rating: { average: 4.9, count: 87 },
    availability: {
      status: "available",
      workingHours: { start: "06:00", end: "12:00" },
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    languages: ["Malayalam", "English"]
  },
  {
    name: "Dinesh Babu",
    email: "dinesh.ac@gmail.com",
    phone: "9876543218",
    profession: "AC Technician",
    skills: [
      { name: "AC Installation", level: "advanced", proofType: "certificate", yearsOfExperience: 6, proof: { certificateTitle: "HVAC Technician License", certificateIssuer: "Air Conditioning Association" } },
      { name: "AC Repair", level: "advanced", proofType: "project", yearsOfExperience: 6, proof: { projectTitle: "Commercial AC Maintenance", projectDescription: "Maintained 50+ AC units for corporate office" } },
      { name: "Gas Filling", level: "advanced", proofType: "certificate", yearsOfExperience: 5, proof: { certificateTitle: "Refrigerant Handling", certificateIssuer: "Environmental Protection Board" } },
      { name: "Split AC Installation", level: "advanced", proofType: "none", yearsOfExperience: 6, proof: {} },
      { name: "Duct Cleaning", level: "intermediate", proofType: "project", yearsOfExperience: 3, proof: { projectTitle: "Central AC Duct Cleaning", projectDescription: "Deep cleaning of commercial HVAC ducts" } }
    ],
    experience: 6,
    bio: "Certified AC technician specializing in installation, repair, and maintenance of all types of air conditioning systems.",
    location: {
      type: "Point",
      coordinates: [75.8746, 11.2588],
      address: "Mavoor Road",
      city: "Kozhikode",
      state: "Kerala",
      pincode: "673004"
    },
    hourlyRate: 570,
    completedJobs: 189,
    rating: { average: 4.8, count: 134 },
    availability: {
      status: "available",
      workingHours: { start: "09:00", end: "19:00" },
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    languages: ["Malayalam", "English", "Tamil"]
  },
  {
    name: "Sreeja Menon",
    email: "sreeja.cook@gmail.com",
    phone: "9876543219",
    profession: "Cook",
    skills: [
      { name: "Kerala Cuisine", level: "advanced", proofType: "certificate", yearsOfExperience: 10, proof: { certificateTitle: "Kerala Culinary Expert", certificateIssuer: "Institute of Hotel Management" } },
      { name: "North Indian Cuisine", level: "intermediate", proofType: "project", yearsOfExperience: 5, proof: { projectTitle: "Restaurant Menu Development", projectDescription: "Developed North Indian menu for local restaurant" } },
      { name: "Party Catering", level: "advanced", proofType: "none", yearsOfExperience: 8, proof: {} },
      { name: "Baking", level: "intermediate", proofType: "certificate", yearsOfExperience: 4, proof: { certificateTitle: "Professional Baking", certificateIssuer: "Culinary Arts Academy" } },
      { name: "Meal Planning", level: "beginner", proofType: "none", yearsOfExperience: 2, proof: {} }
    ],
    experience: 10,
    bio: "Experienced cook specializing in Kerala and North Indian cuisines. Available for daily cooking and party catering.",
    location: {
      type: "Point",
      coordinates: [76.3376, 9.9816],
      address: "Aluva",
      city: "Kochi",
      state: "Kerala",
      pincode: "683101"
    },
    hourlyRate: 420,
    completedJobs: 278,
    rating: { average: 4.9, count: 189 },
    availability: {
      status: "busy",
      workingHours: { start: "10:00", end: "14:00" },
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },
    languages: ["Malayalam", "Hindi", "English"]
  }
];

const getEmployersData = () => [
  {
    name: "Ramesh Iyer",
    email: "ramesh@techcorp.com",
    phone: "9123456780",
    companyName: "TechCorp Solutions",
    companyType: "company",
    companyDescription: "Leading IT company in Kerala providing software development and consulting services.",
    industry: "Technology",
    location: {
      type: "Point",
      coordinates: [76.3212, 9.9816],
      address: "InfoPark, Kakkanad",
      city: "Kochi",
      state: "Kerala",
      pincode: "682042"
    },
    rating: { average: 4.7, count: 45 },
    jobsPosted: 28
  },
  {
    name: "Meera Krishnan",
    email: "meera@homebuilders.com",
    phone: "9123456781",
    companyName: "HomeBuilders Kerala",
    companyType: "company",
    companyDescription: "Premium construction company specializing in luxury villas and apartments.",
    industry: "Construction",
    location: {
      type: "Point",
      coordinates: [76.2673, 9.9312],
      address: "Marine Drive",
      city: "Kochi",
      state: "Kerala",
      pincode: "682031"
    },
    rating: { average: 4.8, count: 67 },
    jobsPosted: 42
  },
  {
    name: "Vijay Menon",
    email: "vijay@greenlandscapes.com",
    phone: "9123456782",
    companyName: "Green Landscapes",
    companyType: "company",
    companyDescription: "Professional landscaping and garden maintenance services across Kerala.",
    industry: "Landscaping",
    location: {
      type: "Point",
      coordinates: [76.9366, 8.5241],
      address: "Kowdiar",
      city: "Thiruvananthapuram",
      state: "Kerala",
      pincode: "695003"
    },
    rating: { average: 4.6, count: 34 },
    jobsPosted: 19
  },
  {
    name: "Sanjay Nair",
    email: "sanjay@modernhomes.com",
    phone: "9123456783",
    companyName: "Modern Homes",
    companyType: "contractor",
    companyDescription: "Interior design and home renovation specialists.",
    industry: "Interior Design",
    location: {
      type: "Point",
      coordinates: [75.7804, 11.2588],
      address: "SM Street",
      city: "Kozhikode",
      state: "Kerala",
      pincode: "673001"
    },
    rating: { average: 4.9, count: 56 },
    jobsPosted: 35
  },
  {
    name: "Priya Nambiar",
    email: "priya@cleanpro.com",
    phone: "9123456784",
    companyName: "CleanPro Services",
    companyType: "agency",
    companyDescription: "Professional cleaning services for homes and offices.",
    industry: "Cleaning Services",
    location: {
      type: "Point",
      coordinates: [76.2711, 9.9312],
      address: "Palarivattom",
      city: "Kochi",
      state: "Kerala",
      pincode: "682025"
    },
    rating: { average: 4.5, count: 89 },
    jobsPosted: 67
  }
];

const getJobsData = (employers) => [
  {
    title: "Experienced Electrician for Villa Project",
    description: "Looking for a licensed electrician to handle complete electrical work for a new 4 BHK villa. Work includes wiring, panel installation, smart home setup, and outdoor lighting.",
    requirements: ["Minimum 5 years experience", "Valid electrician license", "Experience with smart home systems", "Own tools preferred"],
    profession: "Electrician",
    category: "electrical",
    location: {
      type: "Point",
      coordinates: [76.3212, 9.9816],
      address: "Kakkanad, Kochi",
      city: "Kochi",
      state: "Kerala",
      pincode: "682030"
    },
    salary: { min: 25000, max: 35000, type: "monthly" },
    jobType: "contract",
    duration: { value: 3, unit: "months" },
    status: "open",
    urgency: "high",
    employerEmail: employers[1].email
  },
  {
    title: "Plumber Needed for Apartment Complex",
    description: "Require skilled plumber for maintenance work in a 50-unit apartment complex. Regular work includes fixing leaks, bathroom repairs, and general plumbing maintenance.",
    requirements: ["Minimum 3 years experience", "Knowledge of modern plumbing systems", "Available for emergency calls", "Good communication skills"],
    profession: "Plumber",
    category: "plumbing",
    location: {
      type: "Point",
      coordinates: [76.2673, 9.9312],
      address: "Marine Drive, Kochi",
      city: "Kochi",
      state: "Kerala",
      pincode: "682031"
    },
    salary: { min: 20000, max: 28000, type: "monthly" },
    jobType: "full-time",
    duration: { value: 12, unit: "months" },
    status: "open",
    urgency: "medium",
    employerEmail: employers[1].email
  },
  {
    title: "Master Carpenter for Custom Furniture",
    description: "Seeking experienced carpenter to create custom modular kitchen, wardrobes, and other furniture for luxury villa interiors.",
    requirements: ["10+ years experience", "Portfolio of previous work", "Expertise in modern designs", "Quality craftsmanship"],
    profession: "Carpenter",
    category: "carpentry",
    location: {
      type: "Point",
      coordinates: [76.9366, 8.5241],
      address: "Kowdiar, Thiruvananthapuram",
      city: "Thiruvananthapuram",
      state: "Kerala",
      pincode: "695003"
    },
    salary: { min: 30000, max: 45000, type: "monthly" },
    jobType: "contract",
    duration: { value: 4, unit: "months" },
    status: "in-progress",
    urgency: "high",
    employerEmail: employers[3].email
  },
  {
    title: "Interior Painter for Office Renovation",
    description: "Professional painter needed for complete interior painting of 10,000 sq ft office space. Premium finish required.",
    requirements: ["Experience with commercial projects", "Knowledge of texture work", "Team coordination skills", "Quality finish"],
    profession: "Painter",
    category: "painting",
    location: {
      type: "Point",
      coordinates: [76.3212, 9.9816],
      address: "InfoPark, Kakkanad",
      city: "Kochi",
      state: "Kerala",
      pincode: "682042"
    },
    salary: { min: 500, max: 700, type: "daily" },
    jobType: "contract",
    duration: { value: 45, unit: "days" },
    status: "open",
    urgency: "medium",
    employerEmail: employers[0].email
  },
  {
    title: "Mason for Residential Construction",
    description: "Experienced mason required for new residential construction project. Work includes foundation, bricklaying, and plastering.",
    requirements: ["15+ years experience", "Expertise in all masonry work", "Team management experience", "Quality conscious"],
    profession: "Mason",
    category: "masonry",
    location: {
      type: "Point",
      coordinates: [75.7804, 11.2588],
      address: "West Hill, Kozhikode",
      city: "Kozhikode",
      state: "Kerala",
      pincode: "673005"
    },
    salary: { min: 800, max: 1200, type: "daily" },
    jobType: "contract",
    duration: { value: 6, unit: "months" },
    status: "open",
    urgency: "high",
    employerEmail: employers[1].email
  },
  {
    title: "House Cleaner for Regular Service",
    description: "Looking for reliable house cleaner for weekly deep cleaning service. Must be thorough and trustworthy.",
    requirements: ["Experience in residential cleaning", "Knowledge of cleaning products", "Punctual and reliable", "References required"],
    profession: "House Cleaner",
    category: "cleaning",
    location: {
      type: "Point",
      coordinates: [76.2711, 9.9312],
      address: "Edappally, Kochi",
      city: "Kochi",
      state: "Kerala",
      pincode: "682024"
    },
    salary: { min: 400, max: 500, type: "daily" },
    jobType: "part-time",
    duration: { value: 12, unit: "months" },
    status: "open",
    urgency: "low",
    employerEmail: employers[4].email
  },
  {
    title: "Welder for Gate and Grill Work",
    description: "Skilled welder needed for fabricating and installing gates, window grills, and railings for residential project.",
    requirements: ["Certified welder", "Experience with stainless steel", "Own equipment", "Quality welding skills"],
    profession: "Welder",
    category: "welding",
    location: {
      type: "Point",
      coordinates: [76.6413, 9.5810],
      address: "Kakkanad, Kochi",
      city: "Kochi",
      state: "Kerala",
      pincode: "682030"
    },
    salary: { min: 600, max: 800, type: "daily" },
    jobType: "contract",
    duration: { value: 2, unit: "months" },
    status: "open",
    urgency: "medium",
    employerEmail: employers[1].email
  },
  {
    title: "Gardener for Resort Maintenance",
    description: "Professional gardener required for maintaining 3-acre resort garden. Must have landscaping experience.",
    requirements: ["5+ years experience", "Knowledge of tropical plants", "Landscaping skills", "Available 6 days a week"],
    profession: "Gardener",
    category: "landscaping",
    location: {
      type: "Point",
      coordinates: [76.9366, 8.5241],
      address: "Kovalam, Thiruvananthapuram",
      city: "Thiruvananthapuram",
      state: "Kerala",
      pincode: "695527"
    },
    salary: { min: 18000, max: 25000, type: "monthly" },
    jobType: "full-time",
    duration: { value: 12, unit: "months" },
    status: "open",
    urgency: "medium",
    employerEmail: employers[2].email
  },
  {
    title: "AC Technician for Mall Maintenance",
    description: "Experienced AC technician needed for regular maintenance of central AC system in shopping mall.",
    requirements: ["HVAC certification", "Experience with commercial systems", "Available for emergency calls", "Good troubleshooting skills"],
    profession: "AC Technician",
    category: "other",
    location: {
      type: "Point",
      coordinates: [76.2673, 9.9312],
      address: "Lulu Mall, Edappally",
      city: "Kochi",
      state: "Kerala",
      pincode: "682024"
    },
    salary: { min: 28000, max: 35000, type: "monthly" },
    jobType: "full-time",
    duration: { value: 12, unit: "months" },
    status: "open",
    urgency: "high",
    employerEmail: employers[0].email
  },
  {
    title: "Cook for Family - Daily Meals",
    description: "Looking for experienced cook to prepare daily meals (lunch and dinner) for family of 4. Kerala cuisine preferred.",
    requirements: ["Experience in home cooking", "Knowledge of Kerala dishes", "Hygienic practices", "Punctual and reliable"],
    profession: "Cook",
    category: "other",
    location: {
      type: "Point",
      coordinates: [76.3376, 9.9816],
      address: "Aluva, Kochi",
      city: "Kochi",
      state: "Kerala",
      pincode: "683101"
    },
    salary: { min: 12000, max: 18000, type: "monthly" },
    jobType: "part-time",
    duration: { value: 12, unit: "months" },
    status: "open",
    urgency: "low",
    employerEmail: employers[4].email
  },
  {
    title: "Electrician - Smart Home Installation",
    description: "Tech-savvy electrician needed for complete smart home automation setup including IoT devices and sensors.",
    requirements: ["Experience with IoT systems", "Smart home installation knowledge", "Basic programming skills", "Problem-solving abilities"],
    profession: "Electrician",
    category: "electrical",
    location: {
      type: "Point",
      coordinates: [76.3212, 9.9816],
      address: "Kakkanad, Kochi",
      city: "Kochi",
      state: "Kerala",
      pincode: "682030"
    },
    salary: { min: 800, max: 1000, type: "daily" },
    jobType: "contract",
    duration: { value: 1, unit: "months" },
    status: "open",
    urgency: "high",
    employerEmail: employers[0].email
  },
  {
    title: "Painter for Residential Complex",
    description: "Interior and exterior painting work for 20-unit residential complex. Texture work experience required.",
    requirements: ["Team management", "Texture work expertise", "Quality finish", "Time management"],
    profession: "Painter",
    category: "painting",
    location: {
      type: "Point",
      coordinates: [75.7804, 11.2588],
      address: "Kozhikode",
      city: "Kozhikode",
      state: "Kerala",
      pincode: "673001"
    },
    salary: { min: 22000, max: 30000, type: "monthly" },
    jobType: "contract",
    duration: { value: 3, unit: "months" },
    status: "open",
    urgency: "medium",
    employerEmail: employers[1].email
  },
  {
    title: "Plumber - Emergency Service Provider",
    description: "Experienced plumber for on-call emergency services. Must be available 24/7 for urgent repairs.",
    requirements: ["10+ years experience", "Own vehicle", "Available for emergencies", "Quick problem solver"],
    profession: "Plumber",
    category: "plumbing",
    location: {
      type: "Point",
      coordinates: [76.2673, 9.9312],
      address: "Kochi",
      city: "Kochi",
      state: "Kerala",
      pincode: "682001"
    },
    salary: { min: 30000, max: 40000, type: "monthly" },
    jobType: "full-time",
    duration: { value: 12, unit: "months" },
    status: "open",
    urgency: "high",
    employerEmail: employers[4].email
  },
  {
    title: "Carpenter - Modular Kitchen Specialist",
    description: "Specialized carpenter for designing and installing premium modular kitchens.",
    requirements: ["Modular kitchen experience", "Design skills", "Precision work", "Customer interaction"],
    profession: "Carpenter",
    category: "carpentry",
    location: {
      type: "Point",
      coordinates: [76.9366, 8.5241],
      address: "Thiruvananthapuram",
      city: "Thiruvananthapuram",
      state: "Kerala",
      pincode: "695001"
    },
    salary: { min: 35000, max: 50000, type: "monthly" },
    jobType: "contract",
    duration: { value: 2, unit: "months" },
    status: "in-progress",
    urgency: "medium",
    employerEmail: employers[3].email
  },
  {
    title: "Mason - Tiling Specialist",
    description: "Expert mason with focus on high-quality tile work for bathrooms and kitchens.",
    requirements: ["Tile work expertise", "Attention to detail", "Clean work habits", "Design sense"],
    profession: "Mason",
    category: "masonry",
    location: {
      type: "Point",
      coordinates: [76.2711, 9.9312],
      address: "Kochi",
      city: "Kochi",
      state: "Kerala",
      pincode: "682024"
    },
    salary: { min: 700, max: 900, type: "daily" },
    jobType: "contract",
    duration: { value: 1, unit: "months" },
    status: "open",
    urgency: "low",
    employerEmail: employers[3].email
  }
];

// Seed database
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    console.log('');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing data');
    console.log('');

    // Plain password - will be hashed by pre-save hook
    const plainPassword = 'password123';

    // Create Workers
    console.log('👷 Creating workers...');
    const workersData = getWorkersData();
    const workers = [];
    for (const workerData of workersData) {
      const worker = await Worker.create({
        ...workerData,
        password: plainPassword,
        isVerified: true,
        isActive: true
      });
      workers.push(worker);
      console.log(`   ✅ ${worker.name} - ${worker.profession}`);
    }
    console.log('');

    // Create Employers
    console.log('🏢 Creating employers...');
    const employersData = getEmployersData();
    const employers = [];
    for (const employerData of employersData) {
      const employer = await Employer.create({
        ...employerData,
        password: plainPassword,
        isVerified: true,
        isActive: true,
        role: 'employer'
      });
      employers.push(employer);
      console.log(`   ✅ ${employer.companyName}`);
    }
    console.log('');

    // Create Jobs
    console.log('💼 Creating jobs...');
    const jobsData = getJobsData(employers);
    const jobs = [];
    for (const jobData of jobsData) {
      const employer = employers.find(e => e.email === jobData.employerEmail);
      if (employer) {
        const { employerEmail, ...jobFields } = jobData;
        const job = await Job.create({
          ...jobFields,
          employer: employer._id,
          postedBy: employer._id
        });
        jobs.push(job);
        console.log(`   ✅ ${job.title}`);
      }
    }
    console.log('');

    // Add Applications to Jobs
    console.log('📝 Adding applications...');
    let applicationCount = 0;

    // Job 0 - Electrician Villa Project - 3 applications
    if (jobs[0]) {
      jobs[0].applicants = [
        {
          worker: workers[0]._id, // Rajesh Kumar - Electrician
          appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: 'shortlisted',
          coverLetter: 'I have 8 years of experience in residential electrical work with expertise in smart home installations. I have successfully completed similar villa projects with complete automation systems.'
        },
        {
          worker: workers[6]._id, // Arun Kumar - Welder
          appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: 'pending',
          coverLetter: 'While I am a welder by profession, I have worked alongside electricians on many construction projects and have basic electrical knowledge.'
        },
        {
          worker: workers[8]._id, // Dinesh Babu - AC Technician
          appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: 'rejected',
          coverLetter: 'I am an AC technician but have extensive knowledge of electrical systems. Can assist with the project.'
        }
      ];
      await jobs[0].save();
      applicationCount += 3;
    }

    // Job 1 - Plumber Apartment Complex - 2 applications
    if (jobs[1]) {
      jobs[1].applicants = [
        {
          worker: workers[1]._id, // Suresh Menon - Plumber
          appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'shortlisted',
          coverLetter: 'Expert plumber with 12 years experience. I have maintained multiple apartment complexes and understand the requirements well. Available for emergency calls.'
        },
        {
          worker: workers[0]._id, // Rajesh Kumar - Electrician
          appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          status: 'pending',
          coverLetter: 'As an electrician, I often work with plumbers on projects and have basic plumbing knowledge for minor repairs.'
        }
      ];
      await jobs[1].save();
      applicationCount += 2;
    }

    // Job 2 - Carpenter Custom Furniture - hired
    if (jobs[2]) {
      jobs[2].applicants = [
        {
          worker: workers[2]._id, // Vikram Nair - Carpenter
          appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          status: 'hired',
          coverLetter: 'Master carpenter with 10 years experience in luxury furniture. My portfolio includes similar villa projects with custom modular kitchens and wardrobes. I focus on quality craftsmanship and modern designs.'
        }
      ];
      await jobs[2].save();
      applicationCount += 1;
    }

    // Job 3 - Interior Painter Office - 2 applications
    if (jobs[3]) {
      jobs[3].applicants = [
        {
          worker: workers[3]._id, // Priya Krishnan - Painter
          appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'shortlisted',
          coverLetter: 'Professional painter with 6 years experience. I have completed several commercial projects including offices and showrooms. Experienced in texture work and premium finishes.'
        },
        {
          worker: workers[4]._id, // Mohammed Rasheed - Mason
          appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: 'pending',
          coverLetter: 'While I am primarily a mason, I have experience coordinating with painters and can provide quality plastering work before painting.'
        }
      ];
      await jobs[3].save();
      applicationCount += 2;
    }

    // Job 4 - Mason Residential Construction - 2 applications
    if (jobs[4]) {
      jobs[4].applicants = [
        {
          worker: workers[4]._id, // Mohammed Rasheed - Mason
          appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'shortlisted',
          coverLetter: 'Experienced mason with 15 years in construction. I have led teams on multiple residential projects handling all masonry work from foundation to finishing. Quality and timely completion guaranteed.'
        },
        {
          worker: workers[6]._id, // Arun Kumar - Welder
          appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          status: 'pending',
          coverLetter: 'I am a welder and can provide gate and grill fabrication services for the construction project.'
        }
      ];
      await jobs[4].save();
      applicationCount += 2;
    }

    // Job 5 - House Cleaner Regular Service - 3 applications
    if (jobs[5]) {
      jobs[5].applicants = [
        {
          worker: workers[5]._id, // Anjali Varma - House Cleaner
          appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'shortlisted',
          coverLetter: 'Professional house cleaner with 5 years experience. I use eco-friendly products and provide thorough deep cleaning services. Punctual and reliable with excellent references.'
        },
        {
          worker: workers[9]._id, // Sreeja Menon - Cook
          appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: 'pending',
          coverLetter: 'As a cook, I maintain high standards of kitchen cleanliness and can provide reliable cleaning services.'
        },
        {
          worker: workers[7]._id, // Lakshmi Pillai - Gardener
          appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: 'rejected',
          coverLetter: 'I am a gardener but can help with outdoor cleaning and maintenance as well.'
        }
      ];
      await jobs[5].save();
      applicationCount += 3;
    }

    // Job 6 - Welder Gate and Grill - 2 applications
    if (jobs[6]) {
      jobs[6].applicants = [
        {
          worker: workers[6]._id, // Arun Kumar - Welder
          appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'shortlisted',
          coverLetter: 'Skilled welder with 9 years experience. Specialized in gate and grill fabrication for residential projects. I own all necessary equipment and can provide quality work with good finishing.'
        },
        {
          worker: workers[4]._id, // Mohammed Rasheed - Mason
          appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          status: 'pending',
          coverLetter: 'I often coordinate with welders on construction sites and can provide support services.'
        }
      ];
      await jobs[6].save();
      applicationCount += 2;
    }

    // Job 7 - Gardener Resort Maintenance - 2 applications
    if (jobs[7]) {
      jobs[7].applicants = [
        {
          worker: workers[7]._id, // Lakshmi Pillai - Gardener
          appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'shortlisted',
          coverLetter: 'Passionate gardener with 8 years experience including large-scale resort gardens. I have expertise in landscaping, plant care, and maintaining tropical gardens. Available 6 days a week.'
        },
        {
          worker: workers[5]._id, // Anjali Varma - House Cleaner
          appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: 'pending',
          coverLetter: 'While I am primarily a cleaner, I have interest in gardening and can help with maintenance work.'
        }
      ];
      await jobs[7].save();
      applicationCount += 2;
    }

    // Job 8 - AC Technician Mall Maintenance - 1 application
    if (jobs[8]) {
      jobs[8].applicants = [
        {
          worker: workers[8]._id, // Dinesh Babu - AC Technician
          appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'shortlisted',
          coverLetter: 'Certified HVAC technician with 6 years experience. I have maintained commercial AC systems including malls and office buildings. Available for regular maintenance and emergency calls 24/7.'
        }
      ];
      await jobs[8].save();
      applicationCount += 1;
    }

    // Job 9 - Cook Family Meals - 3 applications
    if (jobs[9]) {
      jobs[9].applicants = [
        {
          worker: workers[9]._id, // Sreeja Menon - Cook
          appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'shortlisted',
          coverLetter: 'Experienced cook specializing in Kerala cuisine. I have cooked for families for 10 years and understand dietary preferences well. Hygienic, punctual, and reliable.'
        },
        {
          worker: workers[5]._id, // Anjali Varma - House Cleaner
          appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'pending',
          coverLetter: 'I have basic cooking skills and can help with meal preparation along with cleaning services.'
        },
        {
          worker: workers[7]._id, // Lakshmi Pillai - Gardener
          appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          status: 'rejected',
          coverLetter: 'I have cooking experience for my family and can prepare simple Kerala meals.'
        }
      ];
      await jobs[9].save();
      applicationCount += 3;
    }

    console.log(`   ✅ Added ${applicationCount} applications to jobs`);
    console.log('');

    // Create Reviews
    console.log('⭐ Creating reviews...');
    const reviews = [];
    
    // Reviews for workers who have completed jobs
    const reviewsData = [
      {
        reviewer: employers[1]._id,
        reviewee: workers[0]._id,
        rating: 5,
        comment: 'Excellent electrician! Very professional and completed the work on time. Highly recommend.',
        jobTitle: 'Electrical Work for Villa'
      },
      {
        reviewer: employers[3]._id,
        reviewee: workers[2]._id,
        rating: 5,
        comment: 'Outstanding craftsmanship! The custom furniture exceeded our expectations. Will hire again.',
        jobTitle: 'Custom Furniture Project'
      },
      {
        reviewer: employers[0]._id,
        reviewee: workers[1]._id,
        rating: 4,
        comment: 'Good plumber, fixed all the issues efficiently. Could improve on punctuality.',
        jobTitle: 'Plumbing Maintenance'
      },
      {
        reviewer: employers[3]._id,
        reviewee: workers[3]._id,
        rating: 5,
        comment: 'Perfect painting job! Very neat work with excellent attention to detail.',
        jobTitle: 'Interior Painting'
      },
      {
        reviewer: employers[1]._id,
        reviewee: workers[4]._id,
        rating: 5,
        comment: 'Master mason! His work quality is top-notch. Led the team very well.',
        jobTitle: 'Construction Masonry'
      },
      {
        reviewer: employers[4]._id,
        reviewee: workers[5]._id,
        rating: 5,
        comment: 'Very thorough cleaning service. Uses eco-friendly products. Highly satisfied.',
        jobTitle: 'House Cleaning'
      },
      {
        reviewer: employers[1]._id,
        reviewee: workers[6]._id,
        rating: 4,
        comment: 'Good welding work. The gates look great and are very sturdy.',
        jobTitle: 'Gate Fabrication'
      },
      {
        reviewer: employers[2]._id,
        reviewee: workers[7]._id,
        rating: 5,
        comment: 'Amazing gardener! The resort garden looks beautiful. Very knowledgeable about plants.',
        jobTitle: 'Resort Garden Maintenance'
      },
      {
        reviewer: employers[0]._id,
        reviewee: workers[8]._id,
        rating: 5,
        comment: 'Excellent AC technician. Quick diagnosis and repair. Very professional.',
        jobTitle: 'AC Repair'
      },
      {
        reviewer: employers[4]._id,
        reviewee: workers[9]._id,
        rating: 5,
        comment: 'Best cook we have had! Delicious Kerala food, very hygienic and punctual.',
        jobTitle: 'Daily Cooking'
      }
    ];

    for (const reviewData of reviewsData) {
      const review = await Review.create(reviewData);
      reviews.push(review);
      console.log(`   ✅ Review added for ${workers.find(w => w._id.equals(reviewData.reviewee))?.name}`);
    }
    console.log('');

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('═══════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════════');
    console.log(`   Workers Created:      ${workers.length}`);
    console.log(`   Employers Created:    ${employers.length}`);
    console.log(`   Jobs Posted:          ${jobs.length}`);
    console.log(`   Applications:         ${applicationCount}`);
    console.log(`   Reviews:              ${reviews.length}`);
    console.log('═══════════════════════════════════════════════');
    console.log('');
    console.log('🔑 LOGIN CREDENTIALS (All Users)');
    console.log('═══════════════════════════════════════════════');
    console.log('   Password: password123');
    console.log('');
    console.log('👤 SAMPLE WORKER LOGINS:');
    console.log(`   Electrician:    ${workers[0].email}`);
    console.log(`   Plumber:        ${workers[1].email}`);
    console.log(`   Carpenter:      ${workers[2].email}`);
    console.log(`   Painter:        ${workers[3].email}`);
    console.log('');
    console.log('🏢 SAMPLE EMPLOYER LOGINS:');
    console.log(`   TechCorp:       ${employers[0].email}`);
    console.log(`   HomeBuilders:   ${employers[1].email}`);
    console.log(`   Green Landscapes: ${employers[2].email}`);
    console.log('');
    console.log('═══════════════════════════════════════════════');
    console.log('💡 TIPS');
    console.log('═══════════════════════════════════════════════');
    console.log('   • Login as employer to see job applications');
    console.log('   • Login as worker to view and apply for jobs');
    console.log('   • Workers have detailed skills with proof!');
    console.log('   • Check the Skills section in worker profiles');
    console.log('═══════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
};

// Run seeder
const runSeeder = async () => {
  await connectDB();
  await seedDatabase();
  process.exit(0);
};

runSeeder();
