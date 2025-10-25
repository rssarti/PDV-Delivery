import { CreateSaleUseCaseWithDI } from '../../../src/modules/sales/use-cases/with-di/SalesUseCasesWithDI';
import { IDatabaseService, IRepositoryCollection } from '../../../src/shared/infra/database/services/DatabaseService';
import { SaleStatus } from '../../../src/modules/sales/enums/SaleStatus';

/**
 * 🧪 Exemplo de Teste Unitário - SEM SINGLETON, COM DI PURA
 * 
 * Vantagens da abordagem sem Singleton:
 * ✅ Mock fácil das dependências
 * ✅ Isolamento completo entre testes
 * ✅ Sem estado global compartilhado
 * ✅ Testes paralelos seguros
 */

describe('CreateSaleUseCaseWithDI', () => {
  
  // 🎭 Mock do DatabaseService - FÁCIL!
  const createMockDatabaseService = (): IDatabaseService => {
    const mockSalesRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      cancel: jest.fn(),
    };

    const mockRepositories: IRepositoryCollection = {
      sales: mockSalesRepository,
      products: {},
      customers: {},
      payments: {},
      reports: {},
    };

    return {
      repositories: mockRepositories,
      getInfo: jest.fn().mockReturnValue({
        isConnected: true,
        environment: 'test',
        usingInMemory: true,
        databaseType: 'mock'
      }),
      isConnected: jest.fn().mockReturnValue(true),
    };
  };

  it('should create a sale successfully', async () => {
    // 🎯 Arrange - sem singleton, tudo controlado
    const mockDatabaseService = createMockDatabaseService();
    const mockSave = mockDatabaseService.repositories.sales.save as jest.Mock;
    
    const mockSavedSale = {
      id: 'sale-123',
      items: [{ productId: '1', quantity: 2 }],
      total: 100.50,
      paymentMethod: 'credit_card',
      status: SaleStatus.OPEN,
      createdAt: new Date('2025-01-01'),
    };
    
    mockSave.mockResolvedValue(mockSavedSale);
    
    // 🎯 Instancia use case com mock injetado
    const useCase = new CreateSaleUseCaseWithDI(mockDatabaseService);

    // 🎯 Act
    const request = {
      items: [{ productId: '1', quantity: 2 }],
      total: 100.50,
      paymentMethod: 'credit_card',
    };

    const result = await useCase.execute(request);

    // 🎯 Assert
    expect(result).toEqual({
      id: 'sale-123',
      items: [{ productId: '1', quantity: 2 }],
      total: 100.50,
      paymentMethod: 'credit_card',
      status: SaleStatus.OPEN,
      createdAt: new Date('2025-01-01'),
    });

    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({
        items: [{ productId: '1', quantity: 2 }],
        total: 100.50,
        paymentMethod: 'credit_card',
        status: SaleStatus.OPEN,
      })
    );
  });

  it('should validate required fields', async () => {
    // 🎯 Arrange
    const mockDatabaseService = createMockDatabaseService();
    const useCase = new CreateSaleUseCaseWithDI(mockDatabaseService);

    // 🎯 Act & Assert
    await expect(useCase.execute({
      items: [],
      total: 100,
      paymentMethod: 'credit_card',
    })).rejects.toThrow('Sale must have at least one item');

    await expect(useCase.execute({
      items: [{ productId: '1', quantity: 1 }],
      total: 0,
      paymentMethod: 'credit_card',
    })).rejects.toThrow('Sale total must be greater than zero');

    await expect(useCase.execute({
      items: [{ productId: '1', quantity: 1 }],
      total: 100,
      paymentMethod: '',
    })).rejects.toThrow('Payment method is required');
  });

  it('should handle database errors', async () => {
    // 🎯 Arrange
    const mockDatabaseService = createMockDatabaseService();
    const mockSave = mockDatabaseService.repositories.sales.save as jest.Mock;
    
    mockSave.mockRejectedValue(new Error('Database connection failed'));
    
    const useCase = new CreateSaleUseCaseWithDI(mockDatabaseService);

    // 🎯 Act & Assert
    await expect(useCase.execute({
      items: [{ productId: '1', quantity: 1 }],
      total: 100,
      paymentMethod: 'credit_card',
    })).rejects.toThrow('Database connection failed');
  });
});

/**
 * 🆚 COMPARAÇÃO: Como seria com SINGLETON (problemático)
 */
/*
describe('CreateSaleUseCaseFacade (com Singleton)', () => {
  
  it('should create sale - MAS TEM PROBLEMAS', async () => {
    // ❌ PROBLEMAS com Singleton:
    
    // 1. Difícil de mockar o Database singleton
    // Database.repositories.sales = mockRepository; // Modifica estado global!
    
    // 2. Testes podem interferir uns nos outros
    // Se um teste falhar, afeta os próximos
    
    // 3. Não consegue testar cenários diferentes em paralelo
    // Todos os testes usam a mesma instância global
    
    // 4. Difícil de testar error scenarios
    // Como simular falha de conexão no singleton?
    
    const useCase = new CreateSaleUseCaseFacade(); // Sem DI - depende do singleton
    
    // Teste fica limitado...
  });
});
*/

/**
 * 🎯 Teste de Integração com Container
 */
/*
describe('Sales Integration Test', () => {
  
  it('should work with container DI', async () => {
    // ✅ Com container, pode criar instância isolada para teste
    const testContainer = new Container();
    
    // Mock apenas para este teste
    const mockDatabaseService = createMockDatabaseService();
    testContainer.register('DatabaseService', () => mockDatabaseService);
    testContainer.register('CreateSaleUseCaseWithDI', () => 
      new CreateSaleUseCaseWithDI(testContainer.resolve('DatabaseService'))
    );
    
    const useCase = testContainer.resolve('CreateSaleUseCaseWithDI');
    
    // Teste isolado, sem afetar outros
    const result = await useCase.execute({
      items: [{ productId: '1', quantity: 1 }],
      total: 50,
      paymentMethod: 'cash',
    });
    
    expect(result).toBeDefined();
  });
});
*/