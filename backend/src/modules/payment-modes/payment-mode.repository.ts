import { BaseRepository } from '../../shared/repositories/base.repository.js';
import { PaymentModeModel } from './models/payment-mode.model.js';

export class PaymentModeRepository extends BaseRepository<PaymentModeModel> {
  constructor() {
    super(PaymentModeModel);
  }

  async findAllModes(): Promise<PaymentModeModel[]> {
    return this.findAll({ order: [['displayOrder', 'ASC']] });
  }
}
