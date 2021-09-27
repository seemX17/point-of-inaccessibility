import axios from 'axios';

const url = 'http://localhost:3004/images';

export type imageModel = {
    id?: number,
    svg: string,
    name: string,
    createdAt: Date
}

export function getImages() {
    return axios.get(url)
}

export function addNewImage(payload: imageModel) {
    return axios.post(url, payload);
}