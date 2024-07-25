import Connection from '../../db/connect/connect.js';



export async function testConnection() {
  try {
    const db = await Connection.connect();
    const collections = await db.listCollections().toArray();
    console.log('Connected to MongoDB');
    console.log('Collections in database:');
    collections.forEach(collection => console.log(` - ${collection.name}`));
    return 'Test connection successful';
  } catch (error) {
    console.error('Error in test connection:', error);
    return 'Test connection failed';
  }
}