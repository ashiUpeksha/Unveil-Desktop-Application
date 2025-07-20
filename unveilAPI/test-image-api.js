const axios = require('axios');

async function testImageAPI() {
  try {
    // Test getting images for a specific event
    const eventId = 1; // Replace with an actual event ID from your database
    console.log(`Testing GET /event/${eventId}/images...`);
    
    const response = await axios.get(`http://localhost:3000/api/event/${eventId}/images`);
    console.log('API Response:', response.data);
    
    if (response.data.success) {
      console.log('✅ Image API is working correctly!');
      console.log('Images found:', response.data.images.length);
      response.data.images.forEach((img, index) => {
        console.log(`  ${index + 1}. ID: ${img.id}, Path: ${img.path}`);
      });
    } else {
      console.log('❌ API returned success: false');
    }
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
  }
}

testImageAPI();
