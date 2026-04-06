import { ContractsRepository } from "./contracts.repository.ts";
import { createContractInput, updateContractInput } from "./contracts.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";

const contractsRepository = new ContractsRepository();

export class ContractsService {
  async getDaycareContracts(
    daycareId: string,
    status: string | undefined,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Only daycare staff can view all contracts
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await contractsRepository.findByDaycareId(daycareId, status);
  }

  async getParentContracts(
    parentId: string,
    status: string | undefined,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Check if user owns this parent record
    const parent = await contractsRepository.findByParentId(parentId, status);
    
    // Allow if user is the parent or daycare staff
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    const isParent = parent.some((p: any) => p.user.userId.toString() === context.user.id);
    
    if (!allowedRoles.includes(context.user.role as UserRole) && !isParent) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await contractsRepository.findByParentId(parentId, status);
  }

  async getContract(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const contract = await contractsRepository.findById(id);
    if (!contract) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    return contract;
  }

  async getActiveContracts(daycareId: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await contractsRepository.findActiveContracts(daycareId);
  }

  async createContract(
    input: typeof createContractInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Only daycare staff can create contracts
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    // Validate dates
    if (new Date(input.endDate) <= new Date(input.startDate)) {
      throw new GraphQLError("End date must be after start date");
    }

    const contractData = {
      ...input,
      status: "active",
    };

    return await contractsRepository.create(contractData);
  }

  async updateContract(
    id: string,
    input: typeof updateContractInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const contract = await contractsRepository.findById(id);
    if (!contract) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Only daycare staff can update contracts
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    // Validate dates if updated
    if (input.startDate && input.endDate) {
      if (new Date(input.endDate) <= new Date(input.startDate)) {
        throw new GraphQLError("End date must be after start date");
      }
    }

    return await contractsRepository.update(id, input);
  }

  async updateContractStatus(
    id: string,
    status: string,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const contract = await contractsRepository.findById(id);
    if (!contract) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Only daycare staff can update status
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await contractsRepository.updateStatus(id, status);
  }

  async terminateContract(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const contract = await contractsRepository.findById(id);
    if (!contract) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Only daycare staff can terminate contracts
    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await contractsRepository.terminate(id);
  }
}
