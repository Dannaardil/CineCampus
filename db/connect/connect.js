import { MongoClient } from "mongodb";

export default class Connection {
    constructor(username, password) {
        this.username = encodeURIComponent(process.env.MONGO_USER);
        this.password = encodeURIComponent(process.env.MONGO_PASSWORD);
        this.client = null;
        this.db = null;
    }

    async connect() {
        if (!this.db) {
            try {
                const uri = this.buildUri();
                this.client = new MongoClient(uri);
                await this.client.connect();
                this.db = this.client.db(process.env.DB_NAME);
                console.log("Connected successfully to MongoDB");
            } catch (error) {
                console.error("Error connecting to MongoDB:", error);
                throw error;
            }
        }
        return this.db;
    }

    buildUri() {
        const baseUri = process.env.MONGO_URI;
        // Asumiendo que MONGO_URI tiene el formato: mongodb://host:port/
        // Si ya incluye credenciales, este método las reemplazará
        const [protocol, rest] = baseUri.split('://');
        return `${protocol}://${this.username}:${this.password}@${rest}`;
    }

    getDb() {
        if (!this.db) {
            throw new Error("MongoDB connection not established");
        }
        return this.db;
    }

    async close() {
        if (this.client) {
            await this.client.close();
            this.db = null;
            this.client = null;
            console.log("MongoDB connection closed");
        }
    }
}