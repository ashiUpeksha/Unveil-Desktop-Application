const pool = require('./db');

async function checkEventImageTable() {
  try {
    // Check if eventimage table exists and its structure
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'eventimage'
      ORDER BY ordinal_position
    `);
    
    console.log('EventImage table structure:');
    console.log(result.rows);
    
    // Check for primary key column
    const hasIdColumn = result.rows.some(row => row.column_name === 'id');
    const hasEventImageIdColumn = result.rows.some(row => row.column_name === 'event_image_id');
    
    if (hasEventImageIdColumn) {
      console.log('\n✅ eventimage table has event_image_id column (correct primary key)');
    } else if (hasIdColumn) {
      console.log('\n✅ eventimage table has id column');
    } else {
      console.log('\n⚠️  WARNING: eventimage table does not have a primary key column!');
    }

    // Check existing data
    const dataResult = await pool.query('SELECT COUNT(*) as count FROM eventimage');
    console.log(`\n📊 Total records in eventimage table: ${dataResult.rows[0].count}`);

    if (dataResult.rows[0].count > 0) {
      const sampleResult = await pool.query(`
        SELECT event_image_id, event_id, images_and_videos, created_by 
        FROM eventimage 
        WHERE is_active = true 
        ORDER BY event_image_id 
        LIMIT 5
      `);
      console.log('\n📋 Sample records:');
      sampleResult.rows.forEach(row => {
        console.log(`  ID: ${row.event_image_id}, Event: ${row.event_id}, Path: ${row.images_and_videos}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    process.exit(0);
  }
}

checkEventImageTable();
