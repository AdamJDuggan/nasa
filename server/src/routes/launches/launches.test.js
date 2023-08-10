const request = require("supertest");
const app = require("../../app.js");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo.js");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /v1/launches", () => {
    test("It should respond with 200 success", async () => {
      const res = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /v1/launches", () => {
    const LAUNCH_DATE = "January 17, 2030";
    const completeLaunchData = {
      mission: "ZTM155",
      rocket: "ZTM Experimental IS1",
      target: "Kepler-442 b",
    };
    test("It should respond with 201 created", async () => {
      const res = await request(app)
        .post("/v1/launches")
        .send({ ...completeLaunchData, launchDate: LAUNCH_DATE })
        .expect(201);

      expect(res.body).toMatchObject(completeLaunchData);
      const reqDate = new Date(LAUNCH_DATE).valueOf();
      const resDate = new Date(res.body.launchDate).valueOf();
      expect(reqDate).toBe(resDate);
    });
    test("It should catch missing required properties", async () => {
      const res = await request(app)
        .post("/v1/launches")
        .send({ ...completeLaunchData })
        .expect(400);
      expect(res.body).toStrictEqual({
        error: "Missing required launch property!",
      });
    });
    test("It should catch requied dates", async () => {
      const res = await request(app)
        .post("/v1/launches")
        .send({ ...completeLaunchData, launchDate: "*" })
        .expect(400);
      expect(res.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
