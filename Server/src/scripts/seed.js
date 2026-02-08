const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/config");
const User = require("../models/UserSchema");
const Course = require("../models/CourseSchema");
const Lecture = require("../models/lectureSchema");

// Database Connection
const dbConnect = async () => {
  try {
    await mongoose.connect(config.MONGODB_URL);
    console.log("DB Connected Successfully for Seeding");
  } catch (error) {
    console.error("DB Connection Failed", error);
    process.exit(1);
  }
};

const SAMPLE_VIDEOS = [
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackAds.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];

const CATEGORIES = [
  "Web Development",
  "Data Science",
  "Mobile Development",
  "Design",
  "Marketing",
  "Business",
];
const LEVELS = ["Beginner", "Medium", "Advanced"];

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const seedData = async () => {
  try {
    await dbConnect();

    // 1. Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Course.deleteMany({});
    await Lecture.deleteMany({});

    const hashedPassword = await bcrypt.hash("password123", 10);

    // 2. Generate Instructors (10)
    console.log("Generating Instructors...");
    const instructors = [];
    for (let i = 1; i <= 10; i++) {
      instructors.push({
        name: `Instructor ${i}`,
        email: `instructor${i}@example.com`,
        password: hashedPassword,
        accountType: "Instructor",
        profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=instructor${i}`,
      });
    }
    const createdInstructors = await User.insertMany(instructors);

    // 3. Generate Students (50)
    console.log("Generating Students...");
    const students = [];
    for (let i = 1; i <= 50; i++) {
      students.push({
        name: `Student ${i}`,
        email: `student${i}@example.com`,
        password: hashedPassword,
        accountType: "Student",
        profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=student${i}`,
      });
    }
    await User.insertMany(students);

    // 4. Generate Courses (20)
    console.log("Generating Courses and Lectures...");
    for (let i = 1; i <= 20; i++) {
      const instructor = createdInstructors[getRandomInt(0, 9)];
      const numLectures = getRandomInt(4, 10);
      const lectures = [];

      for (let j = 1; j <= numLectures; j++) {
        const lecture = await Lecture.create({
          lectureTitle: `Lecture ${j}: Understanding ${CATEGORIES[i % CATEGORIES.length]}`,
          videoUrl: SAMPLE_VIDEOS[j % SAMPLE_VIDEOS.length],
          isPreviewFree: j === 1, // First lecture free as requested
          publicId: `sample_video_${i}_${j}`,
        });
        lectures.push(lecture._id);
      }

      const course = await Course.create({
        courseTitle: `${CATEGORIES[i % CATEGORIES.length]} Masterclass ${i}`,
        subTitle: `A comprehensive guide to ${CATEGORIES[i % CATEGORIES.length]}`,
        description: `This is a seeded course description for ${CATEGORIES[i % CATEGORIES.length]}. It covers all the essential topics from beginner to advanced levels.`,
        lectures: lectures,
        creator: instructor._id,
        category: CATEGORIES[i % CATEGORIES.length],
        coursePrice: getRandomInt(200, 600),
        price: getRandomInt(200, 600), // Setting both just in case UI uses either
        courseThumbnail: `https://picsum.photos/seed/course${i}/800/450`,
        courseLevel: LEVELS[getRandomInt(0, 2)],
        isPublished: true,
      });

      // Add course to instructor's courses list
      await User.findByIdAndUpdate(instructor._id, {
        $push: { courses: course._id },
      });
    }

    console.log("Seeding Completed Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding Failed:", error);
    process.exit(1);
  }
};

seedData();
