import "dotenv/config";
import { Pool } from "pg";

async function clearData() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    // Сначала удаляем зависимые записи
    await pool.query('DELETE FROM "Post"');
    console.log("✅ Cleared Post table");
    
    await pool.query('DELETE FROM "RepairRequest"');
    console.log("✅ Cleared RepairRequest table");
    
    await pool.query('DELETE FROM "Message"');
    console.log("✅ Cleared Message table");
    
    await pool.query('DELETE FROM "Customer"');
    console.log("✅ Cleared Customer table");
    
    // Теперь удаляем пользователей
    await pool.query('DELETE FROM "User"');
    console.log("✅ Cleared User table");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
}

clearData();
