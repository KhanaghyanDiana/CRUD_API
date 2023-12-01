import * as url from 'url';
import {
  DELETE,
  DELETE_USER,
  GET,
  GET_USER,
  GET_USER_BY_ID,
  HOME,
  POST,
  POST_USER,
  PUT,
  PUT_USER_UPDATE,
} from './constants.js';
import {
  deleteUserHelper,
  filterUserHelper,
  replaceURLHelper,
  responseHelper,
  updateUserHelper } from './helper.js';
import { data } from './data.js';

export const handleRequest = (req, res) => {
  const parsedUrl = url.parse(req.url, true).pathname;
  const pathSegments = parsedUrl.split('/');
  const userId = pathSegments[pathSegments.length - 1];

  switch (true) {
    case req.method === GET && parsedUrl === HOME:
      responseHelper(res, { status: 200, mes: 'Crud API', header: 'text/plain' });
      break;
      case req.method === GET && parsedUrl === GET_USER:
      responseHelper(res, { status: 200, mes:data, header: 'application/json' });
      break;

    case req.method === GET && parsedUrl === replaceURLHelper(GET_USER_BY_ID, userId):
      if (userId) {
        const user = filterUserHelper(data, userId);
        if (user.length > 0) {
          responseHelper(res, {
            status: 200,
            mes: user,
            header: 'application/json',
          });
        } else {
          responseHelper(res, {
            status: 404,
            mes: `No user with id: ${userId}`,
            header: 'text/plain',
          });
        }
      } else {
        responseHelper(res, { status: 400, mes: 'Invalid ID in the request', header: 'text/plain' });
      }
      break;

    case req.method === POST && parsedUrl === POST_USER:
      req.on('data', chunk => {
        const { id, username, age, hobbies } = JSON.parse(chunk.toString());
        if (id && username && age && hobbies.length > 0) {
          const createdUser = [...data, JSON.parse(chunk)];
          responseHelper(res, {
            status: 201,
            mes: JSON.stringify({ message: 'New User Is created', data: createdUser }),
            header: 'application/json',
          });
        } else {
          responseHelper(res, { status: 404, mes: 'Please specify all required fields', header: 'text/plain' });
        }
      });
      break;

    case req.method === PUT && parsedUrl === replaceURLHelper(PUT_USER_UPDATE, userId):
      if (userId) {
        req.on('data', chunk => {
          const body = JSON.parse(chunk.toString());
          const updatedUser = updateUserHelper(data, userId, body);
          responseHelper(res, {
            status: 200,
            mes: JSON.stringify({ message: 'User info is updated', data: updatedUser }),
            header: 'application/json',
          })
        });
      } else {
        responseHelper(res, { status: 400, mes:  'ID is not valid', header: 'text/plain' });
      }
      break;

    case req.method === DELETE && parsedUrl === replaceURLHelper(DELETE_USER, userId):

        if (deleteUserHelper(data, userId)) {
          responseHelper(res, { status: 204, mes:
              JSON.stringify('User is Deleted'),
            header: 'text/plain' });
        }
      s
      break;
      default:
      responseHelper(res, { status: 404, mes: 'Not Found', header: 'text/plain' });
  }
};