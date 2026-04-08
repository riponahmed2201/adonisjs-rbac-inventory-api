import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import Permission from '#models/permission'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const permissionNames = ['create product', 'edit product', 'delete product', 'manage users']
    const roles = ['admin', 'manager', 'staff']

    for (const name of permissionNames) {
      await Permission.firstOrCreate({ name }, { description: `${name} permission` })
    }

    for (const name of roles) {
      await Role.firstOrCreate({ name }, { description: `${name} role` })
    }

    const adminRole = await Role.findByOrFail('name', 'admin')
    const managerRole = await Role.findByOrFail('name', 'manager')
    const staffRole = await Role.findByOrFail('name', 'staff')
    const allPermissions = await Permission.all()
    const managerPermissions = allPermissions.filter((p) => p.name !== 'manage users')
    const staffPermissions = allPermissions.filter((p) => p.name === 'create product')

    await adminRole.related('permissions').sync(allPermissions.map((p) => p.id))
    await managerRole.related('permissions').sync(managerPermissions.map((p) => p.id))
    await staffRole.related('permissions').sync(staffPermissions.map((p) => p.id))

    const adminUser = await User.firstOrCreate(
      { email: 'admin@example.com' },
      {
        fullName: 'System Admin',
        password: 'Admin@12345',
      }
    )

    await adminUser.related('roles').sync([adminRole.id])
  }
}
