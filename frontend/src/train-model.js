import * as tf from '@tensorflow/tfjs-node';
import { faker } from '@faker-js/faker'; // for the latest versions

// Helper function to hash the name into a number
function nameHash(name) {
  // Use a different hashing method for more variation
  const chars = name.split("");
  return chars.reduce((acc, char) => acc * 31 + char.charCodeAt(0), 0); // Simple polynomial rolling hash
}
// List of courses and institutions
const courses = [
  "Smart Contract Development",
  "Blockchain Fundamentals",
  "Decentralized Finance",
  "Cryptocurrency Economics",
  "Web3 Application Development",
  "NFT Creation and Marketing",
  "Blockchain for Business",
  "Cryptocurrency Trading Strategies",
  "Web3 Security Essentials",
  "Decentralized App Development",
  "Tokenomics and ICO Strategies", // New
  "Blockchain Governance and Regulation", // New
  "Advanced Blockchain Programming", // New
  "Web3 Marketing and Community Building", // New
  "Introduction to Cryptocurrency Mining", // New
  "Interoperability in Blockchain", // New
  "Data Privacy in Web3", // New
  "Building Decentralized Autonomous Organizations (DAOs)", // New
  "Blockchain Project Management", // New
  "Smart Contract Security Auditing", // New
  "Cross-Chain Development" // New
];


const institutions = [
  "Ethereum Academy",
  "Blockchain University",
  "Crypto Institute",
  "DeFi School",
  "Web3 College",
  "Future of Finance Institute",
  "Digital Currency Academy",
  "Tech Blockchain School",
  "Crypto Innovation Lab",
  "Web3 Development Institute",
  "Blockchain Research Institute", // New
  "Global Blockchain Institute", // New
  "Crypto Academy Online", // New
  "NextGen Blockchain School", // New
  "Fintech & Blockchain Academy", // New
  "Decentralized Tech University", // New
  "Digital Ledger Academy", // New
  "Crypto Currency Academy", // New
  "Metaverse Development Institute", // New
  "Distributed Ledger Technologies Institute", // New
  "Blockchain Strategy Institute" // New
];


// Function to generate random training data
function generateRandomTrainingData(numSamples) {
  const trainingData = [];
  const courseData = [];
  const institutionData = [];

  for (let i = 0; i < numSamples; i++) {
    const randomName = faker.person.fullName(); // Generate a full name (first + last)
    trainingData.push([nameHash(randomName) % 1000]); // Hash and mod to keep it in range

    // Randomly select a course and institution
    const randomCourseIndex = Math.floor(Math.random() * courses.length);
    const randomInstitutionIndex = Math.floor(Math.random() * institutions.length);

    courseData.push([randomCourseIndex]);
    institutionData.push([randomInstitutionIndex]);
  }

  return {
    trainingData: tf.tensor2d(trainingData),
    courseData: tf.tensor2d(courseData),
    institutionData: tf.tensor2d(institutionData),
  };
}

// Generate random training data
const { trainingData, courseData, institutionData } = generateRandomTrainingData(1000);

// Step 2: Create the Model using Functional API
const input = tf.input({ shape: [1] }); // Input layer

// Create a few hidden layers
let hidden = input;
const numHiddenLayers = 4; // Total number of hidden layers

for (let i = 0; i < numHiddenLayers; i++) {
  const randomUnits = Math.floor(Math.random() * 32) + 8; // Random units between 8 and 40
  hidden = tf.layers.dense({
    units: randomUnits,
    activation: "relu"
  }).apply(hidden);
}

// Create two output layers for courses and institutions
const courseOutput = tf.layers.dense({
  units: courses.length,
  activation: "softmax",
  name: "courseOutput"
}).apply(hidden);

const institutionOutput = tf.layers.dense({
  units: institutions.length,
  activation: "softmax",
  name: "institutionOutput"
}).apply(hidden);

// Create a new model that has both outputs
const multiOutputModel = tf.model({
  inputs: input,
  outputs: [courseOutput, institutionOutput]
});

// Step 3: Compile the model
multiOutputModel.compile({
  optimizer: "adam",
  loss: {
    courseOutput: "sparseCategoricalCrossentropy",
    institutionOutput: "sparseCategoricalCrossentropy"
  },
  metrics: {
    courseOutput: ["accuracy"],
    institutionOutput: ["accuracy"]
  }
});

async function trainAndSaveModel() {
  // Train the model with multi-output
  await multiOutputModel.fit(trainingData, [courseData, institutionData], {
    epochs: 100,
    shuffle: true,
    validationSplit: 0.2, // Use 20% of the data for validation
  });

  await multiOutputModel.save('file://./public/ai-suggestions-model');

  console.log("Model trained and saved.");
}

// Train and save the model
trainAndSaveModel();
