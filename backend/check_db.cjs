const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize('best_school_saas', 'postgres', 'Liyaqath@7890', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false,
});

class TenantModel extends Model {}
TenantModel.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    schoolName: { type: DataTypes.STRING(255), allowNull: false, field: 'school_name' },
    board: { type: DataTypes.STRING(100), allowNull: false, field: 'board' },
    plan: { type: DataTypes.ENUM('TRIAL', 'BASIC', 'PRO', 'ENTERPRISE'), allowNull: false, defaultValue: 'ENTERPRISE', field: 'plan' },
    licenseKey: { type: DataTypes.STRING(100), allowNull: false, unique: true, field: 'license_key' },
    adminName: { type: DataTypes.STRING(255), allowNull: false, field: 'admin_name' },
    adminEmail: { type: DataTypes.STRING(255), allowNull: false, field: 'admin_email' },
    maxStudents: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2500, field: 'max_students' },
    status: { type: DataTypes.ENUM('ACTIVE', 'DEACTIVATED'), allowNull: false, defaultValue: 'ACTIVE', field: 'status' },
  },
  { sequelize, tableName: 'tenants', timestamps: true, underscored: true }
);

async function main() {
  try {
    await sequelize.authenticate();
    console.log('✅ CONNECTED TO POSTGRES DB: best_school_saas');

    await sequelize.sync({ alter: true });
    console.log('✅ ALL POSTGRESQL TABLES SYNCHRONIZED SUCCESSFULLY!');

    const [tables] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;"
    );

    console.log(`\n📋 TOTAL POSTGRESQL TABLES IN best_school_saas: ${tables.length}`);
    tables.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.table_name}`);
    });

    const [rows] = await sequelize.query('SELECT id, school_name, admin_name, admin_email, license_key, status FROM tenants ORDER BY created_at DESC;');
    console.log(`\n🏫 TOTAL ROWS IN "tenants" TABLE: ${rows.length}`);
    if (rows.length > 0) {
      console.log('TENANTS TABLE ROWS:', JSON.stringify(rows, null, 2));
    }
  } catch (error) {
    console.error('❌ DATABASE ERROR:', error.message);
  } finally {
    await sequelize.close();
  }
}

main();
