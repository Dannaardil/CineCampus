// import { MongoClient } from 'mongodb';
// import dotenv from 'dotenv';
const MongoClient = require('mongodb')
const dotenv = require('dotenv')

dotenv.config();

class Connection {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    if (this.db) return this.db;

    try {
      const uri = this.buildUri();
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db();
      console.log('Connected successfully to MongoDB');
      return this.db;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  buildUri() {
    const { MONGO_HOST, MONGO_PORT, MONGO_DB, MONGO_USER, MONGO_PASSWORD } = process.env;
    const credentials = MONGO_USER && MONGO_PASSWORD 
      ? `${encodeURIComponent(MONGO_USER)}:${encodeURIComponent(MONGO_PASSWORD)}@`
      : '';
    return `mongodb://${credentials}${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;
  }

  async close() {
    if (this.client) {
      await this.client.close();
      this.db = null;
      this.client = null;
      console.log('MongoDB connection closed');
    }
  }
}

export default new Connection();