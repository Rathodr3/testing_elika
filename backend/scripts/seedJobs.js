
const mongoose = require('mongoose');
const Job = require('../models/Job');
require('dotenv').config();

const sampleJobs = [
  {
    title: "Senior Software Engineer",
    company: "TechCorp Industries",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "5+ years",
    salary: "$120k - $160k",
    description: "Join our engineering team to build scalable software solutions. Work on cutting-edge technologies and contribute to products used by millions.",
    requirements: ["React", "Node.js", "TypeScript", "AWS"],
    isActive: true
  },
  {
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Remote",
    type: "Remote",
    experience: "3+ years",
    salary: "$100k - $140k",
    description: "Design and maintain CI/CD pipelines, manage cloud infrastructure, and ensure system reliability and security.",
    requirements: ["Docker", "Kubernetes", "AWS", "Jenkins"],
    isActive: true
  },
  {
    title: "Frontend Developer",
    company: "DesignFirst Agency",
    location: "New York, NY",
    type: "Contract",
    experience: "2+ years",
    salary: "$80k - $110k",
    description: "Create beautiful, responsive user interfaces and collaborate with design teams to bring creative visions to life.",
    requirements: ["React", "CSS", "JavaScript", "Figma"],
    isActive: true
  },
  {
    title: "Data Engineer",
    company: "DataFlow Analytics",
    location: "Austin, TX",
    type: "Full-time",
    experience: "4+ years",
    salary: "$110k - $150k",
    description: "Build and maintain data pipelines, work with big data technologies, and support data science initiatives.",
    requirements: ["Python", "SQL", "Apache Spark", "Kafka"],
    isActive: true
  },
  {
    title: "Product Manager",
    company: "InnovateTech",
    location: "Seattle, WA",
    type: "Full-time",
    experience: "6+ years",
    salary: "$130k - $170k",
    description: "Lead product strategy and roadmap, collaborate with engineering and design teams, and drive product success.",
    requirements: ["Product Strategy", "Agile", "Analytics", "Leadership"],
    isActive: true
  },
  {
    title: "QA Engineer",
    company: "QualityFirst Systems",
    location: "Boston, MA",
    type: "Full-time",
    experience: "3+ years",
    salary: "$75k - $100k",
    description: "Ensure software quality through comprehensive testing, automation, and quality assurance processes.",
    requirements: ["Selenium", "Java", "API Testing", "Automation"],
    isActive: true
  }
];

async function seedJobs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');
    
    // Insert sample jobs
    await Job.insertMany(sampleJobs);
    console.log('Sample jobs inserted successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedJobs();
