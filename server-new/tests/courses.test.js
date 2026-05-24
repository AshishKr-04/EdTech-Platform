const request = require("supertest");
const app = require("../server");
const db = require("./testSetup");
const Course = require("../models/Course");
const User = require("../models/User");

beforeAll(async () => {
  await db.connect();
});

afterAll(async () => {
  await db.closeDatabase();
});

beforeEach(async () => {
  await db.clearDatabase();
});

describe("📚 Courses API Integration Tests", () => {
  let instructorToken;
  let instructorUser;
  let studentToken;
  let studentUser;

  // Pre-seed test users
  beforeEach(async () => {
    // 1. Create Instructor
    const instRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Professor Snape",
        email: "snape@hogwarts.edu",
        password: "potionsMaster123",
        role: "Instructor",
      });
    instructorToken = instRes.body.token;
    instructorUser = instRes.body.user;

    // 2. Create Student
    const studRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Harry Potter",
        email: "harry@hogwarts.edu",
        password: "chosenOne123",
        role: "Student",
      });
    studentToken = studRes.body.token;
    studentUser = studRes.body.user;
  });

  describe("POST /api/courses", () => {
    const validCourse = {
      title: "Defense Against the Dark Arts",
      description: "Learn how to defend yourself from lethal spells and curses.",
      price: 150,
      duration: "10 weeks",
      lessons: [
        { title: "Lesson 1: Boggarts", content: "Riddikulus!" },
        { title: "Lesson 2: Werewolves", content: "Anatomy and behaviors." },
      ],
    };

    it("should allow an Instructor to successfully create a course", async () => {
      const res = await request(app)
        .post("/api/courses")
        .set("Authorization", `Bearer ${instructorToken}`)
        .send(validCourse);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("title", validCourse.title);
      expect(res.body.lessons).toHaveLength(2);
      expect(res.body.instructor).toBe(instructorUser._id);
    });

    it("should reject course creation and return 403 for a Student", async () => {
      const res = await request(app)
        .post("/api/courses")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(validCourse);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("status", "fail");
      expect(res.body.message).toMatch(/permission/i);
    });

    it("should reject and return 400 if course inputs fail Zod validations", async () => {
      const res = await request(app)
        .post("/api/courses")
        .set("Authorization", `Bearer ${instructorToken}`)
        .send({
          title: "Short", // Title must be min 3 chars
          price: -10,     // Price must be non-negative
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("status", "fail");
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: "description" })
      );
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: "price" })
      );
    });
  });

  describe("POST /api/courses/:id/enroll", () => {
    let seededCourse;

    beforeEach(async () => {
      // Seed a course from instructor
      const course = new Course({
        title: "Introduction to Potions",
        description: "Learn how to brew liquid luck and polyjuice potion.",
        price: 200,
        duration: "4 weeks",
        instructor: instructorUser._id,
        lessons: [{ title: "Lesson 1: Cure for Boils" }],
      });
      seededCourse = await course.save();
    });

    it("should successfully enroll an authenticated student to a course", async () => {
      const res = await request(app)
        .post(`/api/courses/${seededCourse._id}/enroll`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);

      // Verify course is in student's enrolled list
      const dbStudent = await User.findById(studentUser._id);
      expect(dbStudent.enrolledCourses).toContainEqual(seededCourse._id);
    });

    it("should increment the course studentsCount upon successful enrollment", async () => {
      // Verify initial count is 0
      const initialCourse = await Course.findById(seededCourse._id);
      expect(initialCourse.studentsCount).toBe(0);

      // Enroll student
      const res = await request(app)
        .post(`/api/courses/${seededCourse._id}/enroll`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);

      // Verify updated count is 1
      const updatedCourse = await Course.findById(seededCourse._id);
      expect(updatedCourse.studentsCount).toBe(1);

      // Attempting to enroll again should not double-increment
      await request(app)
        .post(`/api/courses/${seededCourse._id}/enroll`)
        .set("Authorization", `Bearer ${studentToken}`);

      const doubleCheckCourse = await Course.findById(seededCourse._id);
      expect(doubleCheckCourse.studentsCount).toBe(1);
    });

    it("should block enrollment and return 400 for a malformed ObjectId", async () => {
      const res = await request(app)
        .post("/api/courses/not-a-valid-object-id/enroll")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/hexadecimal/i);
    });
  });

  describe("PUT /api/courses/:id", () => {
    let seededCourse;

    beforeEach(async () => {
      const course = new Course({
        title: "Transfiguration 101",
        description: "Turning tea cups into gerbils.",
        price: 90,
        duration: "3 weeks",
        instructor: instructorUser._id,
        lessons: [{ title: "Lesson 1: Basics" }],
      });
      seededCourse = await course.save();
    });

    it("should allow the course owner (Instructor) to update course details", async () => {
      const res = await request(app)
        .put(`/api/courses/${seededCourse._id}`)
        .set("Authorization", `Bearer ${instructorToken}`)
        .send({
          title: "Advanced Transfiguration",
          price: 150,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("title", "Advanced Transfiguration");
      expect(res.body).toHaveProperty("price", 150);
    });

    it("should reject and return 403 if another Instructor attempts to edit the course", async () => {
      // Create a different instructor
      const diffInstRes = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Professor Lupin",
          email: "lupin@hogwarts.edu",
          password: "defenseLover123",
          role: "Instructor",
        });
      const diffToken = diffInstRes.body.token;

      const res = await request(app)
        .put(`/api/courses/${seededCourse._id}`)
        .set("Authorization", `Bearer ${diffToken}`)
        .send({ title: "Hack Attempted" });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/authorized/i);
    });
  });

  describe("POST /api/courses/:id/progress", () => {
    let seededCourse;

    beforeEach(async () => {
      const course = new Course({
        title: "Care of Magical Creatures",
        description: "Hippogriffs, Bowtruckles, and Nifflers.",
        price: 50,
        duration: "5 weeks",
        instructor: instructorUser._id,
        lessons: [
          { title: "Lesson 1: Hippogriffs" },
          { title: "Lesson 2: Blast-Ended Skrewts" },
        ],
      });
      seededCourse = await course.save();

      // Enroll student
      await request(app)
        .post(`/api/courses/${seededCourse._id}/enroll`)
        .set("Authorization", `Bearer ${studentToken}`);
    });

    it("should successfully save the progress of an enrolled student", async () => {
      const res = await request(app)
        .post(`/api/courses/${seededCourse._id}/progress`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          lessonIndex: 1,
          time: 120.5,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);

      // Verify database
      const progressRes = await request(app)
        .get(`/api/courses/${seededCourse._id}/progress`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(progressRes.statusCode).toBe(200);
      expect(progressRes.body).toHaveProperty("lessonIndex", 1);
      expect(progressRes.body).toHaveProperty("time", 120.5);
    });

    it("should block progress saves and return 400 for out-of-bounds lesson index", async () => {
      const res = await request(app)
        .post(`/api/courses/${seededCourse._id}/progress`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          lessonIndex: 99, // out of range
          time: 0,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/range/i);
    });
  });

  describe("🎓 Lesson Completion & Cryptographic Certificates", () => {
    let seededCourse;

    beforeEach(async () => {
      const course = new Course({
        title: "Herbology for Beginners",
        description: "Mandrakes, Gillyweed, and Devil's Snare.",
        price: 30,
        duration: "2 weeks",
        instructor: instructorUser._id,
        lessons: [
          { title: "Lesson 1: Devil's Snare" },
          { title: "Lesson 2: Mandrake repotting" },
        ],
      });
      seededCourse = await course.save();
    });

    it("should block non-enrolled students from completing lessons", async () => {
      const res = await request(app)
        .post(`/api/courses/${seededCourse._id}/lessons/${seededCourse.lessons[0]._id}/complete`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/enrolled/i);
    });

    it("should allow enrolled student to complete lesson and track completedLessons list", async () => {
      // Enroll
      await request(app)
        .post(`/api/courses/${seededCourse._id}/enroll`)
        .set("Authorization", `Bearer ${studentToken}`);

      // Complete lesson 1
      const res = await request(app)
        .post(`/api/courses/${seededCourse._id}/lessons/${seededCourse.lessons[0]._id}/complete`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("completedLessonsCount", 1);
      expect(res.body).toHaveProperty("totalLessons", 2);
      expect(res.body).toHaveProperty("certificateIssued", false);

      // Verify DB
      const dbStudent = await User.findById(studentUser._id);
      expect(dbStudent.completedLessons).toContainEqual(seededCourse.lessons[0]._id);
    });

    it("should issue cryptographic certificate on 100% completion", async () => {
      // Enroll
      await request(app)
        .post(`/api/courses/${seededCourse._id}/enroll`)
        .set("Authorization", `Bearer ${studentToken}`);

      // Complete lesson 1
      await request(app)
        .post(`/api/courses/${seededCourse._id}/lessons/${seededCourse.lessons[0]._id}/complete`)
        .set("Authorization", `Bearer ${studentToken}`);

      // Complete lesson 2 (100% completion)
      const res = await request(app)
        .post(`/api/courses/${seededCourse._id}/lessons/${seededCourse.lessons[1]._id}/complete`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("certificateIssued", true);
      expect(res.body.certificate).toHaveProperty("courseId", seededCourse._id.toString());
      expect(res.body.certificate).toHaveProperty("certificateId");
      expect(res.body.certificate).toHaveProperty("hash");

      // Verify certificate can be retrieved
      const certRes = await request(app)
        .get(`/api/courses/${seededCourse._id}/certificate`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(certRes.statusCode).toBe(200);
      expect(certRes.body).toHaveProperty("success", true);
      expect(certRes.body.certificate).toHaveProperty("certificateId", res.body.certificate.certificateId);
      expect(certRes.body.certificate).toHaveProperty("hash", res.body.certificate.hash);
    });

    it("should block certificate retrieval for non-enrolled users", async () => {
      const res = await request(app)
        .get(`/api/courses/${seededCourse._id}/certificate`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(403);
    });

    it("should return 404 if certificate is requested but not yet completed", async () => {
      // Enroll
      await request(app)
        .post(`/api/courses/${seededCourse._id}/enroll`)
        .set("Authorization", `Bearer ${studentToken}`);

      const res = await request(app)
        .get(`/api/courses/${seededCourse._id}/certificate`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });
  });
});
