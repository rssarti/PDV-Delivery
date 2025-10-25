import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { CreateClientUseCase } from '../application/use-cases/create-client/CreateClientUseCase';
import { DeleteClientUseCase } from '../application/use-cases/delete-client/DeleteClientUseCase';
import { DeactivateClientUseCase } from '../application/use-cases/deactivate-client/DeactivateClientUseCase';
import { GetClientUseCase } from '../application/use-cases/get-client/GetClientUseCase';
import { ListClientsUseCase } from '../application/use-cases/list-clients/ListClientsUseCase';
import { CreateClientDTO } from '../application/dtos/ClientDTO';
import { CLIENT_TYPES } from '../types';

@injectable()
export class ClientController {
  constructor(
    @inject(CLIENT_TYPES.CreateClientUseCase)
    private createClientUseCase: CreateClientUseCase,
    @inject(CLIENT_TYPES.DeleteClientUseCase)
    private deleteClientUseCase: DeleteClientUseCase,
    @inject(CLIENT_TYPES.DeactivateClientUseCase)
    private deactivateClientUseCase: DeactivateClientUseCase,
    @inject(CLIENT_TYPES.GetClientUseCase)
    private getClientUseCase: GetClientUseCase,
    @inject(CLIENT_TYPES.ListClientsUseCase)
    private listClientsUseCase: ListClientsUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const clientData: CreateClientDTO = req.body;

      if (!clientData.name || !clientData.email || !clientData.address) {
        res.status(400).json({
          error: 'Name, email, and address are required',
        });
        return;
      }

      const client = await this.createClientUseCase.execute(clientData);

      res.status(201).json({
        success: true,
        data: client,
        message: 'Client created successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const client = await this.getClientUseCase.execute(id);

      res.status(200).json({
        success: true,
        data: client,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Client not found',
      });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const clients = await this.listClientsUseCase.execute();

      res.status(200).json({
        success: true,
        data: clients,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await this.deleteClientUseCase.execute(id);

      res.json({
        success: true,
        message: 'Client deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async deactivate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const client = await this.deactivateClientUseCase.execute(id);

      res.json({
        success: true,
        data: client,
        message: 'Client deactivated successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
