import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { CreateAdditionalAddressUseCase } from '../application/use-cases/create-additional-address/CreateAdditionalAddressUseCase';
import { ListClientAddressesUseCase } from '../application/use-cases/list-client-addresses/ListClientAddressesUseCase';
import { ToggleAddressFavoriteUseCase } from '../application/use-cases/toggle-address-favorite/ToggleAddressFavoriteUseCase';
import { DeleteAdditionalAddressUseCase } from '../application/use-cases/delete-additional-address/DeleteAdditionalAddressUseCase';
import { SelectAddressForOrderUseCase } from '../application/use-cases/select-address-for-order/SelectAddressForOrderUseCase';
import { CreateAdditionalAddressDTO } from '../application/dtos/AdditionalAddressDTO';
import { CLIENT_TYPES } from '../types';

@injectable()
export class AdditionalAddressController {
  constructor(
    @inject(CLIENT_TYPES.CreateAdditionalAddressUseCase)
    private createAdditionalAddressUseCase: CreateAdditionalAddressUseCase,
    @inject(CLIENT_TYPES.ListClientAddressesUseCase)
    private listClientAddressesUseCase: ListClientAddressesUseCase,
    @inject(CLIENT_TYPES.ToggleAddressFavoriteUseCase)
    private toggleAddressFavoriteUseCase: ToggleAddressFavoriteUseCase,
    @inject(CLIENT_TYPES.DeleteAdditionalAddressUseCase)
    private deleteAdditionalAddressUseCase: DeleteAdditionalAddressUseCase,
    @inject(CLIENT_TYPES.SelectAddressForOrderUseCase)
    private selectAddressForOrderUseCase: SelectAddressForOrderUseCase
  ) {}

  async createAdditionalAddress(req: Request, res: Response): Promise<void> {
    try {
      const { clientId } = req.params;
      const addressData: Omit<CreateAdditionalAddressDTO, 'clientId'> =
        req.body;

      if (
        !addressData.address ||
        !addressData.addressNumber ||
        !addressData.neighborhood ||
        !addressData.zipCode ||
        !addressData.label
      ) {
        res.status(400).json({
          error:
            'Address, addressNumber, neighborhood, zipCode and label are required',
        });
        return;
      }

      const data: CreateAdditionalAddressDTO = {
        ...addressData,
        clientId,
      };

      const address = await this.createAdditionalAddressUseCase.execute(data);

      res.status(201).json({
        success: true,
        data: address,
        message: 'Additional address created successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async listClientAddresses(req: Request, res: Response): Promise<void> {
    try {
      const { clientId } = req.params;

      const addresses = await this.listClientAddressesUseCase.execute(clientId);

      res.status(200).json({
        success: true,
        data: addresses,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async toggleFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { addressId } = req.params;

      const address =
        await this.toggleAddressFavoriteUseCase.execute(addressId);

      res.status(200).json({
        success: true,
        data: address,
        message: 'Address favorite status updated successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async deleteAddress(req: Request, res: Response): Promise<void> {
    try {
      const { addressId } = req.params;

      await this.deleteAdditionalAddressUseCase.execute(addressId);

      res.status(200).json({
        success: true,
        message: 'Additional address deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async selectAddressForOrder(req: Request, res: Response): Promise<void> {
    try {
      const { clientId } = req.params;
      const { addressId, useMainAddress } = req.body;

      await this.selectAddressForOrderUseCase.execute({
        clientId,
        addressId,
        useMainAddress,
      });

      res.status(200).json({
        success: true,
        message: 'Address selected for order successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
