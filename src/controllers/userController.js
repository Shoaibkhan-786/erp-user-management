import db from '../models/index.js';

const { User, Role } = db;

/**
 * Create a new user
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {Promise<Response>}
 */
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, roleId } = req.body;

    const role = await Role.findOne({ where: { id: roleId, companyId: req.user.companyId } });
    if (!role) return res.status(400).json({ message: 'Role not found' });
    if (role.name.toLowerCase() === 'ca') {
      return res.status(400).json({ message: "Can't create user with CA role" });
    };

    await User.create({
      name,
      email,
      password,
      roleId: roleId,
      companyId: req.user.companyId,
      createdBy: req.user.id
    });

    return res.status(201).json({ message: "User created Successfully" });
  } catch (err) {
    console.log(err)
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    next(err);
  }
};

/**
 * Get all users in the same company
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {Promise<Response>}
 */
export const getUsers = async (req, res, next) => {
  try {
    const { page, perPage } = req.query;
    const { companyId } = req.user;
    const offset = (page - 1) * perPage;

    const { count, rows } = await User.findAndCountAll({
      where: {
        companyId,
        isDeleted: false
      },
      attributes: { exclude: ['password', 'isDeleted', 'createdAt', 'updatedAt'] },
      limit: perPage,
      offset,
      order: [['id', 'ASC']],
      include: [{ model: db.Role, attributes: ['id', 'name'] }]
    });

    return res.json({
      meta: {
        total: count,
        page,
        perPage,
        totalPages: Math.ceil(count / perPage)
      },
      users: rows
    });
  } catch (err) {
    next(err);
  }
};


export const getUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await db.User.findByPk(id, {
      attributes: { exclude: ['password', 'isDeleted', 'createdAt', 'updatedAt'] },
      include: [{ model: db.Role, attributes: ['id', 'name'] }, { model: db.Company, attributes: ['id', 'name'] }]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a user by ID
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {Promise<Response>}
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const { companyId } = req.user;
    const user = await User.findByPk(userId);
    if (!user || user.isDeleted) return res.status(404).json({ message: 'User not found' });
    if (user.companyId !== companyId) return res.status(403).json({ message: "Can't delete user outside your company" });
    user.isDeleted = true;
    await user.save();
    return res.json({ message: 'User deleted Successfully' });
  } catch (err) {
    next(err);
  }
};
