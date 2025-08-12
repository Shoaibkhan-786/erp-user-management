import 'dotenv/config';
import mysql from 'mysql2/promise';
import db from '../models/index.js';

const { sequelize, Role, Company, User } = db;

async function seed() {
  try {
    const connectionConfig = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER
    };

    if (process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim() !== '') {
      connectionConfig.password = process.env.DB_PASSWORD;
    }

    // Create the DB if it doesn't exist
    const connection = await mysql.createConnection(connectionConfig);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`Database "${process.env.DB_NAME}" ensured.`);
    await connection.end();

    // Connect Sequelize to the DB and sync
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Tables synced.');

    // Seed Company
    const [company] = await Company.findOrCreate({ where: { name: 'Testing Company' } });

    // Seed Roles
    const roles = ['CA', 'Store Manager', 'Finance Manager'];
    for (const role of roles) {
      await Role.findOrCreate({
        where: { name: role, companyId: company.id },
      });
    }

    // Create initial CA user
    const caEmail = 'ca@example.com';
    const password = 'Password123';
    const existing = await User.findOne({ where: { email: caEmail } });
    if (!existing) {
      const caRole = await Role.findOne({ where: { name: 'CA', companyId: company.id } });
      await User.create({
        name: 'Company Admin',
        email: caEmail,
        password,
        companyId: company.id,
        roleId: caRole.id,
        createdBy: null
      });
      console.log('Created CA user:', caEmail, 'password:', password);
    } else {
      console.log('CA user already exists:', caEmail);
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

seed();
