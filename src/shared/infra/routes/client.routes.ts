import { Router } from 'express';
import { container } from '../../container';
import { ClientController } from '../../../modules/clients/controllers/ClientController';
import { CLIENT_TYPES } from '../../../modules/clients/types';

const clientRoutes: Router = Router();

const getClientController = (): ClientController => {
  return container.get(CLIENT_TYPES.ClientController) as ClientController;
};

clientRoutes.post('/', async (req, res) => {
  try {
    await getClientController().create(req, res);
  } catch (error) {
    console.error('Error in POST /clients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

clientRoutes.get('/', async (req, res) => {
  try {
    await getClientController().getAll(req, res);
  } catch (error) {
    console.error('Error in GET /clients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

clientRoutes.get('/:id', async (req, res) => {
  try {
    await getClientController().getById(req, res);
  } catch (error) {
    console.error('Error in GET /clients/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

clientRoutes.delete('/:id', async (req, res) => {
  try {
    await getClientController().delete(req, res);
  } catch (error) {
    console.error('Error in DELETE /clients/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

clientRoutes.patch('/:id/deactivate', async (req, res) => {
  try {
    await getClientController().deactivate(req, res);
  } catch (error) {
    console.error('Error in PATCH /clients/:id/deactivate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { clientRoutes };
