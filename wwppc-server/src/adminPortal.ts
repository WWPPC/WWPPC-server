import express from 'express';
import Database from './database';
import Logger from './log';

export function attachAdminPortal(db: Database, app: express, logger: Logger) {
    // just http, no socket.io
}

export default attachAdminPortal;