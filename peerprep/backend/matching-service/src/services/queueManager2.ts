import { ChainableCommander } from 'ioredis';
import * as redis from '../utils/redisUtils2';

// Declare global timeout for matching
const MATCH_TIMEOUT_SECONDS = 30;