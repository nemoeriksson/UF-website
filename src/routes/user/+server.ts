import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib';

export const GET: RequestHandler = async () => {
    return json({'content':'GET'});
};

export const POST: RequestHandler = async ({request, cookies}) => {
    const data = await request.json();
    const tokenId = cookies.get('token');

    if(tokenId && data['deviceId']){
        const token = await prisma.token.findUnique({
            where: {
                id: tokenId,
            }
        });    

        if(token){
            await prisma.device.upsert({
                where: {
                    id: data['deviceId']
                },
                update: {
                    data: data['deviceData']
                },
                create: {
                    id: data['deviceId'],
                    data: data['deviceData'],
                    ownerID: token.userID
                }
            });
        }
    }

    return json({'content': 'POST'});
};
