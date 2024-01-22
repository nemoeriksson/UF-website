import { prisma, data } from '$lib';
import type { PageServerLoad } from './$types';

const members = data.members;

export const load = (async () => {
    const imageData = data.imageData;
    
    return {imageData, members};
}) satisfies PageServerLoad;