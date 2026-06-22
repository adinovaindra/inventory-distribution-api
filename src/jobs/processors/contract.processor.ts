import { Job } from "bullmq";
import { findSalesOrderByIdRepo } from "../../repositories/salesOrder.repository";
import { updateContractRepo } from "../../repositories/contract.repository";

export const contractJob = async (job: Job) => {
  const salesOrderId = job.data.salesOrderId;
  const salesOrderData = await findSalesOrderByIdRepo(salesOrderId);
  let total = 0;
  if (salesOrderData?.contractId) {
    for (const product of salesOrderData.salesOrderProducts) {
      total += product.quantityPerKg;
    }
    return updateContractRepo(salesOrderData.contractId, {
      fulfilledWeightPerKg: { increment: total },
    });
  }
};
