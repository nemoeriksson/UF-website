import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
export const data = {
    "imageData": [
        {
            "src": "collection/code.png",
            "description": "This website is made using Svelte and most code is written in HTML, CSS or Typescript",
            "offset": 0
        },
        {
            "src": "collection/github.png",
            "description": "This website is open source, meaning that all code is available on GitHub for the public to look at and improve",
            "offset": 0
        },
        {
            "src": "collection/raspberry.jpg",
            "description": "The hardware we currently use for our prototype is the Raspberry Pi, but we plan on using a Raspberry Pico for the final product",
            "offset": 50
        },
        {
            "src": "trees.jpg",
            "description": "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum "
        },
        {
            "src": "trees.jpg",
            "description": "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum "
        },
        {
            "src": "trees.jpg",
            "description": "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum "
        },
        {
            "src": "trees.jpg",
            "description": "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum "
        },
        {
            "src": "trees.jpg",
            "description": "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum "
        }
    ],
    "members": [
        {
            "name": "Irma Zimmerman",
            "role": "CEO",
            "text": "I represent the company externally but also take the major decisions & lead the company forwards.",
            "image": "images/faces/irma.jpg"
        },
        {
            "name": "Nemo Eriksson",
            "role": "CTO & Website Developer",
            "text": "I\"m responsible for developing & designing our website but also help with product development.",
            "image": "images/faces/nemo.jpg"
        },
        {
            "name": "John Falkdal",
            "role": "CCO & Product Developer",
            "text": "I put forward and implement new ideas about how we can further develop & innovate our product.",
            "image": "images/faces/john.jpg"
        },
        {
            "name": "Sam Gustafsson",
            "role": "Product Developer",
            "text": "I am responsible for further developing and manufacturing our product",
            "image": "images/faces/sam.jpg"
        }
    ]
}