import { BaseService } from '../../shared/services/base.service.js';
import { PaymentModeModel } from './models/payment-mode.model.js';
import { PaymentModeRepository } from './payment-mode.repository.js';
import { AuditActions } from '../../shared/constants/global.constants.js';

export class PaymentModeService extends BaseService<PaymentModeModel, PaymentModeRepository> {
  constructor(repository?: PaymentModeRepository) {
    super(repository || new PaymentModeRepository());
  }

  async getAllModes(): Promise<PaymentModeModel[]> {
    this.ensureTenant();
    let modes = await this.repository.findAllModes();

    // Default Seed Payment Modes if uninitialized for tenant
    if (modes.length === 0) {
      modes = await this.repository.bulkCreate([
        { code: 'CASH', name: 'Cash Payment', description: 'Counter cash collection', isEnabled: true, displayOrder: 1 },
        { code: 'UPI', name: 'UPI / QR Code', description: 'Instant Mobile Transfer', isEnabled: true, displayOrder: 2 },
        { code: 'BANK_TRANSFER', name: 'Bank Transfer (NEFT/IMPS)', description: 'Direct Wire Transfer', isEnabled: true, displayOrder: 3 },
        { code: 'CARD', name: 'Credit / Debit Card', description: 'POS Card Terminal', isEnabled: true, displayOrder: 4 },
        { code: 'CHEQUE', name: 'Bank Cheque', description: 'Cheque deposit', isEnabled: true, displayOrder: 5 },
      ]);
    }
    return modes;
  }

  async toggleMode(id: string, isEnabled: boolean): Promise<PaymentModeModel> {
    this.ensureTenant();
    const mode = await this.getByIdOrThrow(id, 'Payment Mode');
    await mode.update({ isEnabled });
    this.publishAudit(AuditActions.SETTINGS_UPDATED, 'PaymentMode', mode.id, { code: mode.code, isEnabled });
    return mode;
  }
}
