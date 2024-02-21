const request = require("supertest");
const pastes = require("../src/data/pastes-data");
const app = require("../src/app");

describe("path /pastes", () => {
    beforeEach(() => {
      pastes.splice(0, pastes.length); // Clears pastes data
    });
  
  
    describe("GET method", () => {
      it("returns an array of pastes", async () => {
        // Expected array defined. Contains list of pastes objects
        const expected = [
          {
            id: 1,
            user_id: 1,
            name: "Hello",
            syntax: "None",
            expiration: 10,
            exposure: "private",
            text: "Hello World!"
          },
          {
            id: 2,
            user_id: 1,
            name: "Hello World in Python",
            syntax: "Python",
            expiration: 24,
            exposure: "public",
            text: "print(Hello World!)"
          },
          {
            id: 3,
            user_id: 2,
            name: "String Reverse in JavaScript",
            syntax: "Javascript",
            expiration: 24,
            exposure: "public",
            text: "const stringReverse = str => str.split('').reverse().join('');"
          }
        ];
        // Copies of expected paste objects are pushed to pastes array
        pastes.push(...expected);
        
        // Test then runs await to send an API req to GET /pastes
        const response = await request(app).get("/pastes");
        
        // expect() method used with toBe() and toEqual() matchers to ensure that the response status code and response body contain the expected results.
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(expected);
      });
    });

    describe("POST method", () => {
      it("creates a new paste and assigns id", async () => {
        const newPaste = {
          name: "String Reverse in JavaScript",
          syntax: "Javascript",
          expiration: 24,
          exposure: "public",
          text: "const stringReverse = str => str.split('').reverse().join('');"
        };
        const response = await request(app)
          .post("/pastes")
          .set("Accept", "application/json")
          .send({ data: newPaste });
    
        expect(response.status).toBe(201);
        expect(response.body.data).toEqual({
          id: 5,
          ...newPaste,
        });
      });
    
      it("returns 400 if name is missing", async () => {
        const response = await request(app)
          .post("/pastes")
          .set("Accept", "application/json")
          .send({ data: { syntax: "Javascript",
            expiration: 24,
            exposure: "public",
            text: "const stringReverse = str => str.split('').reverse().join('');" 
          } });
    
        expect(response.status).toBe(400);
      });
    
      it("returns 400 if name is empty", async () => {
        const response = await request(app)
          .post("/pastes")
          .set("Accept", "application/json")
          .send({ data: { name: "",
            syntax: "Javascript",
            expiration: 24,
            exposure: "public",
            text: "const stringReverse = str => str.split('').reverse().join('');" 
          } });
    
        expect(response.status).toBe(400);
      });
    });
})