const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Course = require('./src/models/CourseSchema');
const User = require('./src/models/UserSchema');

// Connect to database
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

async function testDatabaseOperations() {
  try {
    console.log('🧪 Testing database operations...');

    // Get a sample course and user
    const course = await Course.findOne();
    const user = await User.findOne();

    if (!course) {
      console.log('❌ No courses found in database');
      return;
    }

    if (!user) {
      console.log('❌ No users found in database');
      return;
    }

    console.log('📊 Sample data:');
    console.log('Course ID:', course._id);
    console.log('Course enrolled students:', course.enrolledStudents);
    console.log('User ID:', user._id);
    console.log('User enrolled courses:', user.enrolledCourses);

    // Test adding enrollment
    console.log('\n🔄 Testing enrollment...');
    
    const updatedCourse = await Course.findByIdAndUpdate(
      course._id,
      {
        $addToSet: {
          enrolledStudents: user._id,
        },
      },
      { new: true }
    );

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: {
          enrolledCourses: course._id,
        },
      },
      { new: true }
    );

    console.log('✅ After enrollment:');
    console.log('Course enrolled students:', updatedCourse.enrolledStudents);
    console.log('User enrolled courses:', updatedUser.enrolledCourses);

    // Test direct database query
    console.log('\n🔍 Testing direct database query...');
    const directCourse = await Course.findById(course._id);
    const directUser = await User.findById(user._id);

    console.log('Direct query results:');
    console.log('Course enrolled students:', directCourse.enrolledStudents);
    console.log('User enrolled courses:', directUser.enrolledCourses);

    // Test with populate
    console.log('\n🔍 Testing with populate...');
    const populatedCourse = await Course.findById(course._id).populate('enrolledStudents');
    const populatedUser = await User.findById(user._id).populate('enrolledCourses');

    console.log('Populated results:');
    console.log('Course enrolled students:', populatedCourse.enrolledStudents);
    console.log('User enrolled courses:', populatedUser.enrolledCourses);

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the test
testDatabaseOperations(); 