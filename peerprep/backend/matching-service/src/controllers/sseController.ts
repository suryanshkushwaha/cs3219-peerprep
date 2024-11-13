import { Request, Response } from 'express';
import { updateStatus } from '../services/statusService'; // Updated imports

// SSE endpoint to stream match status updates
/*
export const matchStatusStream = (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Ensure headers are sent immediately

    const userId = req.params.userId as string; // Get userId from URL parameters
    const timeout = 33330; // 30-second timeout for example
    const startTime = Date.now();

    // Function to send data to client
    const sendEvent = (data: any) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Periodic check for a match
    const interval = setInterval(async () => {
        try {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, (timeout - elapsedTime) / 1000).toFixed(1); // In seconds

            // Check if the timeout has been reached
            if (elapsedTime > timeout) {
                clearInterval(interval);
                await deleteRequest(userId); // Remove request if no match
                sendEvent({ status: 'timeout', message: 'No match found, request timed out', remainingTime: '0.0' });
                res.end(); // Close the connection
                return;
            }

            const matchedUser = await findMatchInQueue(userId);
            if (matchedUser) {
                // Send match found event and close the connection
                sendEvent({ status: 'matched', message: 'Match found', data: matchedUser });
                clearInterval(interval);
                res.end(); // Close the connection after match
            } else {
                // Keep the connection alive by sending heartbeat with remaining time
                sendEvent({ status: 'waiting', message: 'Still waiting for a match...', remainingTime });
            }
        } catch (error) {
            console.error('Error in SSE:', error);
            clearInterval(interval);
            sendEvent({ status: 'error', message: 'An error occurred while processing your request.' });
            res.end();
        }
    }, 1000); // Check every second

    // Handle client disconnect
    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });
};
*/
// SSE endpoint to stream match status updates
export const matchStatusStream = (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Ensure headers are sent immediately

    const userId = req.params.userId as string; // Get userId from URL parameters
    const intervalTime = 1000; // Check every second

    // Function to send data to client
    const sendEvent = (data: any) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Periodic check for the current status of the match request
    const interval = setInterval(async () => {
        try {
            // Call the updateStatus function to get the latest status
            const statusMessage = await updateStatus(userId);

            // Send the status message to the client
            sendEvent({ status: 'update', message: statusMessage });

            // Check if the request no longer exists (e.g., it's completed or timed out)
            if (statusMessage.includes("not in queue")) {
                clearInterval(interval);
                res.end(); // Close the connection
            }
        } catch (error) {
            console.error('Error in SSE:', error);
            clearInterval(interval);
            sendEvent({ status: 'error', message: 'An error occurred while processing your request.' });
            res.end();
        }
    }, intervalTime); // Check every second

    // Handle client disconnect
    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });
};