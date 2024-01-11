import { prisma } from '$lib';
import type { PageServerLoad } from './$types';

const members = [
    {
        'name': 'Irma Zimmerman',
        'role': 'CEO',
        'text': 'I represent the company externally but also take the major decisions & lead the company forwards.',
        'image': 'images/faces/irma.jpg'
    },
    {
        'name': 'Nemo Eriksson',
        'role': 'CTO & Website Developer',
        'text': 'I\'m responsible for developing & designing our website but also help with product development.',
        'image': 'images/faces/nemo.jpg'
    },
    {
        'name': 'John Falkdal',
        'role': 'CCO & Product Developer',
        'text': 'I put forward and implement new ideas about how we can further develop & innovate our product.',
        'image': 'images/faces/john.jpg'
    },
    {
        'name': 'Sam Gustafsson',
        'role': 'Product Developer',
        'text': '"Min roll i företaget är en salami" - Sam 2024 ',
        'image': 'images/faces/sam.jpg'
    }
]

export const load = (async () => {
    const products = prisma.device.findMany();
    const images = prisma.progressImage.findMany();
    
    return {products, images, members};
}) satisfies PageServerLoad;