import { Request, Response } from 'express';
import { ListSalesUseCase } from '../../../application/use-cases/list-sales/ListSalesUseCase';

export class ListSalesController {
  constructor(private listSalesUseCase: ListSalesUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { limit, offset, status } = req.query;

      const options = {
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
        status: status as string,
      };

      const sales = await this.listSalesUseCase.execute(options);

      res.json({
        success: true,
        data: sales,
        count: sales.length,
        pagination: {
          limit: options.limit || 50,
          offset: options.offset || 0,
        },
      });
    } catch (error: any) {
      console.error('Error listing sales:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list sales',
        message: error.message,
      });
    }
  }
}
