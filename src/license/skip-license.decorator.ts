import { SetMetadata } from '@nestjs/common';

export const SKIP_LICENSE = 'skipLicense';

/** Marca uma rota (ou controller) para não exigir licença válida. */
export const SkipLicense = () => SetMetadata(SKIP_LICENSE, true);
