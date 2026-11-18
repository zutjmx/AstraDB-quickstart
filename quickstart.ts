import { DataAPIClient, VectorDoc, UUID } from '@datastax/astra-db-ts';

const ASTRA_DB_APPLICATION_TOKEN = process.env.ASTRA_DB_APPLICATION_TOKEN;
const ASTRA_DB_API_ENDPOINT = process.env.ASTRA_DB_API_ENDPOINT;

if (!ASTRA_DB_APPLICATION_TOKEN) {
  throw new Error('Missing required environment variable ASTRA_DB_APPLICATION_TOKEN.');
}

if (!ASTRA_DB_API_ENDPOINT) {
  throw new Error('Missing required environment variable ASTRA_DB_API_ENDPOINT.');
}

// Initialize the client and get a "Db" object
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT);

console.log(`* Connected to DB ${db.id}`);

// Schema for documents with precomputed vectors.
interface Idea extends VectorDoc {
  idea: string,
}

(async function () {
  // Create a collection. The default similarity metric is cosine.
  // Choose dimensions that match your vector data.
  // If you're not sure, use the vector dimension that your embeddings model produces.
  const collection = await db.createCollection<Idea>('vector_test', {
    vector: {
      dimension: 5,
      metric: 'cosine',
    },
    checkExists: false, // Optional
  });
  console.log(`* Created collection ${collection.namespace}.${collection.collectionName}`);

  // Insert documents with embeddings into the collection.
  // UUIDs are version 7.
  const documents = [
    {
      _id: new UUID('018e65c9-df45-7913-89f8-175f28bd7f74'),
      idea: 'Chat bot integrated sneakers that talk to you',
      $vector: [0.1, 0.15, 0.3, 0.12, 0.05],
    },
    {
      _id: new UUID('018e65c9-e1b7-7048-a593-db452be1e4c2'),
      idea: 'An AI quilt to help you sleep forever',
      $vector: [0.45, 0.09, 0.01, 0.2, 0.11],
    },
    {
      _id: new UUID('018e65c9-e33d-749b-9386-e848739582f0'),
      idea: 'A deep learning display that controls your mood',
      $vector: [0.1, 0.05, 0.08, 0.3, 0.6],
    },
  ];

  try {
    const inserted = await collection.insertMany(documents);
    console.log(`* Inserted ${inserted.insertedCount} items.`);
  } catch (e) {
    console.log('* Documents found on DB already. Let\'s move on!');
  }

  // Perform a similarity search
  const cursor = await collection.find({}, {
    sort: { $vector: [0.15, 0.1, 0.1, 0.35, 0.55] },
    limit: 10,
    includeSimilarity: true,
  });

  console.log('* Search results:')
  for await (const doc of cursor) {
    console.log('  ', doc.idea, doc.$similarity);
  }

})();