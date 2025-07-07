import { PaymentStatusEntity } from "../entiteis/payment-status.entity";

export class ReturnPaymentStatus {
  id: number;
  name: string;

  constructor(paymentStatus: PaymentStatusEntity) {
    this.id = paymentStatus.id;
    this.name = paymentStatus.name;
  }
}