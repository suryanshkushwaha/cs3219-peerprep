export interface ReqObj {
    userId: string;
    topic: string;
    difficulty: string;
    status: 'pending' | 'matched';
    createdAt: Date;
  }
  
  export default ReqObj;
  