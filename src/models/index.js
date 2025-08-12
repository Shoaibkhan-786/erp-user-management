import 'dotenv/config';
import { Sequelize } from 'sequelize';

import defineCompany from './company.js';
import defineRole from './role.js';
import defineUser from './user.js';


const sequelizeConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false,
};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || null,
  sequelizeConfig
);

const Company = defineCompany(sequelize);
const Role = defineRole(sequelize);
const User = defineUser(sequelize);


Company.hasMany(User, { foreignKey: 'companyId' });
User.belongsTo(Company, { foreignKey: 'companyId' });

Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

Company.hasMany(Role, { foreignKey: 'companyId' });
Role.belongsTo(Company, { foreignKey: 'companyId' });


export default { sequelize, Company, Role, User };
