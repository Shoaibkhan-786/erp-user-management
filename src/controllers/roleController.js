import db from '../models/index.js';

export const getRoles = async (req, res, next) => {
  try {
    const { Role } = db;
    const { companyId } = req.user;
    
    const roles = await Role.findAll({
      where: { companyId },
      order: [['id', 'ASC']],
      attributes: ['id', 'name']
    });

    return res.json({ roles });
  } catch (err) {
    next(err);
  }
};
