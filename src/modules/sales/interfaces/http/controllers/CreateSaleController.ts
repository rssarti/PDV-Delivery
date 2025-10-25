import { Request, Response } from 'express';
import { CreateSaleUseCase } from '../../../application/use-cases/create-sale/CreateSaleUseCase';

export class CreateSaleController {
  constructor(private createSaleUseCase: CreateSaleUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { items, total, paymentMethod, customerId } = req.body;

      const result = await this.createSaleUseCase.execute({
        items,
        total,
        paymentMethod,
        customerId,
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Sale created successfully',
      });
    } catch (error: any) {
      console.error('Error creating sale:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to create sale',
        message: error.message,
      });
    }
  }
}
