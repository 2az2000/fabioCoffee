"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../prisma/client");
const auth_1 = require("../utils/auth");
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');
        await client_1.prisma.orderItem.deleteMany();
        await client_1.prisma.order.deleteMany();
        await client_1.prisma.item.deleteMany();
        await client_1.prisma.category.deleteMany();
        await client_1.prisma.table.deleteMany();
        await client_1.prisma.admin.deleteMany();
        console.log('🧹 Cleared existing data');
        const admin = await client_1.prisma.admin.create({
            data: {
                email: 'admin@fabiocafe.com',
                password: await (0, auth_1.hashPassword)('admin123')
            }
        });
        console.log('👤 Created admin user:', admin.email);
        const tables = await Promise.all([
            client_1.prisma.table.create({ data: { number: 1, capacity: 2 } }),
            client_1.prisma.table.create({ data: { number: 2, capacity: 2 } }),
            client_1.prisma.table.create({ data: { number: 3, capacity: 4 } }),
            client_1.prisma.table.create({ data: { number: 4, capacity: 4 } }),
            client_1.prisma.table.create({ data: { number: 5, capacity: 6 } }),
            client_1.prisma.table.create({ data: { number: 6, capacity: 8 } })
        ]);
        console.log('🪑 Created', tables.length, 'tables');
        const categories = await Promise.all([
            client_1.prisma.category.create({
                data: {
                    name: 'Hot Beverages',
                    description: 'Freshly brewed coffee and hot drinks',
                    isActive: true
                }
            }),
            client_1.prisma.category.create({
                data: {
                    name: 'Cold Beverages',
                    description: 'Refreshing cold drinks and smoothies',
                    isActive: true
                }
            }),
            client_1.prisma.category.create({
                data: {
                    name: 'Breakfast',
                    description: 'Start your day with our breakfast options',
                    isActive: true
                }
            }),
            client_1.prisma.category.create({
                data: {
                    name: 'Lunch',
                    description: 'Delicious lunch options',
                    isActive: true
                }
            }),
            client_1.prisma.category.create({
                data: {
                    name: 'Desserts',
                    description: 'Sweet treats and pastries',
                    isActive: true
                }
            })
        ]);
        console.log('📂 Created', categories.length, 'categories');
        const items = await Promise.all([
            client_1.prisma.item.create({
                data: {
                    name: 'Espresso',
                    description: 'Rich and bold single shot of espresso',
                    price: 3.50,
                    categoryId: categories[0].id,
                    isActive: true,
                    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400'
                }
            }),
            client_1.prisma.item.create({
                data: {
                    name: 'Cappuccino',
                    description: 'Espresso with steamed milk and foam',
                    price: 4.50,
                    categoryId: categories[0].id,
                    isActive: true,
                    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400'
                }
            }),
            client_1.prisma.item.create({
                data: {
                    name: 'Latte',
                    description: 'Smooth espresso with steamed milk',
                    price: 5.00,
                    categoryId: categories[0].id,
                    isActive: true,
                    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400'
                }
            }),
            client_1.prisma.item.create({
                data: {
                    name: 'Americano',
                    description: 'Espresso with hot water',
                    price: 4.00,
                    categoryId: categories[0].id,
                    isActive: true,
                    imageUrl: 'https://images.unsplash.com/photo-1547938090-2c0a6c1d3b30?w=400'
                }
            }),
            client_1.prisma.item.create({
                data: {
                    name: 'Iced Coffee',
                    description: 'Chilled coffee over ice',
                    price: 4.50,
                    categoryId: categories[1].id,
                    isActive: true,
                    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400'
                }
            }),
            client_1.prisma.item.create({
                data: {
                    name: 'Cold Brew',
                    description: 'Smooth cold brewed coffee',
                    price: 5.50,
                    categoryId: categories[1].id,
                    isActive: true,
                    imageUrl: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=400'
                }
            }),
            client_1.prisma.item.create({
                data: {
                    name: 'Fresh Orange Juice',
                    description: 'Freshly squeezed orange juice',
                    price: 6.00,
                    categoryId: categories[1].id,
                    isActive: true,
                    imageUrl: 'https://images.unsplash.com/photo-1544003484-532cd609dad9?w=400'
                }
            }),
            client_1.prisma.item.create({
                data: {
                    name: 'Croissant',
                    description: 'Buttery flaky croissant',
                    price: 3.50,
                    categoryId: categories[2].id,
                    isActive: true,
                    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'
                }
            }),
            client_1.prisma.item.create({
                data: {
                    name: 'Bagel with Cream Cheese',
                    description: 'Fresh bagel with cream cheese',
                    price: 5.00,
                    categoryId: categories[2].id,
                    isActive: true,
                    imageUrl: 'https://images.unsplash.com/photo-1585220058055-0e6b8c51c6c6?w=400'
                }
            }),
            client_1.prisma.item.create({
                data: {
                    name: 'Avocado Toast',
                    description: 'Toasted bread with avocado and herbs',
                    price: 8.50,
                    categoryId: categories[2].id,
                    isActive: true,
                    imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400'
                }
            }),
            client_1.prisma.item.create({
                data: {
                    name: 'Club Sandwich',
                    description: 'Triple decker sandwich with turkey, bacon, and vegetables',
                    price: 12.00,
                    categoryId: categories[3].id,
                    isActive: true,
                    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400'
                }
            }),
            client_1.prisma.item.create({
                data: {
                    name: 'Caesar Salad',
                    description: 'Romaine lettuce with Caesar dressing and croutons',
                    price: 9.50,
                    categoryId: categories[3].id,
                    isActive: true,
                    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400'
                }
            }),
            client_1.prisma.item.create({
                data: {
                    name: 'Chocolate Cake',
                    description: 'Rich chocolate cake with frosting',
                    price: 6.50,
                    categoryId: categories[4].id,
                    isActive: true,
                    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'
                }
            }),
            client_1.prisma.item.create({
                data: {
                    name: 'Tiramisu',
                    description: 'Classic Italian dessert',
                    price: 7.50,
                    categoryId: categories[4].id,
                    isActive: true,
                    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400'
                }
            }),
            client_1.prisma.item.create({
                data: {
                    name: 'Cheesecake',
                    description: 'Creamy cheesecake with berry topping',
                    price: 6.00,
                    categoryId: categories[4].id,
                    isActive: true,
                    imageUrl: 'https://images.unsplash.com/photo-1567171544556-1f8d2d5e3a7b?w=400'
                }
            })
        ]);
        console.log('☕ Created', items.length, 'items');
        console.log('✅ Database seeding completed successfully!');
        console.log('📧 Admin login: admin@fabiocafe.com / admin123');
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
    finally {
        await client_1.prisma.$disconnect();
    }
};
if (require.main === module) {
    seedDatabase();
}
exports.default = seedDatabase;
//# sourceMappingURL=seed.js.map