const request = require("supertest");
const app = require("../../app");
const { connectMongo, disconnectMongo } = require("../../services/mongo");

describe("Test launches API", () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  describe("Test GET /launches", () => {
    test("it should return 200 on success", async () => {
      await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /launches", () => {
    const launchData = {
      mission: "USS Exploration",
      rocket: "Test Rocket",
      target: "Kepler-296 A f",
      launchDate: "January 4, 2028",
    };

    const launchDataWihInvalidDate = {
      mission: "USS Exploration",
      rocket: "Test Rocket",
      target: "Kepler-296 A f",
      launchDate: "Jan",
    };

    const launchDataWithoutDate = {
      mission: "USS Exploration",
      rocket: "Test Rocket",
      target: "Kepler-296 A f",
    };

    test("it should return 201 with created", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const reqDate = new Date(launchData.launchDate).valueOf();
      const resDate = new Date(response.body.launchDate).valueOf();

      expect(reqDate).toBe(resDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });
    test("it should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch data",
      });
    });
    test("it should catch invalid date field", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWihInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });

  describe("Test DELETE /laounches", () => {
    test("it should return 200 on delete", async () => {
      const response = await request(app).delete("/launches/112").expect(200);
    });

    test("it should catch no launch found", async () => {
      const response = await request(app).delete("/launches/101").expect(400);
      expect(response.body).toStrictEqual({ error: "Launch not aboreted" });
    });
  });
});
