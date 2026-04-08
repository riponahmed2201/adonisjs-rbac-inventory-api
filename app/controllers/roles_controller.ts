import Role from '#models/role'
import Permission from '#models/permission'

export default class RolesController {
  async index() {
    return Role.query().preload('permissions')
  }

  async permissions() {
    return Permission.all()
  }
}
