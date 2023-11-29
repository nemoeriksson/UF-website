import { prisma } from '$lib';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const products = prisma.device.findMany();
    const images = prisma.progressImage.findMany();
    
    return {products, images};
}) satisfies PageServerLoad;