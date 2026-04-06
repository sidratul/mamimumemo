import { ContractsService } from "./contracts.service.ts";
import { createContractInput, updateContractInput } from "./contracts.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const contractsService = new ContractsService();

export const resolvers = {
  Query: {
    daycareContracts: (
      _: unknown,
      { daycareId, status }: { daycareId: string; status?: string },
      context: AppContext
    ) => {
      return contractsService.getDaycareContracts(daycareId, status, context);
    },
    parentContracts: (
      _: unknown,
      { parentId, status }: { parentId: string; status?: string },
      context: AppContext
    ) => {
      return contractsService.getParentContracts(parentId, status, context);
    },
    contract: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return contractsService.getContract(id, context);
    },
    activeContracts: (
      _: unknown,
      { daycareId }: { daycareId: string },
      context: AppContext
    ) => {
      return contractsService.getActiveContracts(daycareId, context);
    },
  },
  Mutation: {
    createContract: (
      _: unknown,
      { input }: { input: typeof createContractInput._type },
      context: AppContext
    ) => {
      createContractInput.parse(input);
      return contractsService.createContract(input, context);
    },
    updateContract: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateContractInput._type },
      context: AppContext
    ) => {
      updateContractInput.parse(input);
      return contractsService.updateContract(id, input, context);
    },
    updateContractStatus: (
      _: unknown,
      { id, status }: { id: string; status: string },
      context: AppContext
    ) => {
      return contractsService.updateContractStatus(id, status, context);
    },
    terminateContract: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return contractsService.terminateContract(id, context);
    },
  },
};
