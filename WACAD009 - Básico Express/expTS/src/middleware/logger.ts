import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

type LogType = 'simples' | 'completo';

export function logger(logType: LogType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const logDir = process.env.LOG_DIR || 'logs';

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, 'access.log');

    const timestamp = new Date().toISOString();

    let message: string;

    if (logType === 'simples') {
      message =
        `[${timestamp}] ` +
        `${req.method} ${req.originalUrl}\n`;
    } else {
      message =
        `[${timestamp}] ` +
        `${req.method} ${req.originalUrl} ` +
        `HTTP/${req.httpVersion} ` +
        `User-Agent: ${req.get('User-Agent')}\n`;
    }

    fs.appendFileSync(logFile, message);

    next();
  };
}