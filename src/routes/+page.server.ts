import { prisma } from '$lib';
import type { PageServerLoad } from './$types';

const members = [
    {
        'name': 'Irma Zimmerman',
        'role': 'CEO',
        'text': 'Lorem ipsum dolor amit lorem ipsum dolor amit lorem ipsum dolor amit ',
        'image': 'images/faces/irma.jpg'
    },
    {
        'name': 'Nemo Eriksson',
        'role': 'CTO & Website Developer',
        'text': 'Lorem ipsum dolor amit lorem ipsum dolor amit lorem ipsum dolor amit ',
        'image': 'images/faces/nemo.jpg'
    },
    {
        'name': 'John Falkdal',
        'role': 'CCO & Product Developer',
        'text': 'Lorem ipsum dolor amit lorem ipsum dolor amit lorem ipsum dolor amit ',
        'image': 'images/faces/john.jpg'
    },
    {
        'name': 'Sam Gustafsson',
        'role': 'Product Developer',
        'text': 'Lorem ipsum dolor amit lorem ipsum dolor amit lorem ipsum dolor amit ',
        'image': 'images/faces/sam.jpg'
    }
]

export const load = (async () => {
    const products = prisma.device.findMany();
    const images = prisma.progressImage.findMany();
    
    return {products, images, members};
}) satisfies PageServerLoad;