import axios from 'axios'
import { HOST } from '../utils/constaints'





export const apiClient = axios.create({
    baseURL: HOST,
    
  });