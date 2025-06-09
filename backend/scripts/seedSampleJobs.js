
const mongoose = require('mongoose');
const Job = require('../models/Job');
const Company = require('../models/Company');
require('dotenv').config();

const sampleJobs = [
  {
    title: "Senior Software Engineer",
    location: "Bangalore, India",
    employmentType: "full-time",
    domain: "Software Development",
    workMode: "hybrid",
    experienceLevel: "senior",
    minExperience: 5,
    description: "Join our dynamic team to build scalable software solutions using React, Node.js, and cloud technologies. Work on cutting-edge projects that impact millions of users.",
    requirements: [
      "5+ years of experience in software development",
      "Strong proficiency in React and Node.js",
      "Experience with cloud platforms (AWS/Azure)",
      "Strong problem-solving skills",
      "Excellent communication skills"
    ],
    salary: "₹15-25 LPA",
    isActive: true
  },
  {
    title: "Mechanical Design Engineer",
    location: "Chennai, India",
    employmentType: "full-time",
    domain: "Mechanical Engineering",
    workMode: "on-site",
    experienceLevel: "mid",
    minExperience: 3,
    description: "Design and develop automotive components using CAD software and work on innovative manufacturing processes. Collaborate with cross-functional teams to deliver high-quality products.",
    requirements: [
      "3+ years of experience in mechanical design",
      "Proficiency in CAD software (SolidWorks, AutoCAD)",
      "Knowledge of manufacturing processes",
      "Bachelor's degree in Mechanical Engineering",
      "Strong analytical skills"
    ],
    salary: "₹8-15 LPA",
    isActive: true
  },
  {
    title: "DevOps Engineer",
    location: "Hyderabad, India",
    employmentType: "full-time",
    domain: "DevOps & Cloud",
    workMode: "remote",
    experienceLevel: "mid",
    minExperience: 4,
    description: "Implement CI/CD pipelines, manage cloud infrastructure, and ensure scalable deployment processes. Work with containerization and orchestration technologies.",
    requirements: [
      "4+ years of experience in DevOps",
      "Experience with Docker and Kubernetes",
      "Knowledge of CI/CD tools (Jenkins, GitLab)",
      "Cloud platform experience (AWS/Azure/GCP)",
      "Scripting skills in Python/Bash"
    ],
    salary: "₹12-20 LPA",
    isActive: true
  },
  {
    title: "Data Scientist",
    location: "Mumbai, India",
    employmentType: "full-time",
    domain: "Data Science & Analytics",
    workMode: "hybrid",
    experienceLevel: "senior",
    minExperience: 4,
    description: "Analyze complex datasets to drive business insights and build machine learning models. Work with big data technologies and statistical analysis tools.",
    requirements: [
      "4+ years of experience in data science",
      "Strong programming skills in Python/R",
      "Experience with ML frameworks (TensorFlow, PyTorch)",
      "Knowledge of statistical analysis and data visualization",
      "Master's degree in relevant field preferred"
    ],
    salary: "₹18-28 LPA",
    isActive: true
  },
  {
    title: "UI/UX Designer",
    location: "Pune, India",
    employmentType: "contract",
    domain: "Design",
    workMode: "hybrid",
    experienceLevel: "mid",
    minExperience: 3,
    description: "Create intuitive and engaging user interfaces for web and mobile applications. Collaborate with development teams to implement design systems and improve user experience.",
    requirements: [
      "3+ years of experience in UI/UX design",
      "Proficiency in Figma, Sketch, Adobe Creative Suite",
      "Understanding of design systems and prototyping",
      "Knowledge of web and mobile design principles",
      "Strong portfolio demonstrating design skills"
    ],
    salary: "₹10-18 LPA",
    isActive: true
  }
];

async function seedJobs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elika-engineering');
    console.log('✅ Connected to MongoDB');

    // First, ensure we have at least one company
    let company = await Company.findOne();
    if (!company) {
      company = new Company({
        name: 'Elika Engineering Pvt Ltd',
        description: 'Leading engineering solutions provider in India, specializing in innovative technology solutions across multiple domains.',
        contactEmail: 'hr@elikaengineering.com',
        phoneNumber: '+91-9876543210',
        website: 'https://elikaengineering.com',
        address: 'Bangalore, India',
        isActive: true
      });
      await company.save();
      console.log('✅ Created default company:', company.name);
    } else {
      console.log('✅ Using existing company:', company.name);
    }

    // Clear existing jobs
    const deletedCount = await Job.deleteMany({});
    console.log(`🗑️ Cleared ${deletedCount.deletedCount} existing jobs`);

    // Create sample jobs with company reference
    const jobsToCreate = sampleJobs.map(job => ({
      ...job,
      company: company._id
    }));

    const createdJobs = await Job.insertMany(jobsToCreate);
    console.log(`✅ Created ${createdJobs.length} sample jobs successfully!`);

    // Log created jobs for verification
    createdJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} - ${job.location} (${job.workMode})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the seeding function
seedJobs();
