import * as tf from '@tensorflow/tfjs-node';

// Define the input shape
const input = tf.input({ shape: [1] });

// Create hidden layers
let hidden = input;
const numHiddenLayers = 8;

for (let i = 0; i < numHiddenLayers; i++) {
  hidden = tf.layers.dense({
    units: 128,
    activation: "relu",
    kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
  }).apply(hidden) as tf.SymbolicTensor;

  hidden = tf.layers.batchNormalization().apply(hidden) as tf.SymbolicTensor;;

  if (i < numHiddenLayers - 1) {
    hidden = tf.layers.dropout({ rate: 0.2 }).apply(hidden) as tf.SymbolicTensor;;
  }
}

// Define output layers for AI-generated design styles
const backgroundColorOutput = tf.layers.dense({
  units: 4, // Modern, Classic, Minimalist, Default
  activation: "softmax",
  name: "backgroundColorOutput"
}).apply(hidden) as tf.SymbolicTensor;;

const textColorOutput = tf.layers.dense({
  units: 4,
  activation: "softmax",
  name: "textColorOutput"
}).apply(hidden) as tf.SymbolicTensor;;

const borderColorOutput = tf.layers.dense({
  units: 4,
  activation: "softmax",
  name: "borderColorOutput"
}).apply(hidden) as tf.SymbolicTensor;;

// Create the model
const designModel = tf.model({
  inputs: input,
  outputs: [backgroundColorOutput, textColorOutput, borderColorOutput]
});

// Compile the model
designModel.compile({
  optimizer: tf.train.adamax(0.0005),
  loss: {
    backgroundColorOutput: "sparseCategoricalCrossentropy",
    textColorOutput: "sparseCategoricalCrossentropy",
    borderColorOutput: "sparseCategoricalCrossentropy"
  },
  metrics: ["accuracy"]
});

// Function to generate synthetic training data based on prompt
function generateTrainingData(numSamples = 1000) {
  const prompts = ["modern", "classic", "minimalist", "default"];
  const trainingData = [];
  const backgroundLabels = [];
  const textLabels = [];
  const borderLabels = [];

  for (let i = 0; i < numSamples; i++) {
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    trainingData.push([i % 4]);

    if (prompt.includes("modern")) {
      backgroundLabels.push(0);
      textLabels.push(0);
      borderLabels.push(0);
    } else if (prompt.includes("classic")) {
      backgroundLabels.push(1);
      textLabels.push(1);
      borderLabels.push(1);
    } else if (prompt.includes("minimalist")) {
      backgroundLabels.push(2);
      textLabels.push(2);
      borderLabels.push(2);
    } else {
      backgroundLabels.push(3);
      textLabels.push(3);
      borderLabels.push(3);
    }
  }

  return {
    trainingData: tf.tensor2d(trainingData, [numSamples, 1]),
    labels: [
      tf.tensor1d(backgroundLabels, 'int32'),
      tf.tensor1d(textLabels, 'int32'),
      tf.tensor1d(borderLabels, 'int32')
    ]
  };
}

// Function to train and save the model
async function trainAndSaveModel() {
  const { trainingData, labels } = generateTrainingData(1000);
  
  await designModel.fit(trainingData, labels, {
    epochs: 300,
    batchSize: 64,
    shuffle: true,
    validationSplit: 0.2,
  });

  await designModel.save('file://./public/ai-design-model');
  console.log("Model trained and saved.");
}
trainAndSaveModel();

