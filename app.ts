import { Application, Router } from 'https://deno.land/x/oak/mod.ts';

const env = Deno.env.toObject();
const PORT = env.PORT || 4000;
const HOST = env.HOST || '127.0.0.1';

let dogs = [
    {
        name: 'Roger',
        age: 8,
    },
    {
        name: 'Syd',
        age: 7,
    },
];

export const getDogs: any = ({ response }: any) => response.body = dogs;

export const getDog: any = ({ params, response }: any) => {
    const dog = dogs.filter(dog => dog.name === params.name);
    if(dog.length) {
        response.status = 200;
        response.body = dog[0];
        return;
    } 

    response.status = 400;
    response.body = { msg: `Cannot find dog ${params.name}` };
};

export const addDog: any = async ({ request, response }: any) => {
    const body = await request.body();
    const dog = body.value;
    dogs.push(dog);

    response.body = {msg: 'OK'};
    response.status = 200;

    return;
};

export const updateDog: any = async ({ params, request, response }: any) => {
    const dog = dogs.filter(dog => dog.name === params.name);
    
    const body = await request.body();
    const { age } = body.value;

    if(dog.length) {
        dog[0].age = age;
        response.status = 200;
        response.body = { msg: 'OK'};
        return;
    }

    response.status = 400;
    response.body = { msg: `Cannot find dog ${params.name}` };
};

export const deleteDog: any = ({ params, response }: any) => {
    const lengthBefore = dogs.length;
    const dog = dogs.filter(dog => dog.name !== params.name);
    if(dog.length === lengthBefore) {
        response.status = 400;
        response.body = { msg: `Cannot find dog ${params.name}` };
        return;
    } 
    
        response.status = 200;
        response.body = { msg: `Removed dog ${params.name}`  };

};

const router = new Router();
router
    .get('/dogs', getDogs)
    .get('/dogs/:name', getDog)
    .post('/dogs', addDog)
    .put('/dogs/:name', updateDog)
    .delete('/dogs/:name', deleteDog);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on port ${PORT} ...`);

await app.listen(`${HOST}:${PORT}`);