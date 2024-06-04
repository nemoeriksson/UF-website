import { invalidateAll } from "$app/navigation";
import { PrismaClient } from "@prisma/client";
import Chart, { type ChartConfiguration } from 'chart.js/auto';
export const prisma = new PrismaClient();

export const data = {
    "imageData": [
        {
            "src": "collection/code.webp",
            "description": "This website is made using Svelte and most code is written in HTML, CSS or Typescript",
            "offset": 0
        },
        {
            "src": "collection/github.webp",
            "description": "This website is open source, meaning that all code is available on GitHub for the public to look at and improve",
            "offset": 0
        },
        {
            "src": "collection/raspberry.webp",
            "description": "The hardware we currently use for our prototype is the Raspberry Pi, but we plan on using a Raspberry Pico for the final product",
            "offset": 50
        },
        {
            "src": "trees.webp",
            "description": "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum "
        },
        {
            "src": "trees.webp",
            "description": "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum "
        },
        {
            "src": "trees.webp",
            "description": "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum "
        },
        {
            "src": "trees.webp",
            "description": "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum "
        },
        {
            "src": "trees.webp",
            "description": "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum "
        }
    ],
    "members": [
        {
            "name": "Irma Zimmerman",
            "role": "CEO",
            "text": "I represent the company externally but also take the major decisions & lead the company forwards.",
            "image": "images/faces/irma.webp"
        },
        {
            "name": "Nemo Eriksson",
            "role": "CTO & Website Developer",
            "text": "I\"m responsible for developing & designing our website but also help with product development.",
            "image": "images/faces/nemo.webp"
        },
        {
            "name": "John Falkdal",
            "role": "CCO & Product Developer",
            "text": "I put forward and implement new ideas about how we can further develop & innovate our product.",
            "image": "images/faces/john.webp"
        },
        {
            "name": "Sam Gustafsson",
            "role": "Product Developer",
            "text": "I am responsible for further developing and manufacturing our product",
            "image": "images/faces/sam.webp"
        }
    ]
}

let bluetooth:any = null;
const UART_SERVICE_ID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E'.toLowerCase();
const CHARACTERISTIC_TX = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E'.toLowerCase();
const CHARACTERISTIC_RX = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'.toLowerCase();
const maxSendSize = 16;

export function connectButton(userId:string){
    requestDevice(userId);
}

async function onDisconnect(){
    console.log('Blue device disconnected');
}

async function requestDevice(userId:string){
    console.log('Requesting bluetooth devices');
    //@ts-ignore
    const device = await navigator.bluetooth.requestDevice({
        filters: [{namePrefix:"SP:"}],
        optionalServices: [ UART_SERVICE_ID ]
    });
    await connectDevice(device, userId);
    console.log('Device Connected');
}

async function sendMessage(userId:string){
    const wifiSSID = prompt('Enter WiFi network name: ');
    const wifiPassword = prompt('Enter WiFi network password: ') || '';

    const content = JSON.stringify({
        "ssid": wifiSSID,
        "pswd": wifiPassword,
        'uuid': userId
    });
    const contentLength = content.length.toString();
    const iterationCount = Math.ceil(content.length/maxSendSize);

    const service = await bluetooth.getPrimaryService(UART_SERVICE_ID);
    console.log('Getting characteristics');
    const characteristic = await service.getCharacteristic(CHARACTERISTIC_RX);
    console.log('Writing value');
    const encoder = new TextEncoder();

    const lengthData = encoder.encode(contentLength);
    await characteristic.writeValue(lengthData);

    for(let i = 0; i<iterationCount; i++) {
        const substring = content.substring(i * maxSendSize, i * maxSendSize + maxSendSize);        
        const data = encoder.encode(substring);
        await characteristic.writeValue(data);
    }

    setInterval(async()=>{
        await characteristic.writeValue(encoder.encode('FAKE DATA'));
    }, 10000);
}

async function connectDevice(device:any, userId:string){
    device.addEventListener('gattserverdisconnected', onDisconnect);
    bluetooth = await device.gatt.connect();

    return new Promise(async() => {
        console.log('Getting UART service');
        const service = await bluetooth.getPrimaryService(UART_SERVICE_ID);
        console.log('Getting characteristic');
        const characteristic_tx = await service.getCharacteristic(CHARACTERISTIC_TX);
        await characteristic_tx.startNotifications();
        characteristic_tx.addEventListener('characteristicvaluechanged', handleNotifications); 
        sendMessage(userId);
    });
}

let deviceData = {};

function handleNotifications(event:any){
    const value = event.target.value;
    const decoder = new TextDecoder('utf-8');
    const recString = decoder.decode(value);

    deviceData = JSON.parse(recString);
    updateDeviceData();
    
    invalidateAll();
}

function updateDeviceData(){
    const content = JSON.stringify(deviceData);

    fetch('?/', {
        method: 'POST',
        body: content
    }).then(()=>{
        invalidateAll();
    });
}

export function updateGraph(graph:Chart, newData:any){
    const data = generateDataset(newData);
    if(data.datasets[0].data != graph.data.datasets[0].data){
        graph.data = data;
        graph.update('none');
    }
    if(data.labels != data.labels){
        graph.data.labels = data.labels;
        graph.update('none');
    }
}

export function generateDataset(data:any){
    const chartData = {
        labels: data['graph']['dates'],
        datasets: [
            {
                data: data['graph']['values'],
                fill: false,
                borderColor: ['#23714d', '#ff0f0f'][data['graph']['values'][data['graph']['values'].length - 1] <= data.lowAlert ? 1 : 0],
                tension: 0
            }
        ]
    }
    return chartData;
}

export function generateGraph(canvas: HTMLCanvasElement, newData:any) {
    const ctx = canvas.getContext('2d');
    if(!ctx)
        throw new Error(`Failed to read canvas context ${canvas}`);
        
    const data = generateDataset(newData);
    const config:ChartConfiguration = {
        type: "line",
        data: data,
        options: {
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                },
                title: {
                        display: true,
                        text: "Moisture %"
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 25
                    }
                },
            },
            aspectRatio: 2 / 1
        }
    }
    return new Chart(ctx, config);
}
