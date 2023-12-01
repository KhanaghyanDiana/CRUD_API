import request from 'supertest'
import { server } from '../index.js';
import { DELETE_USER, GET_USER, HOME, PUT_USER_UPDATE } from '../constants.js';

import { replaceURLHelper } from '../helper.js';

describe('CRUD API', () => {
   test('HOME API', async () => {
      const response = await request(server).get(HOME);
      expect(response.status).toBe(200);
   })
     test('GET USERS', async () => {
      const response = await request(server).get(GET_USER);
      expect(response.status).toBe(200);
      expect(response.data).not.toBe([])
     })
     test('GET USERS', async () => {
        const response = await request(server).get(GET_USER);
        expect(response.status).toBe(200);
        expect(response.data).not.toBe([])
     })
    test('GET USERS BY ID', async () => {
      const response = await request(server).post("/api/users").send({
        id:5,
        username:"Lia",
        age:20,
        hobbies:["dance", "climbing"]

      });
      const createdUser = JSON.parse(response.text)
      expect(response.status).toBe(201);
      expect(createdUser.username).toBe(response.username)

    })
    test('UPDATE USER BY ID', async () => {
      const response = await request(server).put(replaceURLHelper(PUT_USER_UPDATE, 2)).send({
        id:2,
        username:"Diana",
        age:20,
        hobbies:["dance"]

      });
      const createdUser = JSON.parse(response.text)
      expect(response.status).toBe(200);
      expect(createdUser.username).toBe(response.username)

    })
    test('DELETE USER BY ID', async () => {
      const response = await request(server).delete(replaceURLHelper(DELETE_USER, 2))
      expect(response.status).toBe(204);
    })
}

)
