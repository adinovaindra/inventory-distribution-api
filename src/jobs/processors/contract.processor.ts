import { Job } from "bullmq";
import { findSalesOrderByIdRepo } from "../../repositories/salesOrder.repository";
import { findContractByEndDateRepo, updateContractRepo } from "../../repositories/contract.repository";

export const contractJob = async (job: Job) => {
  if (job.name === "fulfillment") {
    console.log(`Processing fulfillment job ${job.id}`);

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
  }

  if (job.name === "expired-check") {
    console.log(`Processing expired-check job ${job.id}`);

    const listExpiredContracts = await findContractByEndDateRepo();

    for (const contract of listExpiredContracts) {
      await updateContractRepo(contract.id, { status: "COMPLETED" });
    }

    return;
  }
};
