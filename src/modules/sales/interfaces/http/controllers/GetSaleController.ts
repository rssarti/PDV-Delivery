import { Request, Response } from 'express';
import { GetSaleUseCase } from '../../../application/use-cases/get-sale/GetSaleUseCase';

export class GetSaleController {
  constructor(private getSaleUseCase: GetSaleUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const sale = await this.getSaleUseCase.execute(id);

      res.json({
        success: true,
        data: sale,
      });
    } catch (error: any) {
      console.error('Error getting sale:', error);

      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: 'Sale not found',
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to get sale',
          message: error.message,
        });
      }
    }
  }
}
