import * as tf from '@tensorflow/tfjs-node';
import { faker } from '@faker-js/faker'; // for the latest versions

// Helper function to hash the name into a number
function nameHash(name:string) {
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
  "Cross-Chain Development", // New
    "Blockchain Scalability Solutions",
  "Quantum Computing and Blockchain",
  "Blockchain in Supply Chain Management",
  "Decentralized Identity Systems",
  "Blockchain for Social Impact",
  "Advanced Cryptography for Blockchain",
  "Blockchain in Healthcare",
  "Legal Aspects of Blockchain Technology",
  "Blockchain for Internet of Things (IoT)",
  "Sustainable Blockchain Solutions",
   "Decentralized Storage Solutions",
  "Blockchain Interoperability Protocols",
  "Green Blockchain Technologies",
  "Blockchain-based Voting Systems",
  "AI Integration with Blockchain",
  "Blockchain for Real Estate",
  "Decentralized Gaming Platforms",
  "Blockchain in Education",
  "Privacy Coins and Anonymity",
  "Blockchain-based Supply Chain Transparency"
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
  "Blockchain Strategy Institute", // New
    "Global Decentralized Technologies Institute",
  "Advanced Blockchain Research Lab",
  "International Blockchain Academy",
  "Smart Ledger University",
  "Blockchain Strategy and Policy Institute",
  "Decentralized Technologies Innovation Hub",
  "Next Generation Crypto Institute",
  "Blockchain and AI Integration School",
  "Sustainable Ledger Academy",
  "Blockchain Applications Institute"
];


// Function to generate random training data
function generateRandomTrainingData(numSamples:number) {
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
const { trainingData, courseData, institutionData } = generateRandomTrainingData(10000);

// Step 2: Create the Model using Functional API
const input = tf.input({ shape: [1] }); // Input layer

// Create a few hidden layers
let hidden = input;
const numHiddenLayers = 8; // Total number of hidden layers

for (let i = 0; i < numHiddenLayers; i++) {
 const units = 128;
  hidden = tf.layers.dense({
    units: units,
    activation: "relu",
    kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
  }).apply(hidden) as tf.SymbolicTensor;
   hidden = tf.layers.batchNormalization().apply(hidden) as tf.SymbolicTensor; // Menambahkan batch normalization
  
  if (i < numHiddenLayers - 1) { // Tidak menerapkan dropout pada layer terakhir
    hidden = tf.layers.dropout({ rate: 0.2 }).apply(hidden) as tf.SymbolicTensor; // Mengurangi dropout rate
  }
}

// Create two output layers for courses and institutions
const courseOutput = tf.layers.dense({
  units: courses.length,
  activation: "softmax",
  name: "courseOutput"
}).apply(hidden) as tf.SymbolicTensor;

const institutionOutput = tf.layers.dense({
  units: institutions.length,
  activation: "softmax",
  name: "institutionOutput"
}).apply(hidden) as tf.SymbolicTensor;

// Create a new model that has both outputs
const multiOutputModel = tf.model({
  inputs: input,
  outputs: [courseOutput, institutionOutput]
});

// Step 3: Compile the model
multiOutputModel.compile({
  optimizer: tf.train.adamax(0.0005), // Menggunakan learning rate yang lebih kecil
  loss: {
    courseOutput: "sparseCategoricalCrossentropy",
    institutionOutput: "sparseCategoricalCrossentropy"
  },
  metrics: {
    courseOutput: "accuracy",
    institutionOutput: "accuracy"
  }
});

async function trainAndSaveModel() {
  // Melatih model dengan multi-output
  await multiOutputModel.fit(trainingData, [courseData, institutionData], {
    epochs: 300, // Meningkatkan jumlah epoch
    batchSize: 64, // Menambahkan batch size
    shuffle: true,
    validationSplit: 0.2,
    // callbacks: [
    //   tf.callbacks.earlyStopping({ monitor: 'val_loss', patience: 20 }), // Meningkatkan patience
    //   tf.callbacks.learningRateScheduler((epoch, lr) => lr * 0.99) // Menambahkan learning rate decay
    // ]
  });
  await multiOutputModel.save('file://./public/ai-suggestions-model');

  console.log("Model trained and saved.");
}

// Train and save the model
trainAndSaveModel();
