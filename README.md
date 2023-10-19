<a name="readme-top"></a>

## About The Project
This website is created for to the _"[Screaming Plant UF](https://ungforetagsamhet.se/company/screaming-plant-uf)"_. 

This is a project where students get to start a company for one school year and develop a product, physical or digital. We have chosen to create a device that detects if a plant needs to be watered in order for people to remember watering their plants.

This website will both work as an artificial webshop or about page where users can find the product and read more about it but it also has a login feature where users can change notification sounds, intervals and other settings for their device.

The name _"Screaming Plant"_ comes from the initial idea of making the device play a screaming sound whenever it needs to be watered.

## Installation

_Below are instructions for installing the repo and some good commands to know for database handling and running the page on localhost_

#### Prerequisites
* npm
    ```sh
    npm install npm@latest -g
    ```

#### Downloading the repo

1. Clone the repo
    ```sh
    git clone https://github.com/nemoeriksson/UF-website.git
    ```
2. Install npm packages
    ```sh
    npm install
    ```
3. Run development website on localhost
    ```sh
    npm run dev
    ```
4. Host development website _(optional)_
    ```sh
    npm run host
    ```

#### Prisma database commands
Open database interface in browser
```sh
npx prisma studio
```

Pushing changes made in `schema.prisma`
```sh
npx prisma db push
```

Resetting database
```sh
npx prisma migrate reset
npx prisma db push
```
    
## Contact

Instagram - [@ScreamingPlantUF](https://www.instagram.com/screamingplantuf)

Project Link: [https://github.com/nemoeriksson/UF-website](https://github.com/nemoeriksson/UF-website)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
