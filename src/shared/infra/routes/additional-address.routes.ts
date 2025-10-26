import { Router } from 'express';
import { container } from '../../container';
import { AdditionalAddressController } from '../../../modules/clients/controllers/AdditionalAddressController';
import { CLIENT_TYPES } from '../../../modules/clients/types';

const additionalAddressRoutes: Router = Router();

const getAdditionalAddressController = (): AdditionalAddressController => {
  return container.get(
    CLIENT_TYPES.AdditionalAddressController
  ) as AdditionalAddressController;
};

additionalAddressRoutes.post(
  '/clients/:clientId/addresses',
  async (req, res) => {
    try {
      await getAdditionalAddressController().createAdditionalAddress(req, res);
    } catch (error) {
      console.error('Error in POST /clients/:clientId/addresses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

additionalAddressRoutes.get(
  '/clients/:clientId/addresses',
  async (req, res) => {
    try {
      await getAdditionalAddressController().listClientAddresses(req, res);
    } catch (error) {
      console.error('Error in GET /clients/:clientId/addresses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

additionalAddressRoutes.patch(
  '/addresses/:addressId/favorite',
  async (req, res) => {
    try {
      await getAdditionalAddressController().toggleFavorite(req, res);
    } catch (error) {
      console.error('Error in PATCH /addresses/:addressId/favorite:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

additionalAddressRoutes.delete('/addresses/:addressId', async (req, res) => {
  try {
    await getAdditionalAddressController().deleteAddress(req, res);
  } catch (error) {
    console.error('Error in DELETE /addresses/:addressId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

additionalAddressRoutes.post(
  '/clients/:clientId/select-address',
  async (req, res) => {
    try {
      await getAdditionalAddressController().selectAddressForOrder(req, res);
    } catch (error) {
      console.error('Error in POST /clients/:clientId/select-address:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export { additionalAddressRoutes };
