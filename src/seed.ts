import { connectDB, disconnectDB } from "./config/database.js";
import { User } from "./models/User.js";
import { Project } from "./models/Project.js";
import { hashPassword } from "./utils/password.js";

const seedDatabase = async (): Promise<void> => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});

    console.log("🗑️  Cleared existing data");

    // Create admin user
    const adminPassword = await hashPassword("admin@123");
    const admin = await User.create({
      name: "Admin User",
      email: "admin@projekto.com",
      password: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
    });

    console.log("✓ Admin user created");
    console.log(`  Email: admin@projekto.com`);
    console.log(`  Password: admin@123`);

    // Create sample users
    const managerPassword = await hashPassword("manager@123");
    const manager = await User.create({
      name: "Manager User",
      email: "manager@projekto.com",
      password: managerPassword,
      role: "MANAGER",
      status: "ACTIVE",
    });

    const staffPassword = await hashPassword("staff@123");
    const staff = await User.create({
      name: "Staff User",
      email: "staff@projekto.com",
      password: staffPassword,
      role: "STAFF",
      status: "ACTIVE",
    });

    console.log("✓ Sample users created");
    console.log(`  Manager: manager@projekto.com (manager@123)`);
    console.log(`  Staff: staff@projekto.com (staff@123)`);

    // Create sample projects
    const projects = [
      {
        name: "Website Redesign",
        description: "Redesign the company website with modern UI/UX",
        createdBy: admin._id,
      },
      {
        name: "Mobile App Development",
        description: "Build native mobile application for iOS and Android",
        createdBy: manager._id,
      },
      {
        name: "API Integration",
        description: "Integrate third-party APIs for enhanced functionality",
        createdBy: staff._id,
      },
      {
        name: "Database Optimization",
        description: "Optimize database queries and indexes",
        createdBy: admin._id,
      },
    ];

    await Project.create(projects);
    console.log(`✓ Created ${projects.length} sample projects`);

    console.log(`
╔════════════════════════════════════════╗
║      ✨ Database Seeded Successfully   ║
╠════════════════════════════════════════╣
║  Users: 3 (Admin, Manager, Staff)      ║
║  Projects: 4                            ║
║                                         ║
║  Test Credentials:                      ║
║  Admin: admin@projekto.com / admin@123  ║
║  Manager: manager@projekto.com / mgr123║
║  Staff: staff@projekto.com / staff@123  ║
╚════════════════════════════════════════╝
    `);
  } catch (error) {
    console.error("✗ Seeding failed:", error);
  } finally {
    await disconnectDB();
  }
};

seedDatabase();
