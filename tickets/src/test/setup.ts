import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";

  // mongo = new MongoMemoryServer();
  // const mongoUri = await mongo.getUri();
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.signin = () => {
  // Build a SWT payload. { id, email }
  const payload = {
    id: '1231212',
    email: 'test@test.com'
  };
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build session object { jwt: MY_JWT }
  const session = { jwt: token };
  // urn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Take JSON and encode as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string that the cookie with the encode data
  return [`session=${base64}==; path=/; secure; httponly`];
};
