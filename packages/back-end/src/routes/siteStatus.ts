import { Router } from 'express';
import { getSiteStatus, updateSiteStatus } from '@controllers/siteStatusController.js';

const router = Router();

// Obtener el estado actual del sitio (público)
router.get('/', getSiteStatus);

// Actualizar el estado del sitio (requiere admin)
router.put('/', updateSiteStatus);

export default router;
