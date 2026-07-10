const BaseService = require('./BaseService');
const Flashcard = require('../models/Flashcard');

class FlashcardService extends BaseService {
  constructor() {
    super(Flashcard);
  }
}

module.exports = new FlashcardService();
