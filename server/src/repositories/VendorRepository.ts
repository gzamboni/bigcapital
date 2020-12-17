import { Vendor } from "models";
import TenantRepository from "./TenantRepository";

export default class VendorRepository extends TenantRepository {
  /**
   * Contact repository. 
   */
  constructor(knex, cache) {
    super(knex, cache);
    this.repositoryName = 'ContactRepository';
  }

  /**
   * Gets the repository's model.
   */
  get model() {
    return Vendor.bindKnex(this.knex);
  }

  changeBalance(vendorId: number, amount: number) {
    return super.changeNumber({ id: vendorId }, 'balance', amount);
  }

  async changeDiffBalance(
    vendorId: number,
    amount: number,
    oldAmount: number,
    oldVendorId?: number,
  ) {
    const diffAmount = amount - oldAmount;
    const asyncOpers = [];
    const _oldVendorId = oldVendorId || vendorId;

    if (vendorId != _oldVendorId) {
      const oldCustomerOper = this.changeBalance(_oldVendorId, (oldAmount * -1));
      const customerOper = this.changeBalance(vendorId, amount);

      asyncOpers.push(customerOper);
      asyncOpers.push(oldCustomerOper);
    } else {
      const balanceChangeOper = this.changeBalance(vendorId, diffAmount);
      asyncOpers.push(balanceChangeOper);
    }
    await Promise.all(asyncOpers);
  }
}
