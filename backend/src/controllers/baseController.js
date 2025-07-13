/**
 * Base Controller
 * Provides common functionality for all controllers
 */
class BaseController {
  constructor(model, options = {}) {
    this.model = model;
    this.options = options;
  }

  async findAll(filter = {}, options = {}) {
    if (!this.model) {
      throw new Error('Model not provided');
    }

    try {
      return await this.model.findAll({
        where: filter,
        ...options,
      });
    } catch (error) {
      throw new Error(`Failed to fetch records: ${error.message}`);
    }
  }

  async findByPk(id, options = {}) {
    if (!this.model) {
      throw new Error('Model not provided');
    }

    try {
      return await this.model.findByPk(id, options);
    } catch (error) {
      throw new Error(`Failed to fetch record by ID: ${error.message}`);
    }
  }

  async findOne(filter = {}, options = {}) {
    if (!this.model) {
      throw new Error('Model not provided');
    }

    try {
      return await this.model.findOne({
        where: filter,
        ...options,
      });
    } catch (error) {
      throw new Error(`Failed to fetch record: ${error.message}`);
    }
  }

  async create(data, options = {}) {
    if (!this.model) {
      throw new Error('Model not provided');
    }

    try {
      return await this.model.create(data, options);
    } catch (error) {
      throw new Error(`Failed to create record: ${error.message}`);
    }
  }

  async update(id, data, options = {}) {
    if (!this.model) {
      throw new Error('Model not provided');
    }

    try {
      const [affectedRows] = await this.model.update(data, {
        where: { id },
        ...options,
      });

      if (affectedRows === 0) {
        throw new Error('Record not found');
      }

      return await this.findByPk(id);
    } catch (error) {
      throw new Error(`Failed to update record: ${error.message}`);
    }
  }

  async delete(id, options = {}) {
    if (!this.model) {
      throw new Error('Model not provided');
    }

    try {
      const affectedRows = await this.model.destroy({
        where: { id },
        ...options,
      });

      if (affectedRows === 0) {
        throw new Error('Record not found');
      }

      return { success: true, message: 'Record deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete record: ${error.message}`);
    }
  }

  // Helper method for pagination
  getPaginationOptions(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return {
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  }

  // Helper method for building search conditions
  buildSearchConditions(searchParams = {}) {
    const conditions = {};

    Object.keys(searchParams).forEach((key) => {
      if (
        searchParams[key] !== undefined &&
        searchParams[key] !== null &&
        searchParams[key] !== ''
      ) {
        conditions[key] = searchParams[key];
      }
    });

    return conditions;
  }
}

module.exports = BaseController;
