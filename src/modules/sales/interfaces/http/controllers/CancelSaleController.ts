import { Request, Response } from 'express';
import { CancelSaleUseCase } from '../../../application/use-cases/cancel-sale/CancelSaleUseCase';

export class CancelSaleController {
  constructor(private cancelSaleUseCase: CancelSaleUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      await this.cancelSaleUseCase.execute(id, reason);

      res.json({
        success: true,
        message: 'Sale cancelled successfully',
      });
    } catch (error: any) {
      console.error('Error canceling sale:', error);

      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: 'Sale not found',
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Failed to cancel sale',
          message: error.message,
        });
      }
    }
  }
}
