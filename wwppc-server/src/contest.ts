import { Socket } from "socket.io";
import { AccountData, Submission } from "./database";

/**
 * 
 */
export class ContestManager {
    #users: Map<string, Set<Socket>> = new Map();
    // socketio connections are put in sets mapped to username
    // responsible for serving round data and problem data
    // the user must be signed in and registered for the contest and division of the round/problem AND THE ROUND HAS TO BE ACTIVE

    #submissionQueue: unknown; // make this a queue or something idk
    // queue of submissions, will be popped from when /api/v4/judgehosts/fetch-work is called

    // all socketio connections are put here (IN A SET NOT AN ARRAY)
    // start/stop rounds, control which problems are where
    // uses database to get problems and then caches them (also stores division, round, number since client needs that)
    // also only one contest page open per account
    // remember to prevent large file submissions (over 10kb is probably unnecessarily large for these problems)
    // use socket.io rooms
    // 

    /**
     * Queue a submission to be judged
     * @param {Submission} submission submission
     * @param user user that made the submission
     * @returns {boolean} whether the thing was successfully pushed to the queue
     */
    queueSubmission(user: string, submission: Submission) {
        return true;
    }
}

export default ContestManager;