class BaseService {
  constructor(model) {
    this.model = model;
  }

  async getAll() {
    return this.model.findAll();
  }

  async getById(id) {
    return this.model.findById(id);
  }
}

module.exports = BaseService; 