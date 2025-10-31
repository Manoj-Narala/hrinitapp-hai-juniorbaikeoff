const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/initiatives.json');

/**
 * Database utility for JSON file-based storage
 */
class Database {
  /**
   * Initialize the database file if it doesn't exist
   */
  async init() {
    try {
      await fs.access(DB_PATH);
    } catch (error) {
      // File doesn't exist, create it with empty array
      await fs.writeFile(DB_PATH, JSON.stringify({ initiatives: [] }, null, 2));
      console.log('Database file created:', DB_PATH);
    }
  }

  /**
   * Read all initiatives from the database
   */
  async read() {
    try {
      const data = await fs.readFile(DB_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading database:', error);
      return { initiatives: [] };
    }
  }

  /**
   * Write initiatives to the database
   */
  async write(data) {
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing to database:', error);
      throw error;
    }
  }

  /**
   * Get all initiatives
   */
  async getAllInitiatives() {
    const data = await this.read();
    return data.initiatives || [];
  }

  /**
   * Get a single initiative by ID
   */
  async getInitiativeById(id) {
    const data = await this.read();
    return data.initiatives.find(init => init.id === id);
  }

  /**
   * Add a new initiative
   */
  async addInitiative(initiative) {
    const data = await this.read();
    data.initiatives.push(initiative);
    await this.write(data);
    return initiative;
  }

  /**
   * Update an existing initiative
   */
  async updateInitiative(id, updates) {
    const data = await this.read();
    const index = data.initiatives.findIndex(init => init.id === id);
    
    if (index === -1) {
      throw new Error('Initiative not found');
    }

    data.initiatives[index] = { ...data.initiatives[index], ...updates };
    await this.write(data);
    return data.initiatives[index];
  }

  /**
   * Delete an initiative
   */
  async deleteInitiative(id) {
    const data = await this.read();
    const index = data.initiatives.findIndex(init => init.id === id);
    
    if (index === -1) {
      throw new Error('Initiative not found');
    }

    const deleted = data.initiatives.splice(index, 1);
    await this.write(data);
    return deleted[0];
  }
}

module.exports = new Database();
